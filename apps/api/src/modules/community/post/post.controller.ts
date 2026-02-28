import { Response, NextFunction } from 'express';
import { PostService } from './post.service';
import { ResponseUtil } from 'src/shared/utils/responseUtils';
import { Prisma } from '@zagotours/database';
import {
  ReqBody,
  ReqParams,
  ReqQuery,
  TypedRequest,
} from 'src/shared/types/express.types';
import { asyncHandler } from 'src/shared/middleware/async-handler.middleware';
import { UuidParam } from 'src/common/validation/common.validation';
import { CreatePostDto, UpdatePostDto } from '@zagotours/types';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';

export class PostController {
  constructor(private readonly postService: PostService) {}

  //============================
  // CREATE POST
  //============================
  create = asyncHandler(async (req: ReqBody<CreatePostDto>, res: Response) => {
    const { title, description, mediaType } = req.body;

    if (!title || !description) {
      return ResponseUtil.error(res, 'Title and description are required', 400);
    }

    let mediaUrl: string | undefined;
    let publicId: string | undefined;

    if (req.file) {
      const uploadResult = await CloudinaryService.uploadFile(req.file, 'post');
      mediaUrl = uploadResult.url;
      publicId = uploadResult.publicId;
    }

    const post = await this.postService.createPost(req.userId!, {
      title,
      description,
      mediaUrl,
      publicId,
      mediaType,
    });

    return ResponseUtil.success(res, post, 'Post created successfully', 201);
  });

  //============================
  // GET ALL POSTS
  //============================
  getAll = asyncHandler(
    async (
      req: ReqQuery<{ page?: number; limit?: number; userId?: string }>,
      res: Response,
    ) => {
      const { page = 1, limit = 10, userId } = req.query;

      const filters: Prisma.PostWhereInput = {};

      if (userId) {
        filters.userId = String(userId);
      }

      const result = await this.postService.getAllWithUserFlags(
        req.userId!,
        Number(page),
        Number(limit),
        filters,
      );

      return ResponseUtil.paginated(res, result);
    },
  );

  //============================
  // GET USER FEED
  //============================
  getFeed = asyncHandler(async (req: TypedRequest, res: Response) => {
    const posts = await this.postService.getFeed(req.userId!);
    return ResponseUtil.success(res, posts);
  });

  //============================
  // GET MY POSTS
  //============================
  getMyPosts = asyncHandler(async (req: TypedRequest, res: Response) => {
    const posts = await this.postService.getByUser(req.userId!);
    return ResponseUtil.success(res, posts);
  });

  //============================
  // GET POST BY ID
  //============================
  getById = asyncHandler(async (req: ReqParams<UuidParam>, res: Response) => {
    const post = await this.postService.getPostWithDetails(req.params.id);
    return ResponseUtil.success(res, post);
  });

  //============================
  // UPDATE POST
  //============================
  update = asyncHandler(
    async (req: TypedRequest<UuidParam, UpdatePostDto>, res: Response) => {
      const updateData: UpdatePostDto = {
        title: req.body.title,
        description: req.body.description,
        mediaType: req.body.mediaType,
      };

      // Handle file upload if present
      if (req.file) {
        const existingPost = await this.postService.getById(req.params.id);

        if (existingPost.publicId) {
          await CloudinaryService.deleteFile(existingPost.publicId);
        }

        const uploadResult = await CloudinaryService.uploadFile(
          req.file,
          'post',
        );
        updateData.mediaUrl = uploadResult.url;
        updateData.publicId = uploadResult.publicId;
      }

      const isAdmin =
        req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
      const post = await this.postService.updatePost(
        req.params.id,
        req.userId!,
        updateData,
        isAdmin,
      );

      return ResponseUtil.success(res, post, 'Post updated successfully');
    },
  );

  //============================
  // DELETE POST
  //============================
  delete = asyncHandler(async (req: TypedRequest<UuidParam>, res: Response) => {
    const isAdmin =
      req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
    await this.postService.deletePost(req.params.id, req.userId!, isAdmin);
    return ResponseUtil.success(res, null, 'Post deleted successfully');
  });
  //============================
  // TOGGLE LIKE
  //============================
  toggleLike = asyncHandler(
    async (req: TypedRequest<UuidParam>, res: Response) => {
      const result = await this.postService.toggleLike(
        req.userId!,
        req.params.id,
      );
      return ResponseUtil.success(
        res,
        result,
        result.liked ? 'Post liked' : 'Post unliked',
      );
    },
  );

  //============================
  // TOGGLE SHARE
  //============================
  toggleShare = asyncHandler(
    async (req: TypedRequest<UuidParam>, res: Response) => {
      const result = await this.postService.toggleShare(
        req.userId!,
        req.params.id,
      );
      return ResponseUtil.success(
        res,
        result,
        result.shared
          ? 'Post shared successfully'
          : 'Post unshared successfully',
      );
    },
  );

  //============================
  // ADD COMMENT
  //============================
  addComment = asyncHandler(
    async (
      req: TypedRequest<UuidParam, { content?: string }>,
      res: Response,
    ) => {
      const { content } = req.body;

      if (!content) {
        return ResponseUtil.error(res, 'Comment content is required', 400);
      }

      const comment = await this.postService.addComment(
        req.userId!,
        req.params.id,
        content,
      );

      return ResponseUtil.success(
        res,
        comment,
        'Comment added successfully',
        201,
      );
    },
  );

  //============================
  // GET COMMENTS
  //============================
  getComments = asyncHandler(
    async (req: ReqParams<UuidParam>, res: Response) => {
      const comments = await this.postService.getComments(req.params.id);
      return ResponseUtil.success(res, comments);
    },
  );

  //============================
  // DELETE COMMENT
  //============================
  deleteComment = asyncHandler(
    async (req: TypedRequest<{ commentId: string }>, res: Response) => {
      await this.postService.deleteComment(req.params.commentId, req.userId!);
      return ResponseUtil.success(res, null, 'Comment deleted successfully');
    },
  );
}
