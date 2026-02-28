import { Router } from 'express';
import { PlatformSettingsController } from './platform-settings.controller';
import { PlatformSettingsService } from './platform-settings.service';
import { authenticate } from 'src/shared/middleware/authentication.middleware';
import { authorizeRoles } from 'src/shared/middleware/authorization.middleware';
import { Role } from '@zagotours/database';
import { upload } from 'src/config/multer.config';

const router: Router = Router();
const controller = new PlatformSettingsController(
  new PlatformSettingsService(),
);

router.post(
  '/',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  upload.single('media'),
  controller.create,
);

router.get('/', controller.get);

router.put(
  '/',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  upload.single('media'),
  controller.update,
);

export { router as platformSettingsRoutes };
