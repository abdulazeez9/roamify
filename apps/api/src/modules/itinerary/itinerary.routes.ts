import { Router } from 'express';
import { ItineraryController } from './itinerary.controller';
import { ItineraryService } from './itinerary.service';
import { ItineraryRepository } from './itinerary.repository';
import { upload } from 'src/config/multer.config';
import { authenticate } from 'src/shared/middleware/authentication.middleware';

import { Role } from '@zagotours/types';
import { authorizeRoles } from 'src/shared/middleware/authorization.middleware';

const router = Router();
const repository = new ItineraryRepository();
const service = new ItineraryService(repository);
const controller = new ItineraryController(service);

router.post(
  '/:adventureId/itineraries',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  upload.single('media'),
  controller.create,
);

// Get all itineraries for an adventure
router.get('/:adventureId/itineraries', controller.getByAdventure);

// Get single itinerary by ID
router.get(
  '/itineraries/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  controller.getById,
);

// Update itinerary
router.patch(
  '/itineraries/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  upload.single('media'),
  controller.update,
);

// Delete itinerary
router.delete(
  '/itineraries/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  controller.delete,
);

export { router as itineraryRoutes };
