import { Router } from 'express';
import { AdventureGalleryController } from './gallery.controller';
import { AdventureGalleryService } from './gallery.service';
import { AdventureGalleryRepository } from './gallery.repository';
import { upload } from 'src/config/multer.config';
import { authenticate } from 'src/shared/middleware/authentication.middleware';
import { authorizeRoles } from 'src/shared/middleware/authorization.middleware';
import { Role } from '@zagotours/database';

const router = Router();
const repository = new AdventureGalleryRepository();
const service = new AdventureGalleryService(repository);
const controller = new AdventureGalleryController(service);

router.post(
  '/:adventureId/gallery/bulk',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  upload.array('media', 10),
  controller.bulkUpload,
);

// Get all gallery items for an adventure
router.get('/:adventureId/gallery', authenticate, controller.getByAdventure);

router.patch(
  '/gallery/reorder',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  controller.reorder,
);

// Get single gallery item
router.get('/gallery/:id', authenticate, controller.getById);

// Update gallery item metadata (altText, order)
router.patch(
  '/gallery/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  controller.update,
);

// Delete gallery item (with Cloudinary cleanup)
router.delete(
  '/gallery/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  controller.delete,
);

export { router as adventureGalleryRoutes };
