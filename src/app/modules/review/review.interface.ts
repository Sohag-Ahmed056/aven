import type { Model, Types } from 'mongoose';

export type TReview = {
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: number; // 1 to 5
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface IReviewModel extends Model<TReview> {}
