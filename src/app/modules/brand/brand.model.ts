import { Schema, model } from 'mongoose';
import type { TBrand, IBrandModel } from './brand.interface.js';
import { slugify } from '../category/category.model.js';

const BrandSchema = new Schema<TBrand, IBrandModel>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true, index: true },
    logo: { type: String },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Slugify pre-save hook
BrandSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name);
  }
});

// Filter out deleted brands
BrandSchema.pre(/^find/, function () {
  (this as any).find({ isDeleted: { $ne: true } });
});

export const Brand = model<TBrand, IBrandModel>('Brand', BrandSchema);
