import { Review, Prisma } from '@zagotours/database';
import { BaseRepository } from 'src/common/repository/base.repository';
import { prisma } from '@zagotours/database';

export class ReviewRepository extends BaseRepository<
  Review,
  Prisma.ReviewWhereInput,
  Prisma.ReviewCreateInput,
  Prisma.ReviewUpdateInput,
  Prisma.ReviewInclude
> {
  protected readonly modelDelegate = prisma.review;

  private readonly standardInclude: Prisma.ReviewInclude = {
    user: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  };

  // Get featured reviews
  async findFeatured(): Promise<Review[]> {
    return this.findAll({
      where: { isFeatured: true },
      include: this.standardInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get reviews by user
  async findByUser(userId: string): Promise<Review[]> {
    return this.findAll({
      where: { userId },
      include: this.standardInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get reviews by rating
  async findByRating(rating: number): Promise<Review[]> {
    return this.findAll({
      where: { rating },
      include: this.standardInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Calculate average rating
  async getAverageRating(): Promise<number> {
    const result = await prisma.review.aggregate({
      _avg: {
        rating: true,
      },
    });
    return result._avg.rating || 0;
  }

  // Paginate with includes
  async paginateWithDetails(
    page: number,
    limit: number,
    filters?: Prisma.ReviewWhereInput,
  ) {
    return this.paginate({
      page,
      limit,
      where: filters,
      include: this.standardInclude,
      orderBy: { createdAt: 'desc' },
    });
  }
}
