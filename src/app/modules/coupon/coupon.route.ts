import { Router } from 'express';
import { CouponController } from './coupon.controller.js';
import { CouponValidation } from './coupon.validation.js';
import validateRequest from '../../middlewares/validateRequest.js';
import auth from '../../middlewares/auth.js';

const router = Router();

// Shopper routes (authenticated users)
router.post(
  '/apply',
  auth('USER', 'ADMIN', 'SUPER_ADMIN'),
  validateRequest(CouponValidation.applyCouponValidationSchema),
  CouponController.applyCoupon
);

// Admin-only routes
router.use(auth('ADMIN', 'SUPER_ADMIN'));

router.get('/', CouponController.getAllCoupons);
router.post(
  '/',
  validateRequest(CouponValidation.createCouponValidationSchema),
  CouponController.createCoupon
);
router.get('/:id', CouponController.getCouponById);
router.patch(
  '/:id',
  validateRequest(CouponValidation.updateCouponValidationSchema),
  CouponController.updateCoupon
);
router.delete('/:id', CouponController.deleteCoupon);

export const couponRoutes = router;
