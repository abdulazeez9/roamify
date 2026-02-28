import { Response } from 'express';
import { ReqParams, TypedRequest } from 'src/shared/types/express.types';
import { DashboardService } from './dashboard.service';
import { ResponseUtil } from 'src/shared/utils/responseUtils';
import { asyncHandler } from 'src/shared/middleware/async-handler.middleware';
import { Role } from '@zagotours/database';
import { UuidParam } from 'src/common/validation/common.validation';

export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  /**
   * GET /api/dashboard/stats
   * Get dashboard statistics for the current authenticated user
   * Returns role-specific statistics based on user's role
   */
  getMyStats = asyncHandler(async (req: TypedRequest, res: Response) => {
    if (!req.userId || !req.user?.role) {
      return ResponseUtil.error(res, 'Unauthorized', 401);
    }

    const result = await this.service.getStatsForUser(
      req.userId,
      req.user.role as Role,
    );

    return ResponseUtil.success(
      res,
      result,
      'Dashboard statistics retrieved successfully',
    );
  });

  /**
   * GET /api/dashboard/leaderboard
   * Get top performers (agents and affiliates) by points
   * Admin and Super Admin only
   */
  getLeaderboard = asyncHandler(async (req: TypedRequest, res: Response) => {
    if (!req.user?.role) {
      return ResponseUtil.error(res, 'Unauthorized', 401);
    }

    // Only admins can access leaderboard
    if (req.user.role !== Role.ADMIN && req.user.role !== Role.SUPER_ADMIN) {
      return ResponseUtil.error(
        res,
        'Only administrators can access leaderboard',
        403,
      );
    }

    // Access the specific query parameter
    const query = req.query as { limit?: string };
    const limit = parseInt(query.limit || '10');

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return ResponseUtil.error(
        res,
        'Limit must be a number between 1 and 100',
        400,
      );
    }

    const leaderboard = await this.service.getTopPerformers(limit);

    return ResponseUtil.success(
      res,
      leaderboard,
      'Leaderboard retrieved successfully',
    );
  });

  /**
   * GET /api/dashboard/agent/:id
   * Get detailed statistics for a specific agent
   * Admin and Super Admin only
   */
  getAgentStats = asyncHandler(
    async (req: ReqParams<UuidParam>, res: Response) => {
      if (!req.user?.role) {
        return ResponseUtil.error(res, 'Unauthorized', 401);
      }

      // Only admins can access other users' stats
      if (req.user.role !== Role.ADMIN && req.user.role !== Role.SUPER_ADMIN) {
        return ResponseUtil.error(
          res,
          'Only administrators can access agent statistics',
          403,
        );
      }

      const { id } = req.params;

      if (!id) {
        return ResponseUtil.error(res, 'Agent ID is required', 400);
      }

      try {
        const stats = await this.service.getAgentDetailsForAdmin(id);
        return ResponseUtil.success(
          res,
          stats,
          'Agent statistics retrieved successfully',
        );
      } catch (error) {
        if (error instanceof Error) {
          return ResponseUtil.error(res, error.message, 404);
        }
        throw error;
      }
    },
  );

  /**
   * GET /api/dashboard/affiliate/:id
   * Get detailed statistics for a specific affiliate
   * Admin and Super Admin only
   */
  getAffiliateStats = asyncHandler(
    async (req: ReqParams<UuidParam>, res: Response) => {
      if (!req.user?.role) {
        return ResponseUtil.error(res, 'Unauthorized', 401);
      }

      // Only admins can access other users' stats
      if (req.user.role !== Role.ADMIN && req.user.role !== Role.SUPER_ADMIN) {
        return ResponseUtil.error(
          res,
          'Only administrators can access affiliate statistics',
          403,
        );
      }

      const { id } = req.params;

      if (!id) {
        return ResponseUtil.error(res, 'Affiliate ID is required', 400);
      }

      try {
        const stats = await this.service.getAffiliateDetailsForAdmin(id);
        return ResponseUtil.success(
          res,
          stats,
          'Affiliate statistics retrieved successfully',
        );
      } catch (error) {
        if (error instanceof Error) {
          return ResponseUtil.error(res, error.message, 404);
        }
        throw error;
      }
    },
  );
}
