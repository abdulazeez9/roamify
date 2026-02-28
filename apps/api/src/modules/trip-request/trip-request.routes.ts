import { Router } from 'express';
import { TripRequestRepository } from './trip-request.repository';
import { TripRequestService } from './trip-request.service';
import { TripRequestController } from './trip-request.controller';
import { Role } from '@zagotours/database';
import { authenticate } from 'src/shared/middleware/authentication.middleware';
import { authorizeRoles } from 'src/shared/middleware/authorization.middleware';

const router: Router = Router();

// Initialize dependencies
const tripRequestRepository = new TripRequestRepository();
const tripRequestService = new TripRequestService(tripRequestRepository);
const tripRequestController = new TripRequestController(tripRequestService);

// Public/Adventurer endpoints
router.post(
  '/',
  authenticate,
  authorizeRoles(
    Role.INDEPENDENT_AGENT,
    Role.COOPERATE_AGENT,
    Role.ADVENTURER,
    Role.AFFILIATE,
  ),
  tripRequestController.create,
);
router.get(
  '/my-requests',
  authenticate,
  authorizeRoles(
    Role.INDEPENDENT_AGENT,
    Role.COOPERATE_AGENT,
    Role.ADVENTURER,
    Role.AFFILIATE,
  ),
  tripRequestController.getMyRequests,
);

// Agent endpoints
router.get(
  '/assigned-to-me',
  authenticate,

  authorizeRoles(Role.INDEPENDENT_AGENT, Role.COOPERATE_AGENT),
  tripRequestController.getAssignedToMe,
);

// Admin endpoints
router.get(
  '/',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  tripRequestController.getAll,
);
router.get(
  '/recent',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  tripRequestController.getRecent,
);
router.get(
  '/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  tripRequestController.getById,
);
router.delete(
  '/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  tripRequestController.delete,
);

export { router as tripRequestRoutes };
