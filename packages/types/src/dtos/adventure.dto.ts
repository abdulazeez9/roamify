import {
  AdventureLevel,
  AdventureStatus,
  AccessType,
  MediaType,
  TripType,
} from '../enums';

// ==================== ADVENTURE DTOs ====================

export interface CreateAdventureDto {
  title: string;
  price: number;
  location: string;
  level: AdventureLevel;
  tripType: TripType;
  date: Date | string;
  description: string;
  days: number;
  certification?: string;
  gear?: string;
  access?: AccessType;
  safetyScore?: number;
  safetyTips?: string;
  rating?: number;
  inclusions?: string;
  exclusions?: string;
  partnerDescription?: string;
  mediaUrl?: string;
  publicId?: string;
}

export interface UpdateAdventureDto {
  title?: string;
  price?: number;
  location?: string;
  level?: AdventureLevel;
  tripType?: TripType;
  date?: Date | string;
  description?: string;
  days?: number;
  certification?: string;
  gear?: string;
  access?: AccessType;
  status?: AdventureStatus;
  safetyScore?: number;
  safetyTips?: string;
  rating?: number;
  inclusions?: string;
  exclusions?: string;
  partnerDescription?: string;
  isVerified?: boolean;
  lastSafetyCertDate?: Date | string;
  // Cloudinary media update
  mediaUrl?: string;
  publicId?: string;
}

export interface AdventureResponseDto {
  id: string;
  title: string;
  isVerified: boolean;
  price: number;
  location: string;
  level: AdventureLevel;
  tripType: TripType;
  safetyScore: number;
  safetyTips: string;
  rating: number;
  certification: string | null;
  gear: string | null;
  status: AdventureStatus;
  inclusions?: string;
  exclusions?: string;
  partnerDescription?: string;
  mediaUrl: string | null;
  publicId: string | null;
  date: Date;
  description: string;
  days: number;
  access: AccessType;
  lastSafetyCertDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    likes: number;
    itineraries: number;
    gallery: number;
  };
  isLiked?: boolean;
}

export interface AdventureDetailResponseDto extends AdventureResponseDto {
  itineraries: ItineraryResponseDto[];
  gallery: AdventureGalleryResponseDto[];
  likes: AdventureLikeResponseDto[];
  isLikedByUser?: boolean;
  isLiked?: boolean;
}

export interface AdventureListQueryDto {
  page?: number;
  limit?: number;
  location?: string;
  level?: AdventureLevel;
  tripType?: string;
  status?: AdventureStatus;
  minPrice?: number;
  maxPrice?: number;
  isVerified?: boolean;
  access?: AccessType;
  sortBy?: 'price' | 'rating' | 'date' | 'safetyScore' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// ==================== ITINERARY DTOs ====================

export interface CreateItineraryDto {
  dayNumber: number;
  title: string;
  activityDetails: string;
  // Cloudinary image
  imageUrl?: string | null;
  publicId?: string | null;
}

export interface UpdateItineraryDto {
  dayNumber?: number;
  title?: string;
  activityDetails?: string;
  // Cloudinary image update
  imageUrl?: string;
  publicId?: string;
}

export interface ItineraryResponseDto {
  id: string;
  adventureId: string;
  dayNumber: number;
  title: string;
  activityDetails: string;
  imageUrl: string | null;
  publicId: string | null;
}

export interface BulkCreateItinerariesDto {
  itineraries: CreateItineraryDto[];
}

// ==================== ADVENTURE GALLERY DTOs ====================

export interface CreateAdventureGalleryDto {
  mediaType: MediaType;
  altText?: string;
  order?: number;
}

export interface UpdateAdventureGalleryDto {
  altText?: string;
  order?: number;
}

export interface AdventureGalleryResponseDto {
  id: string;
  mediaUrl: string;
  publicId: string | null;
  mediaType: MediaType;
  altText: string | null;
  order: number;
  adventureId: string;
  createdAt: Date;
}

export interface BulkUploadGalleryDto {
  mediaTypes?: MediaType[];
  altTexts?: string[];
}

export interface ReorderGalleryDto {
  items: {
    id: string;
    order: number;
  }[];
}
// ==================== ADVENTURE LIKE DTOs ====================

export interface ToggleAdventureLikeDto {
  adventureId: string;
}

export interface AdventureLikeResponseDto {
  id: string;
  userId: string;
  adventureId: string;
  user?: {
    id: string;
    name: string;
    image: string;
  };
}

// ==================== ADVENTURE STATS DTOs ====================

export interface AdventureStatsDto {
  overview: {
    total: number;
    active: number;
    verified: number;
    growthRate: number;
  };
  metrics: {
    averageRating: number;
    averageSafetyScore: number;
    completionRate: number;
  };
  distributions: {
    byLocation: Array<{ location: string; count: number; percentage: number }>;
    byLevel: Array<{ level: AdventureLevel; count: number }>;
  };
}
