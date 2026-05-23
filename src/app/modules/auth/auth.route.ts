import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { AuthValidation } from './auth.validation.js';
import validateRequest from '../../middlewares/validateRequest.js';
import auth from '../../middlewares/auth.js';

const router = Router();

// Public routes
router.post(
  '/register',
  validateRequest(AuthValidation.registerValidationSchema),
  AuthController.register
);
router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.login
);
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken
);
router.post(
  '/forgot-password',
  validateRequest(AuthValidation.forgotPasswordValidationSchema),
  AuthController.forgotPassword
);
router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword
);

// Protected routes
router.post(
  '/logout',
  auth('USER', 'ADMIN', 'SUPER_ADMIN'),
  AuthController.logout
);
router.post(
  '/change-password',
  auth('USER', 'ADMIN', 'SUPER_ADMIN'),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);
router.get(
  '/me',
  auth('USER', 'ADMIN', 'SUPER_ADMIN'),
  AuthController.getMe
);

export const authRoutes = router;