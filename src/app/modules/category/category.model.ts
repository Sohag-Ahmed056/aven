import { Schema, model } from 'mongoose';
import type { TCategory, ICategoryModel } from './category.interface.js';

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};

const CategorySchema = new Schema<TCategory, ICategoryModel>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true, index: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Slugify pre-save hook
CategorySchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name);
  }
});

// Filter out deleted categories by default
CategorySchema.pre(/^find/, function () {
  (this as any).find({ isDeleted: { $ne: true } });
});

export const Category = model<TCategory, ICategoryModel>('Category', CategorySchema);
