import { z } from 'zod';

const createCouponValidationSchema = z.object({
  body: z.object({
    code: z.string().min(2).max(15),
    type: z.enum(['PERCENTAGE', 'FLAT']),
    value: z.number().positive(),
    minPurchase: z.number().nonnegative().optional().default(0),
    maxDiscount: z.number().positive().optional(),
    expiry: z.string().transform((str) => new Date(str)),
    limit: z.number().int().positive().optional().default(100),
    userSpecific: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    isActive: z.boolean().optional().default(true),
  }),
});

const updateCouponValidationSchema = z.object({
  body: z.object({
    code: z.string().min(2).max(15).optional(),
    type: z.enum(['PERCENTAGE', 'FLAT']).optional(),
    value: z.number().positive().optional(),
    minPurchase: z.number().nonnegative().optional(),
    maxDiscount: z.number().positive().optional(),
    expiry: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    limit: z.number().int().positive().optional(),
    userSpecific: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    isActive: z.boolean().optional(),
  }),
});

const applyCouponValidationSchema = z.object({
  body: z.object({
    code: z.string(),
    totalAmount: z.number().positive(),
  }),
});

export const CouponValidation = {
  createCouponValidationSchema,
  updateCouponValidationSchema,
  applyCouponValidationSchema,
};
