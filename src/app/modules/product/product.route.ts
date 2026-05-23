import { Router } from 'express';
import { ProductController } from './product.controller.js';
import { ProductValidation } from './product.validation.js';
import validateRequest from '../../middlewares/validateRequest.js';
import auth from '../../middlewares/auth.js';

const router = Router();

// Public routes
router.get('/', ProductController.getAllProducts);
router.get('/featured', ProductController.getFeaturedProducts);
router.get('/trending', ProductController.getTrendingProducts);
router.get('/slug/:slug', ProductController.getProductBySlug);
router.get('/:id', ProductController.getProductById);
router.get('/:id/related', ProductController.getRelatedProducts);

// Admin-only routes
router.get(
  '/low-stock',
  auth('ADMIN', 'SUPER_ADMIN'),
  ProductController.getLowStockProducts
);

router.post(
  '/',
  auth('ADMIN', 'SUPER_ADMIN'),
  validateRequest(ProductValidation.createProductValidationSchema),
  ProductController.createProduct
);

router.patch(
  '/:id',
  auth('ADMIN', 'SUPER_ADMIN'),
  validateRequest(ProductValidation.updateProductValidationSchema),
  ProductController.updateProduct
);

router.delete(
  '/:id',
  auth('ADMIN', 'SUPER_ADMIN'),
  ProductController.deleteProduct
);

export const productRoutes = router;
