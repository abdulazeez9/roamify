import { z } from 'zod';

export const commonValidation = {
  uuidParam: z.object({
    id: z.uuid('Invalid ID format'),
  }),

  pagination: z.object({
    page: z.string().transform(Number).pipe(z.number().min(1)).optional(),
    limit: z
      .string()
      .transform(Number)
      .pipe(z.number().min(1).max(10))
      .optional(),
  }),
};

export type UuidParam = z.infer<typeof commonValidation.uuidParam>;
export type PaginationQuery = z.infer<typeof commonValidation.pagination>;
