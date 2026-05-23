import { Schema, model } from 'mongoose';
import type { TOrder, TOrderItem, IOrderModel } from './order.interface.js';

const OrderItemSchema = new Schema<TOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  variant: {
    name: { type: String },
    value: { type: String },
  },
});

const AddressSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
});

const OrderSchema = new Schema<TOrder, IOrderModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [OrderItemSchema],
    shippingAddress: { type: AddressSchema, required: true },
    shippingCharge: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
      index: true,
    },
    transactionId: { type: String, required: true, unique: true, index: true },
    sslSessionVal: { type: String },
    invoiceUrl: { type: String },
    paymentDetails: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

export const Order = model<TOrder, IOrderModel>('Order', OrderSchema);
