import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";

import { AuthService } from "./auth.service.js";
import sendResponse from "../../shared/sendResponse.js";

const cookieOptions = (maxAge: number) => ({
  secure:   process.env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "lax" as const,
  path:     "/",
  maxAge,
});

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  const { accessToken, refreshToken, user } = result;

  res.cookie("accessToken",  accessToken,  cookieOptions(60 * 60 * 24));
  res.cookie("refreshToken", refreshToken, cookieOptions(60 * 60 * 24 * 90));

  sendResponse(res, {
    statusCode: 201,
    success:    true,
    message:    "Account created successfully!",
    data:       { user, accessToken, refreshToken },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || "0.0.0.0";
  const result = await AuthService.login({ ...req.body, ip });
  const { accessToken, refreshToken, user } = result;

  res.cookie("accessToken",  accessToken,  cookieOptions(60 * 60 * 24));
  res.cookie("refreshToken", refreshToken, cookieOptions(60 * 60 * 24 * 90));

  sendResponse(res, {
    statusCode: 200,
    success:    true,
    message:    "Logged in successfully!",
    data:       { user, accessToken, refreshToken },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  const result = await AuthService.refreshToken(token);

  res.cookie("accessToken", result.accessToken, cookieOptions(60 * 60 * 24));

  sendResponse(res, {
    statusCode: 200,
    success:    true,
    message:    "Token refreshed successfully!",
    data:       result,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  sendResponse(res, {
    statusCode: 200,
    success:    true,
    message:    "Logged out successfully!",
    data:       null,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const { oldPassword, newPassword } = req.body;

  await AuthService.changePassword(userId, oldPassword, newPassword);

  sendResponse(res, {
    statusCode: 200,
    success:    true,
    message:    "Password changed successfully!",
    data:       null,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.forgotPassword(req.body.email);

  sendResponse(res, {
    statusCode: 200,
    success:    true,
    message:    "Password reset link sent to your email!",
    data:       result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  await AuthService.resetPassword(token, newPassword);

  sendResponse(res, {
    statusCode: 200,
    success:    true,
    message:    "Password reset successfully!",
    data:       null,   
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.getMe(req.user?.id as string);

  sendResponse(res, {
    statusCode: 200,
    success:    true,
    message:    "Profile fetched successfully!",
    data:       result,
  });
});

export const AuthController = {
  register,
  login,
  refreshToken,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
  getMe,
};