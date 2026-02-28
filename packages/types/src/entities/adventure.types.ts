import {
  AdventureStatus,
  AdventureLevel,
  AccessType,
  MediaType,
  TripType,
} from '../enums';
import { User } from './user.types';

export interface Adventure {
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
  mediaUrl: string | null;
  publicId: string | null;
  date: Date;
  description: string;
  days: number;
  access: AccessType;
  inclusions?: string;
  exclusions?: string;
  partnerDescription?: string;
  lastSafetyCertDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  isLiked?: boolean;
}

export interface AdventureWithRelations extends Adventure {
  likes?: AdventureLike[];
  itineraries?: Itinerary[];
  gallery?: AdventureGallery[];
  _count: {
    likes: number;
    itineraries: number;
    gallery: number;
  };
  isLiked?: boolean;
}

export interface AdventureLike {
  id: string;
  userId: string;
  adventureId: string;
  user?: User;
  adventure?: Adventure;
}

export interface Itinerary {
  id: string;
  adventureId: string;
  dayNumber: number;
  title: string;
  activityDetails: string;
  imageUrl: string | null;
  publicId: string | null;
}

export interface AdventureGallery {
  id: string;
  mediaUrl: string;
  publicId: string | null;
  mediaType: MediaType;
  altText: string | null;
  order: number;
  adventureId: string;
  createdAt: Date;
  deletedAt: Date | null;
}
