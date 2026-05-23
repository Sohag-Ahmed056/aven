import { Router } from 'express';
import { CartController } from './cart.controller.js';
import { CartValidation } from './cart.validation.js';
import validateRequest from '../../middlewares/validateRequest.js';
import auth from '../../middlewares/auth.js';

const router = Router();

// All cart routes require a logged-in user
router.use(auth('USER', 'ADMIN', 'SUPER_ADMIN'));

router.get('/', CartController.getCart);

router.post(
  '/',
  validateRequest(CartValidation.addToCartValidationSchema),
  CartController.addToCart
);

router.patch(
  '/:productId',
  validateRequest(CartValidation.updateQuantityValidationSchema),
  CartController.updateQuantity
);

router.delete(
  '/:productId',
  CartController.removeItem
);

router.delete(
  '/',
  CartController.clearCart
);

export const cartRoutes = router;
