// ==================== EVENT DTOs ====================

import { EventPricing, EventStatus } from '../enums';

export interface CreateEventDto {
  title: string;
  date: Date | string;
  description: string;
  location: string;
  pricing: EventPricing;
  spotLeft: number;
  isSignature: boolean;
  joinTill: Date | string;
  cancellationTerms: string;
  // Cloudinary media
  mediaUrl?: string;
  publicId?: string;
}

export interface UpdateEventDto {
  title?: string;
  date?: Date | string;
  description?: string;
  isSignature?: boolean;
  location?: string;
  pricing?: EventPricing;
  spotLeft?: number;
  joinTill?: Date | string;
  cancellationTerms?: string;
  // Cloudinary media update
  mediaUrl?: string;
  publicId?: string;
}

export interface EventResponseDto {
  id: string;
  title: string;
  date: Date;
  description: string;
  location: string;
  createdBy: string;
  isSignature: boolean;
  spotLeft: number;
  pricing: EventPricing;
  joinTill: Date;
  cancellationTerms: string;
  mediaUrl: string | null;
  publicId: string | null;
  createdAt: Date;
  creator?: {
    id: string;
    name: string;
    image: string | null;
  };
  registrations?: {
    user: {
      id: string;
      name: string;
      image: string | null;
    };
  }[];
  isExpired?: boolean;
  isFull?: boolean;
  hasJoined?: boolean;
}

export interface EventListQueryDto {
  page?: number;
  limit?: number;
  location?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  hasSpots?: boolean;
  sortBy?: 'date' | 'createdAt' | 'spotLeft';
  sortOrder?: 'asc' | 'desc';
}

export interface JoinEventDto {
  notes?: string;
}

export interface EventRegistrationResponseDto {
  id: string;
  eventId: string;
  userId: string;
  status: EventStatus;
  createdAt: Date;
  event?: {
    title: string;
    date: Date;
    location: string;
    mediaUrl: string | null;
  };
}

export interface MyBookingsQueryDto {
  status?: EventStatus;
  upcomingOnly?: boolean;
}

export interface EventStatsDto {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalSpotsAvailable: number;
  popularLocations: {
    location: string;
    count: number;
  }[];
}
