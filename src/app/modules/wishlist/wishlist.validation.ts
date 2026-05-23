import { z } from 'zod';

const wishlistActionValidationSchema = z.object({
  body: z.object({
    product: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Mongoose ID'),
  }),
});

export const WishlistValidation = {
  wishlistActionValidationSchema,
};
