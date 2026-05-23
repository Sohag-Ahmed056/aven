import type { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import { ReviewService } from './review.service.js';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const result = await ReviewService.createReview(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Review submitted successfully!',
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const { id } = req.params;
  const result = await ReviewService.updateReview(userId, id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review updated successfully!',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const userRole = req.user?.role as string;
  const { id } = req.params;
  const result = await ReviewService.deleteReview(userId, userRole, id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review deleted successfully!',
    data: result,
  });
});

const getProductReviews = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await ReviewService.getProductReviews(productId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reviews fetched successfully!',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
};
