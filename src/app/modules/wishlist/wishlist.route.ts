import { Router } from 'express';
import { WishlistController } from './wishlist.controller.js';
import { WishlistValidation } from './wishlist.validation.js';
import validateRequest from '../../middlewares/validateRequest.js';
import auth from '../../middlewares/auth.js';

const router = Router();

// All wishlist routes require authentication
router.use(auth('USER', 'ADMIN', 'SUPER_ADMIN'));

router.get('/', WishlistController.getWishlist);

router.post(
  '/',
  validateRequest(WishlistValidation.wishlistActionValidationSchema),
  WishlistController.addToWishlist
);

router.delete(
  '/:productId',
  WishlistController.removeFromWishlist
);

export const wishlistRoutes = router;
