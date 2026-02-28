import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ResponseUtil } from '../utils/responseUtils';

// ===== VALIDATE REQUEST =====
export const validateRequest = <
  TParams = any,
  TBody = any,
  TQuery = any,
>(schema: {
  params?: ZodSchema<TParams>;
  body?: ZodSchema<TBody>;
  query?: ZodSchema<TQuery>;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.params) {
        req.params = (await schema.params.parseAsync(req.params)) as any;
      }
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        req.query = (await schema.query.parseAsync(req.query)) as any;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return ResponseUtil.error(
          res,
          'Validation failed',
          400,
          JSON.stringify(errors)
        );
      }
      next(error);
    }
  };
};
