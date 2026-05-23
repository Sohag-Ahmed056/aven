import type { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import { CouponService } from './coupon.service.js';

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.createCoupon(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Coupon created successfully!',
    data: result,
  });
});

const getAllCoupons = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.getAllCoupons(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coupons fetched successfully!',
    meta: result.meta,
    data: result.result,
  });
});

const getCouponById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CouponService.getCouponById(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coupon fetched successfully!',
    data: result,
  });
});

const updateCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CouponService.updateCoupon(id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coupon updated successfully!',
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CouponService.deleteCoupon(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coupon deleted successfully!',
    data: result,
  });
});

const applyCoupon = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const { code, totalAmount } = req.body;
  const result = await CouponService.validateCoupon(userId, code as string, totalAmount);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coupon applied successfully!',
    data: result,
  });
});

export const CouponController = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
};
