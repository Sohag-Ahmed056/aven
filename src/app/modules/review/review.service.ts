import ApiError from '../../error/AppError.js';
import { Review } from './review.model.js';
import { Product } from '../product/product.model.js';
import { Order } from '../order/order.model.js';

const createReview = async (
  userId: string,
  payload: { product: string; rating: number; comment: string }
) => {
  const product = await Product.findById(payload.product);
  if (!product) throw new ApiError(404, 'Product not found!');

  // Verified purchase check
  // Check if the user has any order containing this product that is delivered or paid
  const orderExists = await Order.findOne({
    user: userId,
    'items.product': payload.product,
    orderStatus: { $in: ['processing', 'shipped', 'delivered'] },
  });

  if (!orderExists) {
    throw new ApiError(
      403,
      'Verified purchase review only! You can only review products you have purchased and received.'
    );
  }

  // Check if review already exists
  const existingReview = await Review.findOne({ user: userId, product: payload.product });
  if (existingReview) {
    throw new ApiError(400, 'You have already reviewed this product! Update your existing review instead.');
  }

  const review = await Review.create({
    user: userId,
    product: payload.product,
    rating: payload.rating,
    comment: payload.comment,
    isVerifiedPurchase: true,
  });

  return review;
};

const updateReview = async (
  userId: string,
  reviewId: string,
  payload: { rating?: number; comment?: string }
) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, 'Review not found!');

  if (review.user.toString() !== userId) {
    throw new ApiError(403, 'You are not authorized to update this review!');
  }

  Object.assign(review, payload);
  await review.save();

  return review;
};

const deleteReview = async (userId: string, userRole: string, reviewId: string) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, 'Review not found!');

  // Only creator or admin can delete
  if (review.user.toString() !== userId && userRole === 'USER') {
    throw new ApiError(403, 'You are not authorized to delete this review!');
  }

  await Review.findByIdAndDelete(reviewId);
  return review;
};

const getProductReviews = async (productId: string) => {
  const reviews = await Review.find({ product: productId }).populate('user', 'username fullName avatarUrl');
  return reviews;
};

export const ReviewService = {
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
};
