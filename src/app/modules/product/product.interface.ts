import type { Model, Types } from 'mongoose';

export type TSEOFields = {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
};

export type TVariant = {
  name: string; // e.g. Color, Size
  value: string; // e.g. Red, XL
  priceOffset?: number; // additional price for this variant
  stock: number;
};

export type TAttribute = {
  key: string; // e.g. Weight, Material
  value: string; // e.g. 1.2kg, Cotton
};

export type TProduct = {
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  soldCount: number;
  category: Types.ObjectId;
  subCategory?: Types.ObjectId;
  brand: Types.ObjectId;
  tags: string[];
  images: string[];
  thumbnail: string;
  variants: TVariant[];
  attributes: TAttribute[];
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  isPublished: boolean;
  seo?: TSEOFields;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface IProductModel extends Model<TProduct> {}
