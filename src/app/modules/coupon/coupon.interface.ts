import type { Model, Types } from 'mongoose';

export type TCoupon = {
  code: string;
  type: 'PERCENTAGE' | 'FLAT';
  value: number;
  minPurchase: number;
  maxDiscount?: number; // useful for percentage coupons
  expiry: Date;
  limit: number; // total number of times coupon can be used
  usageCount: number; // times coupon has been used
  userSpecific?: Types.ObjectId[]; // users allowed to use this coupon
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface ICouponModel extends Model<TCoupon> {}
