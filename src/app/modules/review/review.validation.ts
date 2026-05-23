import { z } from 'zod';

const createReviewValidationSchema = z.object({
  body: z.object({
    product: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Mongoose ID'),
    rating: z.number().min(1).max(5),
    comment: z.string().min(3).max(500),
  }),
});

const updateReviewValidationSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().min(3).max(500).optional(),
  }),
});

export const ReviewValidation = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
};
