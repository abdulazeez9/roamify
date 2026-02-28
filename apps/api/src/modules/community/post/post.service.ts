import { MediaType, Post, prisma, Prisma } from '@zagotours/database';
import {
  BaseService,
  NotFoundException,
} from 'src/common/service/base.service';
import { PostRepository } from './post.repository';
import { CreatePostDto, UpdatePostDto } from '@zagotours/types';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';

export class PostService extends BaseService<
  Post,
  Prisma.PostWhereInput,
  Prisma.PostCreateInput,
  Prisma.PostUpdateInput,
  Prisma.PostInclude
> {
  protected readonly resourceName = 'Post';

  constructor(private readonly postRepo: PostRepository) {
    super(postRepo);
  }

  //============================
  // CREATE POST
  //============================
  async createPost(userId: string, data: CreatePostDto): Promise<Post> {
    return this.create({
      title: data.title,
      description: data.description,
      mediaUrl: data.mediaUrl,
      publicId: data.publicId,
      mediaType: data.mediaType,
      user: { connect: { id: userId } },
    });
  }

  //============================
  // GET POST WITH DETAILS
  //============================
  async getPostWithDetails(postId: string) {
    const post = await this.postRepo.findWithDetails(postId);
    if (!post) {
      throw new NotFoundException(this.resourceName, postId);
    }
    return post;
  }

  //============================
  // GET POSTS BY USER
  //============================
  async getByUser(userId: string): Promise<Post[]> {
    return this.postRepo.findByUser(userId);
  }

  //============================
  // GET USER FEED
  //============================
  async getFeed(userId: string): Promise<Post[]> {
    return this.postRepo.findFeed(userId);
  }

  //============================
  // GET ALL POSTS WITH USER FLAGS
  //============================
  async getAllWithUserFlags(
    userId: string,
    page: number,
    limit: number,
    filters?: Prisma.PostWhereInput,
  ) {
    const result = await this.postRepo.paginateWithDetails(
      page,
      limit,
      filters,
    );

    const postsWithFlags = result.data.map((post: any) => ({
      ...post,
      isLikedByUser:
        post.likes?.some((like: any) => like.userId === userId) || false,
      isSharedByUser:
        post.shares?.some((share: any) => share.userId === userId) || false,
      likes: undefined,
      shares: undefined,
    }));

    return {
      ...result,
      data: postsWithFlags,
    };
  }
  //============================
  // PAGINATE POSTS
  //============================
  async paginate(
    page: number,
    limit: number,
    options?: {
      where?: Prisma.PostWhereInput;
      include?: Prisma.PostInclude;
      orderBy?: any;
    },
  ) {
    return this.postRepo.paginateWithDetails(page, limit, options?.where);
  }

  //============================
  // UPDATE POST
  //============================
  async updatePost(
    postId: string,
    userId: string,
    data: UpdatePostDto,
    isAdmin: boolean = false,
  ): Promise<Post> {
    const post = await this.getById(postId);

    if (post.userId !== userId && !isAdmin) {
      throw new Error('You are not authorized to update this post');
    }

    // Build update object with only provided fields
    const updateData: Prisma.PostUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.mediaUrl !== undefined) updateData.mediaUrl = data.mediaUrl;
    if (data.publicId !== undefined) updateData.publicId = data.publicId;
    if (data.mediaType !== undefined) updateData.mediaType = data.mediaType;

    return this.update(postId, updateData);
  }

  //============================
  // DELETE POST
  //============================
  async deletePost(
    postId: string,
    userId: string,
    isAdmin: boolean = false,
  ): Promise<Post> {
    const post = await this.getById(postId);

    if (post.userId !== userId && !isAdmin) {
      throw new Error('You are not authorized to delete this post');
    }

    // Delete media from Cloudinary if exists
    if (post.publicId) {
      await CloudinaryService.deleteFile(post.publicId);
    }

    return this.delete(postId); // Soft delete
  }

  //============================
  // TOGGLE LIKE
  //============================
  async toggleLike(userId: string, postId: string) {
    await this.getById(postId); // Verify post exists

    const existingLike = await this.postRepo.findLike(userId, postId);

    if (existingLike) {
      await this.postRepo.deleteLike(existingLike.id);
      return { liked: false };
    }

    await this.postRepo.createLike(userId, postId);
    return { liked: true };
  }

  //============================
  // TOGGLE SHARE
  //============================
  async toggleShare(userId: string, postId: string) {
    await this.getById(postId); // Verify post exists

    const existingShare = await this.postRepo.findShare(userId, postId);

    if (existingShare) {
      await this.postRepo.deleteShare(existingShare.id);
      return { shared: false };
    }

    await this.postRepo.createShare(userId, postId);
    return { shared: true };
  }

  //============================
  // ADD COMMENT
  //============================
  async addComment(userId: string, postId: string, content: string) {
    if (!content || content.trim().length === 0) {
      throw new Error('Comment content cannot be empty');
    }

    await this.getById(postId); // Verify post exists
    return this.postRepo.createComment(userId, postId, content);
  }

  //============================
  // GET COMMENTS
  //============================
  async getComments(postId: string) {
    await this.getById(postId);
    return this.postRepo.getComments(postId);
  }

  //============================
  // DELETE COMMENT
  //============================
  async deleteComment(commentId: string, userId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment', commentId);
    }

    if (comment.userId !== userId) {
      throw new Error('You are not authorized to delete this comment');
    }

    return this.postRepo.deleteComment(commentId);
  }
}
