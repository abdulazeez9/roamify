import { Post, Prisma } from '@zagotours/database';
import { BaseRepository } from 'src/common/repository/base.repository';
import { prisma } from '@zagotours/database';

export class PostRepository extends BaseRepository<
  Post,
  Prisma.PostWhereInput,
  Prisma.PostCreateInput,
  Prisma.PostUpdateInput,
  Prisma.PostInclude
> {
  protected readonly modelDelegate = prisma.post;

  private readonly standardInclude: Prisma.PostInclude = {
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        country: true,
      },
    },
    _count: {
      select: {
        comments: true,
        likes: true,
        shares: true,
      },
    },
    likes: true,
    shares: true,
  };

  //============================
  // GET POST WITH FULL DETAILS
  //============================
  async findWithDetails(postId: string) {
    return this.findById(postId, {
      ...this.standardInclude,
      comments: {
        where: { deletedAt: null },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      likes: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      shares: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    });
  }

  //============================
  // GET POSTS BY USER
  //============================
  async findByUser(userId: string): Promise<Post[]> {
    return this.findAll({
      where: { userId, deletedAt: null },
      include: this.standardInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  //============================
  // GET USER FEED
  //============================
  async findFeed(userId: string): Promise<Post[]> {
    // TODO: Implement proper feed logic based on followed users
    // For now, returning all posts ordered by creation date
    return this.findAll({
      where: { deletedAt: null },
      include: this.standardInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  //============================
  // PAGINATE WITH DETAILS
  //============================
  async paginateWithDetails(
    page: number,
    limit: number,
    filters?: Prisma.PostWhereInput,
  ) {
    return this.paginate({
      page,
      limit,
      where: { deletedAt: null, ...filters },
      include: this.standardInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  //============================
  // LIKE OPERATIONS
  //============================
  async findLike(userId: string, postId: string) {
    return prisma.like.findFirst({
      where: { userId, postId },
    });
  }

  async createLike(userId: string, postId: string) {
    return prisma.like.create({
      data: { userId, postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  async deleteLike(likeId: string) {
    return prisma.like.delete({
      where: { id: likeId },
    });
  }

  async getLikes(postId: string) {
    return prisma.like.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  async getLikeCount(postId: string): Promise<number> {
    return prisma.like.count({
      where: { postId },
    });
  }

  //============================
  // SHARE OPERATIONS
  //============================
  async findShare(userId: string, postId: string) {
    return prisma.share.findFirst({
      where: { userId, postId },
    });
  }

  async createShare(userId: string, postId: string) {
    return prisma.share.create({
      data: { userId, postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  async getShares(postId: string) {
    return prisma.share.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  async getShareCount(postId: string): Promise<number> {
    return prisma.share.count({
      where: { postId },
    });
  }

  async deleteShare(shareId: string) {
    return prisma.share.delete({
      where: { id: shareId },
    });
  }
  //============================
  // COMMENT OPERATIONS
  //============================
  async createComment(userId: string, postId: string, content: string) {
    return prisma.comment.create({
      data: { userId, postId, content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  async updateComment(commentId: string, content: string) {
    return prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  async deleteComment(commentId: string) {
    return prisma.comment.update({
      where: { id: commentId },
      data: { deletedAt: new Date() },
    });
  }

  async getComments(postId: string) {
    return prisma.comment.findMany({
      where: { postId, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCommentCount(postId: string): Promise<number> {
    return prisma.comment.count({
      where: { postId, deletedAt: null },
    });
  }

  //============================
  // STATISTICS & ANALYTICS
  //============================
  async getPostStats(postId: string) {
    const [likesCount, sharesCount, commentsCount] = await Promise.all([
      this.getLikeCount(postId),
      this.getShareCount(postId),
      this.getCommentCount(postId),
    ]);

    return {
      totalLikes: likesCount,
      totalShares: sharesCount,
      totalComments: commentsCount,
    };
  }

  async getUserPostsCount(userId: string): Promise<number> {
    return this.modelDelegate.count({
      where: { userId, deletedAt: null },
    });
  }

  //============================
  // CHECK USER INTERACTIONS
  //============================
  async isLikedByUser(postId: string, userId: string): Promise<boolean> {
    const like = await this.findLike(userId, postId);
    return !!like;
  }

  async isSharedByUser(postId: string, userId: string): Promise<boolean> {
    const share = await this.findShare(userId, postId);
    return !!share;
  }
}
