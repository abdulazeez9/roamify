import { Router } from 'express';
import { EventRepository } from './event.repository';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { upload } from 'src/config/multer.config';
import { Role } from '@zagotours/types';
import { authenticate } from 'src/shared/middleware/authentication.middleware';
import { authorizeRoles } from 'src/shared/middleware/authorization.middleware';

const router: Router = Router();

const eventRepository = new EventRepository();
const eventService = new EventService(eventRepository);
const eventController = new EventController(eventService);

// ========== PUBLIC ROUTES ==========
router.post(
  '/',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  upload.single('media'),
  eventController.create,
);
router.get('/', eventController.getAll);
router.get('/upcoming', eventController.getUpcoming);
router.get('/me/bookings', authenticate, eventController.getMyBookings);

router.get('/:id', eventController.getById);

// ========== PROTECTED ROUTES (Authenticated Users) ==========
router.post('/:id/join', authenticate, eventController.joinEvent);
router.post('/:id/cancel', authenticate, eventController.cancelRegistration);

// ========== ADMIN ROUTES ==========
router.put(
  '/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  upload.single('media'),
  eventController.update,
);
router.delete(
  '/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  eventController.delete,
);
router.get(
  '/admin/stats',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  eventController.getStats,
);

export { router as eventRoutes };
