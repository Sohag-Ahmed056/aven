import { z } from 'zod';

const addToCartValidationSchema = z.object({
  body: z.object({
    product: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Mongoose ID'),
    quantity: z.number().int().min(1),
    variant: z
      .object({
        name: z.string(),
        value: z.string(),
      })
      .optional(),
  }),
});

const updateQuantityValidationSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(1),
  }),
});

export const CartValidation = {
  addToCartValidationSchema,
  updateQuantityValidationSchema,
};
