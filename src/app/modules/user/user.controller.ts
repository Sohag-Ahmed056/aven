import type { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import { UserService } from './user.service.js';
import ApiError from '../../error/AppError.js';

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const result = await UserService.updateProfile(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile updated successfully!',
    data: result,
  });
});

const uploadAvatar = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  if (!req.file) {
    throw new ApiError(400, 'Please select an avatar image file to upload!');
  }

  const result = await UserService.uploadAvatar(userId, req.file.path);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Avatar uploaded successfully!',
    data: result,
  });
});

const addAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const result = await UserService.addAddress(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Shipping address added successfully!',
    data: result,
  });
});

const removeAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const { addressId } = req.params;
  const result = await UserService.removeAddress(userId, addressId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shipping address removed successfully!',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users fetched successfully!',
    meta: result.meta,
    data: result.result,
  });
});

const changeRole = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { role } = req.body;
  const result = await UserService.changeRole(userId as string, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User role updated successfully!',
    data: result,
  });
});

const changeStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { status } = req.body;
  const result = await UserService.changeStatus(userId as string, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User account status updated successfully!',
    data: result,
  });
});

export const UserController = {
  updateProfile,
  uploadAvatar,
  addAddress,
  removeAddress,
  getAllUsers,
  changeRole,
  changeStatus,
};
