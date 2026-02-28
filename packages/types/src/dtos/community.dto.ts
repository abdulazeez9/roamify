import { MediaType } from '../enums';

// ==================== POST DTOs ====================

export interface CreatePostDto {
  title: string;
  description: string;
  mediaType?: MediaType;
  // Cloudinary media
  mediaUrl?: string;
  publicId?: string;
}

export interface UpdatePostDto {
  title?: string;
  description?: string;
  // Cloudinary media update
  mediaUrl?: string;
  publicId?: string;
  mediaType?: MediaType;
}

export interface PostResponseDto {
  id: string;
  userId: string;
  title: string;
  description: string;
  mediaUrl: string | null;
  publicId: string | null;
  mediaType: MediaType;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    country: string;
    image: string;
  };
  _count: {
    likes: number;
    comments: number;
    shares: number;
  };
  isLikedByUser?: boolean;
  isSharedByUser?: boolean;
}

export interface PostDetailResponseDto extends PostResponseDto {
  comments: CommentResponseDto[];
}

export interface PostListQueryDto {
  page?: number;
  limit?: number;
  userId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'likes' | 'comments';
  sortOrder?: 'asc' | 'desc';
}

// ==================== COMMENT DTOs ====================

export interface CreateCommentDto {
  postId: string;
  content: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface CommentResponseDto {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
  };
}

export interface CommentListQueryDto {
  page?: number;
  limit?: number;
  postId: string;
  sortOrder?: 'asc' | 'desc';
}

// ==================== LIKE DTOs ====================

export interface ToggleLikeDto {
  postId: string;
}

export interface LikeResponseDto {
  id: string;
  postId: string;
  userId: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface PostLikesQueryDto {
  postId: string;
  page?: number;
  limit?: number;
}

// ==================== SHARE DTOs ====================

export interface ToggleShareDto {
  postId: string;
}

export interface ShareResponseDto {
  id: string;
  postId: string;
  userId: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface PostSharesQueryDto {
  postId: string;
  page?: number;
  limit?: number;
}

// ==================== COMMUNITY STATS DTOs ====================

export interface CommunityStatsDto {
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalShares: number;
  mostActiveUsers: {
    id: string;
    name: string;
    postsCount: number;
    commentsCount: number;
  }[];
  topPosts: {
    id: string;
    title: string;
    likesCount: number;
    commentsCount: number;
  }[];
}
