import { Review, Prisma } from '@zagotours/database';
import {
  BaseService,
  NotFoundException,
} from 'src/common/service/base.service';
import { ReviewRepository } from './review.repository';
import { PaginationResult } from '@zagotours/types';

export class ReviewService extends BaseService<
  Review,
  Prisma.ReviewWhereInput,
  Prisma.ReviewCreateInput,
  Prisma.ReviewUpdateInput,
  Prisma.ReviewInclude
> {
  protected readonly resourceName = 'Review';

  constructor(private readonly reviewRepo: ReviewRepository) {
    super(reviewRepo);
  }

  // Create review with validation
  override async create(data: Prisma.ReviewCreateInput): Promise<Review> {
    if (
      typeof data?.rating === 'number' &&
      (data.rating < 1 || data.rating > 5)
    ) {
      throw new Error('Rating must be between 1 and 5');
    }

    return super.create(data);
  }

  // Get featured reviews
  async getFeatured(): Promise<Review[]> {
    return this.reviewRepo.findFeatured();
  }

  // Get reviews by user
  async getByUser(userId: string): Promise<Review[]> {
    return this.reviewRepo.findByUser(userId);
  }

  // Get reviews by rating
  async getByRating(rating: number): Promise<Review[]> {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    return this.reviewRepo.findByRating(rating);
  }

  // Toggle featured status (Admin only)
  async toggleFeatured(id: string): Promise<Review> {
    const review = await this.getById(id);
    return this.update(id, { isFeatured: !review.isFeatured });
  }

  // Get average rating
  async getAverageRating(): Promise<{ averageRating: number }> {
    const average = await this.reviewRepo.getAverageRating();
    return { averageRating: Math.round(average * 10) / 10 };
  }

  // Paginate reviews
  async paginate(
    page: number,
    limit: number,
    options?: {
      where?: Prisma.ReviewWhereInput;
      include?: Prisma.ReviewInclude;
      orderBy?: any;
    }
  ): Promise<PaginationResult<Review>> {
    return this.reviewRepo.paginateWithDetails(page, limit, options?.where);
  }
}
