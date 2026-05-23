import { Schema, model } from 'mongoose';
import type { TCoupon, ICouponModel } from './coupon.interface.js';

const CouponSchema = new Schema<TCoupon, ICouponModel>(
  {
    code: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ['PERCENTAGE', 'FLAT'], required: true },
    value: { type: Number, required: true },
    minPurchase: { type: Number, required: true, default: 0 },
    maxDiscount: { type: Number },
    expiry: { type: Date, required: true },
    limit: { type: Number, required: true, default: 1 },
    usageCount: { type: Number, default: 0 },
    userSpecific: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Format code to uppercase on save
CouponSchema.pre('save', function () {
  this.code = this.code.toUpperCase();
});

export const Coupon = model<TCoupon, ICouponModel>('Coupon', CouponSchema);
