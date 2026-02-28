// src/modules/user/user.validation.ts
import { Role } from '@zagotours/database';
import { UserStatus } from '@zagotours/types';
import { commonValidation } from 'src/common/validation/common.validation';
import { z } from 'zod';

export const userSchemas = {
  // Reuse common schemas
  ...commonValidation,

  // User-specific schemas
  updateProfile: z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().optional(),
    country: z.string().optional(),
    independentDetails: z
      .object({
        certifications: z.array(z.string()).optional(),
        howDidYouHear: z.string().optional(),
      })
      .optional(),
    cooperateDetails: z
      .object({
        companyName: z.string().optional(),
        travelBusinessDescription: z.string().optional(),
        howDidYouHear: z.string().optional(),
      })
      .optional(),
    affiliateDetails: z
      .object({
        communityBrand: z.string().optional(),
        socialLinks: z.array(z.string()).optional(),
        howDidYouHear: z.string().optional(),
      })
      .optional(),
  }),

  changePassword: z.object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8).max(100),
  }),

  getAllQuery: commonValidation.pagination.extend({
    role: z.enum(Role).optional(),
    status: z.enum(UserStatus).optional(),
    search: z.string().optional(),
  }),
};

// Export types
export type UpdateProfileBody = z.infer<typeof userSchemas.updateProfile>;
export type ChangePasswordBody = z.infer<typeof userSchemas.changePassword>;
export type GetAllUsersQuery = z.infer<typeof userSchemas.getAllQuery>;
