import type { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import { OrderService } from './order.service.js';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const result = await OrderService.createOrder(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Order created successfully!',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllOrders(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Orders fetched successfully!',
    meta: result.meta,
    data: result.result,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const userRole = req.user?.role as string;
  const { id } = req.params;
  const result = await OrderService.getOrderById(id as string, userId, userRole);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order fetched successfully!',
    data: result,
  });
});

const getUserOrderHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const result = await OrderService.getUserOrderHistory(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order history fetched successfully!',
    data: result,
  });
});

const changeOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { orderStatus } = req.body;
  const result = await OrderService.changeOrderStatus(id as string, orderStatus);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order status updated successfully!',
    data: result,
  });
});

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const { id } = req.params;
  const result = await OrderService.cancelOrder(id as string, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order cancelled successfully!',
    data: result,
  });
});

// SSLCommerz payment gateway callbacks
const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const { tran_id } = req.query;
  // SSLCommerz sends gateway details in the request body as a POST redirect
  const payload = req.body;
  const transactionId = (tran_id || payload.tran_id) as string;

  await OrderService.handlePaymentCallback(transactionId, 'SUCCESS', payload);

  res.send(`
    <html>
      <head>
        <title>Payment Successful</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 50px; background-color: #f7f9fa; }
          .container { max-width: 500px; margin: auto; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          h1 { color: #4CAF50; margin-bottom: 10px; }
          p { color: #555; font-size: 16px; margin-bottom: 25px; }
          .btn { display: inline-block; background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div style="font-size: 72px;">✅</div>
          <h1>Payment Successful!</h1>
          <p>Your transaction has been verified. Transaction ID: <strong>${transactionId}</strong>.</p>
          <a href="http://localhost:3000/orders" class="btn">View Order History</a>
        </div>
      </body>
    </html>
  `);
});

const paymentFail = catchAsync(async (req: Request, res: Response) => {
  const { tran_id } = req.query;
  const payload = req.body;
  const transactionId = (tran_id || payload.tran_id) as string;

  await OrderService.handlePaymentCallback(transactionId, 'FAIL', payload);

  res.send(`
    <html>
      <head>
        <title>Payment Failed</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 50px; background-color: #f7f9fa; }
          .container { max-width: 500px; margin: auto; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          h1 { color: #f44336; margin-bottom: 10px; }
          p { color: #555; font-size: 16px; margin-bottom: 25px; }
          .btn { display: inline-block; background-color: #f44336; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div style="font-size: 72px;">❌</div>
          <h1>Payment Failed!</h1>
          <p>Something went wrong during transaction processing. Transaction ID: <strong>${transactionId}</strong>.</p>
          <a href="http://localhost:3000/cart" class="btn">Try Again</a>
        </div>
      </body>
    </html>
  `);
});

const paymentCancel = catchAsync(async (req: Request, res: Response) => {
  const { tran_id } = req.query;
  const payload = req.body;
  const transactionId = (tran_id || payload.tran_id) as string;

  await OrderService.handlePaymentCallback(transactionId, 'CANCEL', payload);

  res.send(`
    <html>
      <head>
        <title>Payment Cancelled</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 50px; background-color: #f7f9fa; }
          .container { max-width: 500px; margin: auto; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          h1 { color: #ff9800; margin-bottom: 10px; }
          p { color: #555; font-size: 16px; margin-bottom: 25px; }
          .btn { display: inline-block; background-color: #ff9800; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div style="font-size: 72px;">⚠️</div>
          <h1>Payment Cancelled</h1>
          <p>You have cancelled the payment process. Transaction ID: <strong>${transactionId}</strong>.</p>
          <a href="http://localhost:3000/cart" class="btn">Return to Cart</a>
        </div>
      </body>
    </html>
  `);
});

const paymentIpn = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const transactionId = payload.tran_id;
  const status = payload.status; // SUCCESS, FAILED, CANCELLED

  await OrderService.handlePaymentCallback(transactionId, status, payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'IPN processed successfully!',
    data: null,
  });
});

// A dummy payment gateway webpage helper to simulate SSLCommerz payments in development
const mockGateway = catchAsync(async (req: Request, res: Response) => {
  const { tran_id, amount } = req.query;

  res.send(`
    <html>
      <head>
        <title>SSLCommerz Sandboxed Payment Gateway</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 50px; background-color: #eceff1; }
          .gateway-box { max-width: 450px; margin: auto; padding: 40px; background: #ffffff; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border-top: 5px solid #002e5b; }
          .logo { font-size: 24px; font-weight: bold; color: #002e5b; margin-bottom: 20px; }
          .details { background: #f5f7f8; padding: 15px; border-radius: 6px; text-align: left; margin-bottom: 30px; font-size: 14px; }
          .details div { margin-bottom: 8px; }
          .actions { display: flex; justify-content: space-between; }
          .btn { padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; cursor: pointer; border: none; font-size: 14px; }
          .btn-success { background-color: #2e7d32; color: white; }
          .btn-fail { background-color: #c62828; color: white; }
          .btn-cancel { background-color: #ef6c00; color: white; }
        </style>
      </head>
      <body>
        <div class="gateway-box">
          <div class="logo">🔒 SSLCommerz Mock Gateway</div>
          <p>Choose transaction action for this mock order checkout.</p>
          <div class="details">
            <div><strong>Transaction ID:</strong> ${tran_id}</div>
            <div><strong>Amount:</strong> BDT ${amount}</div>
            <div><strong>Mode:</strong> Sandboxed Development Mock</div>
          </div>
          <div class="actions">
            <form action="/api/v1/payment/success?tran_id=${tran_id}" method="POST">
              <input type="hidden" name="tran_id" value="${tran_id}">
              <input type="hidden" name="val_id" value="mock_val_id_${Date.now()}">
              <input type="hidden" name="status" value="VALID">
              <button type="submit" class="btn btn-success">Success</button>
            </form>
            <form action="/api/v1/payment/fail?tran_id=${tran_id}" method="POST">
              <input type="hidden" name="tran_id" value="${tran_id}">
              <button type="submit" class="btn btn-fail">Fail</button>
            </form>
            <form action="/api/v1/payment/cancel?tran_id=${tran_id}" method="POST">
              <input type="hidden" name="tran_id" value="${tran_id}">
              <button type="submit" class="btn btn-cancel">Cancel</button>
            </form>
          </div>
        </div>
      </body>
    </html>
  `);
});

export const OrderController = {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrderHistory,
  changeOrderStatus,
  cancelOrder,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIpn,
  mockGateway,
};
