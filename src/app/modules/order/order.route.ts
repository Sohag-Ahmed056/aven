import { Router } from 'express';
import { OrderController } from '../order/order.controller.js';
import { OrderValidation } from '../order/order.validation.js';
import validateRequest from '../../middlewares/validateRequest.js';
import auth from '../../middlewares/auth.js';

const router = Router();

// Shopper routes
router.post(
  '/',
  auth('USER', 'ADMIN', 'SUPER_ADMIN'),
  validateRequest(OrderValidation.createOrderValidationSchema),
  OrderController.createOrder
);

router.get(
  '/history',
  auth('USER', 'ADMIN', 'SUPER_ADMIN'),
  OrderController.getUserOrderHistory
);

router.get(
  '/:id',
  auth('USER', 'ADMIN', 'SUPER_ADMIN'),
  OrderController.getOrderById
);

router.patch(
  '/:id/cancel',
  auth('USER', 'ADMIN', 'SUPER_ADMIN'),
  OrderController.cancelOrder
);

// Admin-only routes
router.get(
  '/',
  auth('ADMIN', 'SUPER_ADMIN'),
  OrderController.getAllOrders
);

router.patch(
  '/:id/status',
  auth('ADMIN', 'SUPER_ADMIN'),
  validateRequest(OrderValidation.updateOrderStatusValidationSchema),
  OrderController.changeOrderStatus
);

export const orderRoutes = router;
