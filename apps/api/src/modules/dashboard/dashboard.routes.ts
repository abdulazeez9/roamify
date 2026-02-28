import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardRepository } from './dashboard.repository';
import { authenticate } from 'src/shared/middleware/authentication.middleware';
import { Role } from '@zagotours/database';
import { authorizeRoles } from 'src/shared/middleware/authorization.middleware';

// Initialize dependencies
const dashboardRepository = new DashboardRepository();
const dashboardService = new DashboardService(dashboardRepository);
const dashboardController = new DashboardController(dashboardService);

const router = Router();

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics for authenticated user
 * All authenticated roles can access their own stats
 */
router.get(
  '/stats',
  authenticate,
  authorizeRoles(
    Role.ADMIN,
    Role.SUPER_ADMIN,
    Role.ADVENTURER,
    Role.INDEPENDENT_AGENT,
    Role.COOPERATE_AGENT,
    Role.AFFILIATE,
  ),
  dashboardController.getMyStats,
);

/**
 * GET /api/dashboard/leaderboard
 * Get leaderboard of top performers
 * Admin and Super Admin only
 */
router.get(
  '/leaderboard',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  dashboardController.getLeaderboard,
);

/**
 * GET /api/dashboard/agent/:id
 * Get detailed statistics for a specific agent
 * Admin and Super Admin only
 * Note: :id parameter name matches UuidParam validation (expects 'id' not 'agentId')
 */
router.get(
  '/agent/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  dashboardController.getAgentStats,
);

/**
 * GET /api/dashboard/affiliate/:id
 * Get detailed statistics for a specific affiliate
 * Admin and Super Admin only
 * Note: :id parameter name matches UuidParam validation (expects 'id' not 'affiliateId')
 */
router.get(
  '/affiliate/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  dashboardController.getAffiliateStats,
);

export { router as dashboardRoute };
