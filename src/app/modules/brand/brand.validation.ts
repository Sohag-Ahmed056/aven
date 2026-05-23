import { z } from 'zod';

const createBrandValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    logo: z.string().optional(),
    description: z.string().optional(),
  }),
});

const updateBrandValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    logo: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const BrandValidation = {
  createBrandValidationSchema,
  updateBrandValidationSchema,
};
