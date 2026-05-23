import { Router } from 'express';
import { CategoryController } from './category.controller.js';
import { CategoryValidation } from './category.validation.js';
import validateRequest from '../../middlewares/validateRequest.js';
import auth from '../../middlewares/auth.js';

const router = Router();

// Public routes
router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);

// Admin-only routes
router.post(
  '/',
  auth('ADMIN', 'SUPER_ADMIN'),
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryController.createCategory
);

router.patch(
  '/:id',
  auth('ADMIN', 'SUPER_ADMIN'),
  validateRequest(CategoryValidation.updateCategoryValidationSchema),
  CategoryController.updateCategory
);

router.delete(
  '/:id',
  auth('ADMIN', 'SUPER_ADMIN'),
  CategoryController.deleteCategory
);

export const categoryRoutes = router;
