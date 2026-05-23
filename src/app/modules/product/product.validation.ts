import { z } from 'zod';

const variantValidationSchema = z.object({
  name: z.string(),
  value: z.string(),
  priceOffset: z.number().optional().default(0),
  stock: z.number().int().min(0),
});

const attributeValidationSchema = z.object({
  key: z.string(),
  value: z.string(),
});

const seoFieldsValidationSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
});

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    sku: z.string(),
    description: z.string().min(10),
    shortDescription: z.string().optional(),
    price: z.number().positive(),
    discountPrice: z.number().nonnegative().optional(),
    stock: z.number().int().nonnegative(),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Mongoose ID'),
    subCategory: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Mongoose ID').optional().nullable(),
    brand: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Mongoose ID'),
    tags: z.array(z.string()).optional().default([]),
    images: z.array(z.string()).optional().default([]),
    thumbnail: z.string(),
    variants: z.array(variantValidationSchema).optional().default([]),
    attributes: z.array(attributeValidationSchema).optional().default([]),
    isFeatured: z.boolean().optional().default(false),
    isPublished: z.boolean().optional().default(true),
    seo: seoFieldsValidationSchema.optional(),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    sku: z.string().optional(),
    description: z.string().min(10).optional(),
    shortDescription: z.string().optional(),
    price: z.number().positive().optional(),
    discountPrice: z.number().nonnegative().optional(),
    stock: z.number().int().nonnegative().optional(),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Mongoose ID').optional(),
    subCategory: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Mongoose ID').optional().nullable(),
    brand: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Mongoose ID').optional(),
    tags: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
    variants: z.array(variantValidationSchema).optional(),
    attributes: z.array(attributeValidationSchema).optional(),
    isFeatured: z.boolean().optional(),
    isPublished: z.boolean().optional(),
    seo: seoFieldsValidationSchema.optional(),
  }),
});

export const ProductValidation = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
