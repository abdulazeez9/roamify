import { Router } from 'express';
import { TripPlanningCallRepository } from './trip-planning-call.repository';
import { TripPlanningCallService } from './trip-planning-call.service';
import { TripPlanningCallController } from './trip-planning-call.controller';
import { authenticate } from 'src/shared/middleware/authentication.middleware';
import { authorizeRoles } from 'src/shared/middleware/authorization.middleware';
import { Role } from '@zagotours/database';

const router: Router = Router();

// Initialize dependencies
const tripPlanningCallRepository = new TripPlanningCallRepository();
const tripPlanningCallService = new TripPlanningCallService(
  tripPlanningCallRepository,
);
const tripPlanningCallController = new TripPlanningCallController(
  tripPlanningCallService,
);

router.post('/', authenticate, tripPlanningCallController.scheduleCall);
router.get(
  '/upcoming',
  authenticate,
  authorizeRoles(
    Role.INDEPENDENT_AGENT,
    Role.COOPERATE_AGENT,
    Role.ADVENTURER,
    Role.AFFILIATE,
  ),
  tripPlanningCallController.getUpcoming,
);
router.get(
  '/my-calls',
  authenticate,
  authorizeRoles(
    Role.INDEPENDENT_AGENT,
    Role.COOPERATE_AGENT,
    Role.ADVENTURER,
    Role.AFFILIATE,
  ),
  tripPlanningCallController.getMyCalls,
);
// Admin endpoints
router.get(
  '/',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  tripPlanningCallController.getAll,
);

router.patch(
  '/:id/reschedule',
  authenticate,
  authorizeRoles(
    Role.INDEPENDENT_AGENT,
    Role.COOPERATE_AGENT,
    Role.ADVENTURER,
    Role.AFFILIATE,
  ),
  tripPlanningCallController.rescheduleCall,
);
router.put(
  '/:id/cancel',
  authenticate,
  authorizeRoles(
    Role.INDEPENDENT_AGENT,
    Role.COOPERATE_AGENT,
    Role.ADVENTURER,
    Role.AFFILIATE,
  ),
  tripPlanningCallController.cancelCall,
);
router.patch(
  '/:id/complete',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  tripPlanningCallController.markAsCompleted,
);

router.get(
  '/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  tripPlanningCallController.getById,
);
router.delete(
  '/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  tripPlanningCallController.delete,
);

export { router as tripPlanningCallRoutes };
