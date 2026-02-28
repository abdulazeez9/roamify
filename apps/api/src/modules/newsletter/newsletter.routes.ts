import { Router } from 'express';
import { subscribeToNewsletter, getSubscribers } from './newsletter.controller';
import { authenticate } from 'src/shared/middleware/authentication.middleware';
import { authorizeRoles } from 'src/shared/middleware/authorization.middleware';
import { Role } from '@zagotours/database';

const router = Router();

router.post('/subscribe', subscribeToNewsletter);

router.get(
  '/list',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  getSubscribers,
);

export { router as newsletterRoutes };
