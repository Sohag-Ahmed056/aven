import { Schema, model } from 'mongoose';
import type { TProduct, TVariant, TAttribute, TSEOFields, IProductModel } from './product.interface.js';
import { slugify } from '../category/category.model.js';

const SEOFieldsSchema = new Schema<TSEOFields>({
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: [{ type: String }],
});

const VariantSchema = new Schema<TVariant>({
  name: { type: String, required: true },
  value: { type: String, required: true },
  priceOffset: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0 },
});

const AttributeSchema = new Schema<TAttribute>({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

const ProductSchema = new Schema<TProduct, IProductModel>(
  {
    name: { type: String, required: true, unique: true, index: true },
    slug: { type: String, unique: true, index: true },
    sku: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true, index: true },
    discountPrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    soldCount: { type: Number, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    subCategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true, index: true },
    tags: [{ type: String, index: true }],
    images: [{ type: String }],
    thumbnail: { type: String, required: true },
    variants: [VariantSchema],
    attributes: [AttributeSchema],
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: true, index: true },
    seo: SEOFieldsSchema,
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Create compound index for text searching
ProductSchema.index({ name: 'text', description: 'text', shortDescription: 'text' });

// Slugify pre-save hook
ProductSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name);
  }
});

// Filter out deleted products
ProductSchema.pre(/^find/, function () {
  (this as any).find({ isDeleted: { $ne: true } });
});

export const Product = model<TProduct, IProductModel>('Product', ProductSchema);
