import { Router } from 'express';
import { GeneralInquiryRepository } from './general-inquiry.repository';
import { GeneralInquiryService } from './general-inquiry.service';
import { GeneralInquiryController } from './general-inquiry.controller';
import { Role } from '@zagotours/database';
import { authenticate } from 'src/shared/middleware/authentication.middleware';
import { authorizeRoles } from 'src/shared/middleware/authorization.middleware';

const router: Router = Router();

// Initialize dependencies
const inquiryRepository = new GeneralInquiryRepository();
const inquiryService = new GeneralInquiryService(inquiryRepository);
const inquiryController = new GeneralInquiryController(inquiryService);

// Public route
router.post('/', authenticate, inquiryController.create);

// Admin routes
router.get(
  '/',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  inquiryController.getAll,
);

router.get(
  '/recent',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  inquiryController.getRecent,
);

router.get(
  '/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  inquiryController.getById,
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  inquiryController.delete,
);

export { router as generalInquiryRoutes };
