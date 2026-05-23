import type { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import { WishlistService } from './wishlist.service.js';

const getWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const result = await WishlistService.getWishlist(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Wishlist fetched successfully!',
    data: result,
  });
});

const addToWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const { product } = req.body;
  const result = await WishlistService.addToWishlist(userId, product as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product added to wishlist successfully!',
    data: result,
  });
});

const removeFromWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const { productId } = req.params;
  const result = await WishlistService.removeFromWishlist(userId, productId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product removed from wishlist successfully!',
    data: result,
  });
});

export const WishlistController = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
