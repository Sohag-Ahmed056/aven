import type { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import { CartService } from './cart.service.js';

const getCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const result = await CartService.getCart(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cart fetched successfully!',
    data: result,
  });
});

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const result = await CartService.addToCart(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Item added to cart successfully!',
    data: result,
  });
});

const updateQuantity = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const { productId } = req.params;
  const { quantity } = req.body;
  const result = await CartService.updateQuantity(userId, productId as string, quantity);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cart item quantity updated successfully!',
    data: result,
  });
});

const removeItem = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const { productId } = req.params;
  const result = await CartService.removeItem(userId, productId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Item removed from cart successfully!',
    data: result,
  });
});

const clearCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const result = await CartService.clearCart(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cart cleared successfully!',
    data: result,
  });
});

export const CartController = {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
};
