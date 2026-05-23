import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route.js';
import { userRoutes } from '../modules/user/user.route.js';
import { productRoutes } from '../modules/product/product.route.js';
import { categoryRoutes } from '../modules/category/category.route.js';
import { brandRoutes } from '../modules/brand/brand.route.js';
import { cartRoutes } from '../modules/cart/cart.route.js';
import { wishlistRoutes } from '../modules/wishlist/wishlist.route.js';
import { couponRoutes } from '../modules/coupon/coupon.route.js';
import { orderRoutes } from '../modules/order/order.route.js';
import { reviewRoutes } from '../modules/review/review.route.js';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/products',
    route: productRoutes,
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/brands',
    route: brandRoutes,
  },
  {
    path: '/cart',
    route: cartRoutes,
  },
  {
    path: '/wishlist',
    route: wishlistRoutes,
  },
  {
    path: '/coupons',
    route: couponRoutes,
  },
  {
    path: '/orders',
    route: orderRoutes,
  },
  {
    path: '/reviews',
    route: reviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;