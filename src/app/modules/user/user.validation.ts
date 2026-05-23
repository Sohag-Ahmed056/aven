import { z } from 'zod';

const updateProfileValidationSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    phone: z.string().optional(),
    avatarUrl: z.string().optional(),
    twoFactorEnabled: z.boolean().optional(),
    isSelfExcluded: z.boolean().optional(),
  }),
});

const changeRoleValidationSchema = z.object({
  body: z.object({
    role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']),
  }),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']),
  }),
});

const addressValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    phone: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
    isDefault: z.boolean().optional(),
  }),
});

export const UserValidation = {
  updateProfileValidationSchema,
  changeRoleValidationSchema,
  changeStatusValidationSchema,
  addressValidationSchema,
};
