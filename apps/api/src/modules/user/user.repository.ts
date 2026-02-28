import { User, Prisma } from '@zagotours/database';
import { BaseRepository } from 'src/common/repository/base.repository';
import { prisma } from '@zagotours/database';

export class UserRepository extends BaseRepository<
  User,
  Prisma.UserWhereInput,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserInclude
> {
  protected readonly modelDelegate = prisma.user;

  private readonly profileInclude: Prisma.UserInclude = {
    independentDetails: true,
    cooperateDetails: true,
    affiliateDetails: true,
  };

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email }, this.profileInclude);
  }

  // Get user with full profile
  async findWithProfile(userId: string): Promise<User | null> {
    return this.findById(userId, this.profileInclude);
  }

  // Get user's referrals
  async findReferrals(userId: string) {
    return this.modelDelegate.findMany({
      where: {
        referredById: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Count user's referrals
  async countReferrals(userId: string, activeOnly = false) {
    return this.modelDelegate.count({
      where: {
        referredById: userId,
        deletedAt: null,
        ...(activeOnly && { status: 'ACTIVE' }),
      },
    });
  }

  // Get user stats
  async getUserStats(userId: string) {
    const [posts, reviews, likes, referrals] = await Promise.all([
      prisma.post.count({ where: { userId, deletedAt: null } }),
      prisma.review.count({ where: { userId } }),
      prisma.adventureLike.count({ where: { userId } }),
      this.countReferrals(userId),
    ]);

    return {
      totalPosts: posts,
      totalReviews: reviews,
      totalAdventureLikes: likes,
      totalReferrals: referrals,
    };
  }
}
