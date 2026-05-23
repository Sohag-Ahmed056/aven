import { Router } from 'express';
import { UserController } from './user.controller.js';
import { UserValidation } from './user.validation.js';
import validateRequest from '../../middlewares/validateRequest.js';
import auth from '../../middlewares/auth.js';
import { upload } from '../../utils/cloudinary.js';

const router = Router();

// Profile operations (accessible to all authenticated users)
router.patch(
  '/profile',
  auth('USER', 'ADMIN', 'SUPER_ADMIN'),
  validateRequest(UserValidation.updateProfileValidationSchema),
  UserController.updateProfile
);

router.post(
  '/avatar',
  auth('USER', 'ADMIN', 'SUPER_ADMIN'),
  upload.single('avatar'),
  UserController.uploadAvatar
);

router.post(
  '/address',
  auth('USER', 'ADMIN', 'SUPER_ADMIN'),
  validateRequest(UserValidation.addressValidationSchema),
  UserController.addAddress
);

router.delete(
  '/address/:addressId',
  auth('USER', 'ADMIN', 'SUPER_ADMIN'),
  UserController.removeAddress
);

// Admin / Super Admin operations
router.get(
  '/',
  auth('ADMIN', 'SUPER_ADMIN'),
  UserController.getAllUsers
);

router.patch(
  '/:userId/role',
  auth('ADMIN', 'SUPER_ADMIN'),
  validateRequest(UserValidation.changeRoleValidationSchema),
  UserController.changeRole
);

router.patch(
  '/:userId/status',
  auth('ADMIN', 'SUPER_ADMIN'),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserController.changeStatus
);

export const userRoutes = router;
