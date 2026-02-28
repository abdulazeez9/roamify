import { Response, NextFunction } from 'express';
import { TypedRequest } from 'src/shared/types/express.types';
import { ResponseUtil } from 'src/shared/utils/responseUtils';
import { Role } from '@zagotours/database';

/**
 * Middleware to authorize specific roles
 * Usage: authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN)
 */
export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: TypedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return ResponseUtil.error(res, 'Authentication required', 401);
    }

    const userRole = req.user.role as Role;

    if (!allowedRoles.includes(userRole)) {
      return ResponseUtil.error(
        res,
        'You do not have permission to access this resource',
        403,
      );
    }

    next();
  };
};

/**
 * Middleware to check if user is admin or super admin
 */
export const requireAdmin = (
  req: TypedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user || !req.user.role) {
    return ResponseUtil.error(res, 'Authentication required', 401);
  }

  const userRole = req.user.role as Role;

  if (userRole !== Role.ADMIN && userRole !== Role.SUPER_ADMIN) {
    return ResponseUtil.error(res, 'Administrator access required', 403);
  }

  next();
};
