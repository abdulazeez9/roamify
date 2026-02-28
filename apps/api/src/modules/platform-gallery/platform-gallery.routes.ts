import { Router } from 'express';
import { PlatformGalleryController } from './platform-gallery.controller';
import { PlatformGalleryService } from './platform-gallery.service';
import { PlatformGalleryRepository } from './platform-gallery.repository';
import { upload } from 'src/config/multer.config';

const router = Router();

// Dependency Injection
const repository = new PlatformGalleryRepository();
const service = new PlatformGalleryService(repository);
const controller = new PlatformGalleryController(service);

// PUBLIC ROUTES
router.get('/', controller.getGallery);

// ADMIN ROUTES (Add your admin/auth middleware here)
router.post('/', upload.single('media'), controller.create);
router.patch('/:id', upload.single('media'), controller.update);
router.delete('/:id', controller.delete);

export { router as platformGalleryRoutes };
