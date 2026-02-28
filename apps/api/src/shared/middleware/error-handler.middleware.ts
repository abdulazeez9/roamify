import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@zagotours/database';
import { ResponseUtil } from '../utils/responseUtils';
import {
  ForbiddenException,
  NotFoundException,
} from 'src/common/service/base.service';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Handle NotFoundException
  if (err instanceof NotFoundException) {
    return ResponseUtil.error(res, err.message, 404);
  }

  if (err instanceof ForbiddenException) {
    return ResponseUtil.error(res, err.message, 403);
  }

  // Handle Zod Validation Errors
  if (err.name === 'ZodError' || err.errors) {
    return ResponseUtil.error(
      res,
      'Validation error',
      400,
      JSON.stringify(err.errors || err.message),
    );
  }

  // Handle Prisma Errors
  // Handle Prisma Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const targets = (err.meta?.target as string[]) || [];
      if (targets.includes('email')) {
        return ResponseUtil.error(res, 'Email already exists', 409);
      }

      return ResponseUtil.error(res, 'Conflict: Record already exists', 409);
    }

    if (err.code === 'P2025') {
      return ResponseUtil.error(res, 'Record not found', 404);
    }
  }

  // Handle specific App Errors
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return ResponseUtil.error(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? err.message : undefined,
  );
};
