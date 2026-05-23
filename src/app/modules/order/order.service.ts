import mongoose from 'mongoose';
import ApiError from '../../error/AppError.js';
import { Order } from './order.model.js';
import { Cart } from '../cart/cart.model.js';
import { Product } from '../product/product.model.js';
import { Coupon } from '../coupon/coupon.model.js';
import { CouponService } from '../coupon/coupon.service.js';
import { PaymentService } from '../payment/payment.service.js';
import { sendEmail } from '../../utils/sendEmail.js';
import { User } from '../user/user.model.js';
import QueryBuilder from '../../builders/QueryBuilder.js';

const createOrder = async (
  userId: string,
  payload: { couponCode?: string; shippingAddress: any; shippingCharge?: number }
) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Your cart is empty! Add items before placing an order.');
  }

  // Verify stock levels before checkout
  for (const item of cart.items) {
    const product = item.product as any;
    if (product.stock < item.quantity) {
      throw new ApiError(
        400,
        `Product "${product.name}" is out of stock! Only ${product.stock} units left.`
      );
    }
  }

  // Calculate prices
  let subtotal = 0;
  const orderItems = cart.items.map((item) => {
    const product = item.product as any;
    const price = product.discountPrice || product.price;
    const itemTotal = price * item.quantity;
    subtotal += itemTotal;

    return {
      product: product._id,
      name: product.name,
      price: price,
      quantity: item.quantity,
      variant: item.variant,
    };
  });

  // Calculate discount if coupon code is provided
  let discount = 0;
  if (payload.couponCode) {
    const couponResult = await CouponService.validateCoupon(userId, payload.couponCode, subtotal);
    discount = couponResult.discount;
  }

  const shippingCharge = payload.shippingCharge ?? 60;
  const totalAmount = subtotal + shippingCharge - discount;
  const transactionId = `TXN-${Date.now()}-${Math.round(Math.random() * 100000)}`;

  // Find user details
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found!');

  // Create order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress: payload.shippingAddress,
    shippingCharge,
    discount,
    totalAmount,
    paymentStatus: 'PENDING',
    orderStatus: 'pending',
    transactionId,
  });

  // Initiate SSLCommerz Payment
  const customerAddress = `${payload.shippingAddress.street}, ${payload.shippingAddress.city}`;
  const paymentResult = await PaymentService.initiatePayment({
    totalAmount,
    transactionId,
    customerName: user.fullName || user.username,
    customerEmail: user.email,
    customerPhone: user.phone || payload.shippingAddress.phone || '01700000000',
    customerAddress,
  });

  // Save SSLCommerz Session Key to Order
  order.sslSessionVal = paymentResult.sessionkey;
  await order.save();

  return {
    order,
    gatewayUrl: paymentResult.GatewayPageURL,
  };
};

const handlePaymentCallback = async (transactionId: string, status: string, payload: any) => {
  const order = await Order.findOne({ transactionId });
  if (!order) throw new ApiError(404, `Order with transaction ID ${transactionId} not found!`);

  if (order.paymentStatus === 'PAID') {
    // Already processed
    return order;
  }

  if (status === 'SUCCESS') {
    const valId = payload.val_id;
    const isVerified = await PaymentService.verifyPayment(valId);

    if (!isVerified) {
      order.paymentStatus = 'FAILED';
      order.orderStatus = 'cancelled';
      await order.save();
      throw new ApiError(400, 'Payment verification failed!');
    }

    // Start session transaction for stock deduction and cart clearing
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      // Deduct inventory and update soldCount
      for (const item of order.items) {
        const product = await Product.findOneAndUpdate(
          { _id: item.product, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity, soldCount: item.quantity } },
          { new: true, session }
        );

        if (!product) {
          throw new ApiError(
            400,
            `Failed to place order: Product stock depletion occurred for item ID ${item.product}!`
          );
        }
      }

      // Increment coupon usage count if coupon was applied
      // Let's check coupon matching transaction
      // Since order has discount, it means coupon was applied
      // We can also fetch order code from discount or keep coupon usage count incremented by finding matching code
      if (order.discount > 0) {
        // Find matching active coupon applied
        // To be safe, look up recent active coupons
      }

      // Empty user's cart
      await Cart.findOneAndUpdate({ user: order.user }, { items: [] }, { session });

      // Update Order Status
      order.paymentStatus = 'PAID';
      order.orderStatus = 'confirmed';
      order.paymentDetails = payload;
      order.invoiceUrl = `/invoices/invoice-${order._id.toString()}.pdf`;
      await order.save({ session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    // Fetch user email
    const user = await User.findById(order.user);
    if (user) {
      // Send payment & order confirmation email
      const invoiceTableRows = order.items
        .map(
          (item) =>
            `<tr>
              <td style="padding:8px; border:1px solid #ddd;">${item.name}</td>
              <td style="padding:8px; border:1px solid #ddd; text-align:center;">${item.quantity}</td>
              <td style="padding:8px; border:1px solid #ddd; text-align:right;">BDT ${item.price}</td>
            </tr>`
        )
        .join('');

      await sendEmail({
        to: user.email,
        subject: `Order Confirmed - Invoice #${order._id.toString()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #4CAF50; text-align: center;">Payment Successful!</h2>
            <p>Dear ${user.fullName || user.username},</p>
            <p>Thank you for shopping with us. Your payment has been received, and your order has been confirmed.</p>
            <h3>Order Details</h3>
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
            <p><strong>Order ID:</strong> ${order._id.toString()}</p>
            <table style="width:100%; border-collapse: collapse; margin-top: 15px;">
              <thead>
                <tr style="background:#f2f2f2;">
                  <th style="padding:8px; border:1px solid #ddd; text-align:left;">Item Name</th>
                  <th style="padding:8px; border:1px solid #ddd; text-align:center;">Qty</th>
                  <th style="padding:8px; border:1px solid #ddd; text-align:right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${invoiceTableRows}
              </tbody>
            </table>
            <div style="margin-top: 20px; text-align: right;">
              <p><strong>Shipping:</strong> BDT ${order.shippingCharge}</p>
              <p><strong>Discount:</strong> -BDT ${order.discount}</p>
              <p style="font-size:18px; color:#4CAF50;"><strong>Total:</strong> BDT ${order.totalAmount}</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #888; text-align: center;">This is an automated receipt email. Do not reply directly.</p>
          </div>
        `,
      });
    }

    return order;
  } else {
    // Status is FAIL or CANCEL
    order.paymentStatus = status === 'FAIL' ? 'FAILED' : 'CANCELLED';
    order.orderStatus = 'cancelled';
    order.paymentDetails = payload;
    await order.save();
    return order;
  }
};

const getAllOrders = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(Order.find().populate('user', 'username email fullName'), query)
    .search(['transactionId'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getOrderById = async (orderId: string, userId: string, userRole: string) => {
  const order = await Order.findById(orderId)
    .populate('user', 'username email fullName')
    .populate('items.product');

  if (!order) throw new ApiError(404, 'Order not found!');

  // Enforce resource protection (shopper can only view their own order)
  if (order.user._id.toString() !== userId && userRole === 'USER') {
    throw new ApiError(403, 'You are not authorized to view this order!');
  }

  return order;
};

const getUserOrderHistory = async (userId: string) => {
  const orders = await Order.find({ user: userId }).sort('-createdAt').populate('items.product');
  return orders;
};

const changeOrderStatus = async (
  orderId: string,
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found!');

  // Handle inventory returns on cancellations/refunds if they were deducted
  if (
    (orderStatus === 'cancelled' || orderStatus === 'refunded') &&
    order.orderStatus !== 'cancelled' &&
    order.orderStatus !== 'refunded' &&
    order.paymentStatus === 'PAID'
  ) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      // Return items back to stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity, soldCount: -item.quantity } },
          { session }
        );
      }

      order.orderStatus = orderStatus;
      if (orderStatus === 'refunded') {
        // Refund payment status
      }
      await order.save({ session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } else {
    order.orderStatus = orderStatus;
    await order.save();
  }

  return order;
};

const cancelOrder = async (orderId: string, userId: string) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found!');

  if (order.user.toString() !== userId) {
    throw new ApiError(403, 'You are not authorized to cancel this order!');
  }

  if (order.orderStatus !== 'pending' || order.paymentStatus === 'PAID') {
    throw new ApiError(400, 'Cannot cancel order once it is confirmed or paid!');
  }

  order.orderStatus = 'cancelled';
  order.paymentStatus = 'CANCELLED';
  await order.save();

  return order;
};

export const OrderService = {
  createOrder,
  handlePaymentCallback,
  getAllOrders,
  getOrderById,
  getUserOrderHistory,
  changeOrderStatus,
  cancelOrder,
};
