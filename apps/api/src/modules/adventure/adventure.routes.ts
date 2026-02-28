import { Router } from 'express';
import { AdventureRepository } from './adventure.repository';
import { AdventureService } from './adventure.service';
import { AdventureController } from './adventure.controller';
import { validateRequest } from 'src/shared/middleware/validation.middleware';
import { commonValidation } from 'src/common/validation/common.validation';
import { upload } from 'src/config/multer.config';
import {
  bulkCreateAdventureSchema,
  createAdventureSchema,
} from './adventure.validation';
import { authenticate } from 'src/shared/middleware/authentication.middleware';
import { Role } from '@zagotours/database';
import { authorizeRoles } from '../../shared/middleware/authorization.middleware';

const router: Router = Router();
const controller = new AdventureController(
  new AdventureService(new AdventureRepository()),
);

router.get('/', controller.getAll);
router.post(
  '/',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  upload.single('media'),
  validateRequest({ body: createAdventureSchema }),
  controller.create,
);

router.get('/trip-type-counts', controller.getTripTypeCounts);

router.post(
  '/bulk',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest({ body: bulkCreateAdventureSchema }),
  controller.createBulk,
);

router
  .route('/:id')
  .all(validateRequest({ params: commonValidation.uuidParam }))
  .get(controller.getById)
  .put(
    authenticate,
    authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
    upload.single('media'),
    controller.update,
  )
  .delete(
    authenticate,
    authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
    controller.delete,
  );

router.post(
  '/:id/toggle-like',
  authenticate,
  validateRequest({ params: commonValidation.uuidParam }),
  controller.toggleLike,
);

export { router as adventureRoutes };
