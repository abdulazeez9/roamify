import { Router } from 'express';
import { CallbackRequestRepository } from './callback-request.repository';
import { CallbackRequestService } from './callback-request.service';
import { CallbackRequestController } from './callback-request.controller';
import { authenticate } from 'src/shared/middleware/authentication.middleware';
import { authorizeRoles } from 'src/shared/middleware/authorization.middleware';
import { Role } from '@zagotours/database';

const router: Router = Router();

// Initialize dependencies
const callbackRequestRepository = new CallbackRequestRepository();
const callbackRequestService = new CallbackRequestService(
  callbackRequestRepository,
);
const callbackRequestController = new CallbackRequestController(
  callbackRequestService,
);

router.post(
  '/',
  authenticate,
  authorizeRoles(
    Role.INDEPENDENT_AGENT,
    Role.COOPERATE_AGENT,
    Role.ADVENTURER,
    Role.AFFILIATE,
  ),
  callbackRequestController.create,
);

// Adventurer endpoints
router.get(
  '/my-requests',
  authenticate,
  authorizeRoles(
    Role.INDEPENDENT_AGENT,
    Role.COOPERATE_AGENT,
    Role.ADVENTURER,
    Role.AFFILIATE,
  ),
  callbackRequestController.getMyRequests,
);

// Agent endpoints
router.get(
  '/assigned-to-me',
  authenticate,
  authorizeRoles(Role.COOPERATE_AGENT, Role.INDEPENDENT_AGENT),
  callbackRequestController.getAssignedToMe,
);

// Admin endpoints
router.get(
  '/',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  callbackRequestController.getAll,
);
router.get(
  '/pending',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  callbackRequestController.getPending,
);
router.get(
  '/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  callbackRequestController.getById,
);
router.delete(
  '/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  callbackRequestController.delete,
);

export { router as callbackRequestRoutes };
