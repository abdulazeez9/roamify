import { Request, Response, NextFunction } from 'express';
import { ReviewService } from './review.service';
import { ResponseUtil } from 'src/shared/utils/responseUtils';
import { Prisma } from '@zagotours/database';
import { asyncHandler } from 'src/shared/middleware/async-handler.middleware';
import {
  ReqBody,
  ReqParams,
  ReqParamsBody,
  ReqQuery,
  TypedRequest,
} from 'src/shared/types/express.types';
import { CreateReviewDto, UpdateReviewDto } from '@zagotours/types';
import { UuidParam } from 'src/common/validation/common.validation';

export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  create = asyncHandler(
    async (req: ReqBody<CreateReviewDto>, res: Response) => {
      const { title, content, rating } = req.body;

      if (!content || !rating) {
        return ResponseUtil.error(res, 'Content and rating are required', 400);
      }

      const review = await this.reviewService.create({
        title,
        content,
        rating: Number(rating),
        user: { connect: { id: req.userId! } },
      });

      return ResponseUtil.success(
        res,
        review,
        'Review created successfully',
        201,
      );
    },
  );

  getAll = asyncHandler(
    async (
      req: ReqQuery<{
        page?: number;
        limit?: number;
        rating?: number;
        userId?: string;
        featured?: string;
      }>,
      res: Response,
    ) => {
      const { page = 1, limit = 10, rating, userId, featured } = req.query;

      const filters: Prisma.ReviewWhereInput = {};

      if (rating) {
        filters.rating = Number(rating);
      }

      if (userId) {
        filters.userId = String(userId);
      }

      if (featured === 'true') {
        filters.isFeatured = true;
      }

      const result = await this.reviewService.paginate(
        Number(page),
        Number(limit),
        { where: filters },
      );

      return ResponseUtil.paginated(res, result);
    },
  );

  getFeatured = asyncHandler(async (req: TypedRequest, res: Response) => {
    const reviews = await this.reviewService.getFeatured();
    return ResponseUtil.success(res, reviews);
  });

  getMyReviews = asyncHandler(
    async (req: TypedRequest, res: Response, next: NextFunction) => {
      const reviews = await this.reviewService.getByUser(req.userId!);
      return ResponseUtil.success(res, reviews);
    },
  );

  getAverageRating = asyncHandler(async (req: TypedRequest, res: Response) => {
    const result = await this.reviewService.getAverageRating();
    return ResponseUtil.success(res, result);
  });

  getById = async (req: ReqParams<UuidParam>, res: Response) => {
    const review = await this.reviewService.getById(req.params.id);
    return ResponseUtil.success(res, review);
  };

  update = asyncHandler(
    async (req: ReqParamsBody<UuidParam, UpdateReviewDto>, res: Response) => {
      const review = await this.reviewService.getById(req.params.id);

      // Only allow user to update their own review
      if (review.userId !== req.userId) {
        return ResponseUtil.error(res, 'Unauthorized', 403);
      }

      const updated = await this.reviewService.update(req.params.id, req.body);
      return ResponseUtil.success(res, updated, 'Review updated successfully');
    },
  );

  toggleFeatured = asyncHandler(
    async (req: ReqParams<UuidParam>, res: Response, next: NextFunction) => {
      const review = await this.reviewService.toggleFeatured(req.params.id);
      return ResponseUtil.success(
        res,
        review,
        `Review ${review.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      );
    },
  );

  delete = asyncHandler(async (req: ReqParams<UuidParam>, res: Response) => {
    const review = await this.reviewService.getById(req.params.id);

    // Only allow user to delete their own review (or admin)
    if (review.userId !== req.userId && !req.user?.role?.includes('ADMIN')) {
      return ResponseUtil.error(res, 'Unauthorized', 403);
    }

    await this.reviewService.delete(req.params.id, true);
    return ResponseUtil.success(res, null, 'Review deleted successfully');
  });
}
