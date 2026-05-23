import { Router } from 'express';
import { ReviewController } from './review.controller.js';
import { ReviewValidation } from './review.validation.js';
import validateRequest from '../../middlewares/validateRequest.js';
import auth from '../../middlewares/auth.js';

const router = Router();

// Public route to view reviews
router.get('/product/:productId', ReviewController.getProductReviews);

// Authenticated shopper routes
router.post(
  '/',
  auth('USER', 'ADMIN', 'SUPER_ADMIN'),
  validateRequest(ReviewValidation.createReviewValidationSchema),
  ReviewController.createReview
);

router.patch(
  '/:id',
  auth('USER', 'ADMIN', 'SUPER_ADMIN'),
  validateRequest(ReviewValidation.updateReviewValidationSchema),
  ReviewController.updateReview
);

router.delete(
  '/:id',
  auth('USER', 'ADMIN', 'SUPER_ADMIN'),
  ReviewController.deleteReview
);

export const reviewRoutes = router;
