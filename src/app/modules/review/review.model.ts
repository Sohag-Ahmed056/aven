import { Schema, model, type Types } from 'mongoose';
import type { TReview, IReviewModel } from './review.interface.js';
import { Product } from '../product/product.model.js';

const ReviewSchema = new Schema<TReview, IReviewModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    isVerifiedPurchase: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Create compound index so user can review a product only once
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method to calculate average rating
ReviewSchema.statics.calculateAverageRating = async function (productId: Types.ObjectId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        rating: { $avg: '$rating' },
        reviewsCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0 && stats[0]) {
    await Product.findByIdAndUpdate(productId, {
      rating: Number(stats[0].rating.toFixed(2)),
      reviewsCount: stats[0].reviewsCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      reviewsCount: 0,
    });
  }
};

// Post-save hook to calculate rating
ReviewSchema.post('save', async function () {
  await (this.constructor as any).calculateAverageRating(this.product);
});

// Post hook for delete/updates
ReviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await (doc.constructor as any).calculateAverageRating(doc.product);
  }
});

export const Review = model<TReview, IReviewModel>('Review', ReviewSchema);
