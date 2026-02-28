import { Router } from 'express';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { authenticate } from 'src/shared/middleware/authentication.middleware';
import { upload } from 'src/config/multer.config';
import { authorizeRoles } from 'src/shared/middleware/authorization.middleware';
import { Role } from '@zagotours/types';

const router: Router = Router();

// Initialize dependencies
const postRepository = new PostRepository();
const postService = new PostService(postRepository);
const postController = new PostController(postService);

// ==================== PUBLIC ROUTES ====================
router.get('/', authenticate, postController.getAll);
router.get('/:id', authenticate, postController.getById);
router.get('/:id/comments', authenticate, postController.getComments);

// ==================== AUTHENTICATED ROUTES ====================
// Feed & User Posts
router.get('/feed/my-feed', authenticate, postController.getFeed);
router.get('/my/posts', authenticate, postController.getMyPosts);

// CRUD Operations
router.post('/', authenticate, upload.single('media'), postController.create);
router.patch(
  '/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  upload.single('media'),
  postController.update,
);
router.delete(
  '/:id',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
  postController.delete,
);

// Social Interactions
router.post('/:id/like', authenticate, postController.toggleLike);
router.post('/:id/share', authenticate, postController.toggleShare);
router.post('/:id/comments', authenticate, postController.addComment);
router.delete(
  '/comments/:commentId',
  authenticate,
  postController.deleteComment,
);

export { router as postRoutes };
