import { z } from 'zod';
import { Role } from '@zagotours/types';

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(Role),
  phone: z.string().optional(),
  country: z.string().optional(),
  referralCode: z.string().optional(),
  agentDetails: z
    .object({
      certifications: z
        .array(z.string())
        .min(1, 'At least one certification is required'),
      howDidYouHear: z.string().optional(),
    })
    .optional(),

  cooperateDetails: z
    .object({
      companyName: z.string(),
      travelBusinessDescription: z.string(),
      howDidYouHear: z.string().optional(),
    })
    .optional(),

  affiliateDetails: z
    .object({
      communityBrand: z.string(),
      socialLinks: z.array(z.string()).optional(),
      howDidYouHear: z.string().optional(),
    })
    .optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(7),
});
