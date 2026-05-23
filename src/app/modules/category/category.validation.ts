import { z } from 'zod';

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    parent: z.string().uuid().or(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional().nullable(),
  }),
});

const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    parent: z.string().uuid().or(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional().nullable(),
  }),
});

export const CategoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
