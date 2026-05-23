import { z } from 'zod';

const createOrderValidationSchema = z.object({
  body: z.object({
    couponCode: z.string().optional(),
    shippingAddress: z.object({
      name: z.string().min(2),
      phone: z.string(),
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string(),
    }),
    shippingCharge: z.number().nonnegative().optional().default(60),
  }),
});

const updateOrderStatusValidationSchema = z.object({
  body: z.object({
    orderStatus: z.enum([
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
    ]),
  }),
});

export const OrderValidation = {
  createOrderValidationSchema,
  updateOrderStatusValidationSchema,
};
