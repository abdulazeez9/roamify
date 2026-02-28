export interface CreateReviewDto {
  title?: string;
  content: string;
  rating: number; // 1-5
}

export interface UpdateReviewDto {
  title?: string;
  content?: string;
  rating?: number;
}

export interface ReviewResponseDto {
  id: string;
  title: string | null;
  content: string;
  rating: number;
  isFeatured: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    country: string | null;
    image: string | null;
  };
}

export interface ReviewListQueryDto {
  page?: number;
  limit?: number;
  userId?: string;
  isFeatured?: boolean;
  minRating?: number;
  maxRating?: number;
  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface ToggleFeaturedReviewDto {
  reviewId: string;
  isFeatured: boolean;
}

export interface ReviewStatsDto {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  featuredReviews: number;
}
