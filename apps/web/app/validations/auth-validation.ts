import { Role } from '@zagotours/types';
import { z } from 'zod';

// Helper to get valid customer role values for zod enum
const customerRoleValues = [
  Role.ADVENTURER,
  Role.AFFILIATE,
  Role.INDEPENDENT_AGENT,
  Role.COOPERATE_AGENT,
] as const;

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registrationSchema = z
  .object({
    name: z.string().min(2, 'Name or Company name is required'),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    country: z.string().optional(),
    role: z.enum(customerRoleValues),
    referralCode: z.string().optional(),

    business_description: z.string().optional(),
    certifications: z.array(z.string()).default([]).optional(),
    howDidYouHear: z.string().optional(),
    community: z.string().optional(),
    website_link: z.string().optional(),
    safetyAmbassador: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .superRefine((data, ctx) => {
    if (data.role === Role.INDEPENDENT_AGENT) {
      if (!data.certifications || data.certifications.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please provide at least one certification',
          path: ['certifications'],
        });
      }
    }

    if (data.role === Role.COOPERATE_AGENT) {
      if (!data.business_description || data.business_description.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Business description is required (min 10 chars)',
          path: ['business_description'],
        });
      }
    }

    if (data.role === Role.AFFILIATE) {
      if (!data.community) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Community/Brand name is required',
          path: ['community'],
        });
      }
      if (!data.website_link) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Website or Social link is required',
          path: ['website_link'],
        });
      }
    }
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;
