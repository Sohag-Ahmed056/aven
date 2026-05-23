import { Router } from 'express';
import { BrandController } from './brand.controller.js';
import { BrandValidation } from './brand.validation.js';
import validateRequest from '../../middlewares/validateRequest.js';
import auth from '../../middlewares/auth.js';

const router = Router();

// Public routes
router.get('/', BrandController.getAllBrands);
router.get('/:id', BrandController.getBrandById);

// Admin-only routes
router.post(
  '/',
  auth('ADMIN', 'SUPER_ADMIN'),
  validateRequest(BrandValidation.createBrandValidationSchema),
  BrandController.createBrand
);

router.patch(
  '/:id',
  auth('ADMIN', 'SUPER_ADMIN'),
  validateRequest(BrandValidation.updateBrandValidationSchema),
  BrandController.updateBrand
);

router.delete(
  '/:id',
  auth('ADMIN', 'SUPER_ADMIN'),
  BrandController.deleteBrand
);

export const brandRoutes = router;
