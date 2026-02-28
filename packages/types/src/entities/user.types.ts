import { Role, UserStatus } from '../enums';
import { AdventureLike } from './adventure.types';
import { Like, Post, Share } from './community.types';
import { Contract, TripPlanningCall } from './form_&_services.types';
import { Review } from './review.types';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  phone: string | null;
  country: string | null;
  password: string;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
  role: Role;
  status: UserStatus;
  safetyAmbassador: boolean;
  referralCode: string;
  referredById: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UserWithRelations extends Omit<
  User,
  'password' | 'resetPasswordToken' | 'resetPasswordExpires'
> {
  referrer?: UserWithRelations | null;
  referees?: UserWithRelations[];
  reviews?: Review[];
  adventureLikes?: AdventureLike[];
  independentDetails?: IndependentAgent | null;
  cooperateDetails?: CooperateAgent | null;
  affiliateDetails?: Affiliate | null;
  posts?: Post[];
  comments?: Comment[];
  likes?: Like[];
  shares?: Share[];
  contracts?: Contract[];
  plannedCalls?: TripPlanningCall[];
  agentCalls?: TripPlanningCall[];
}

export interface IndependentAgent {
  id: string;
  userId: string;
  certifications: string[];
  howDidYouHear: string | null;
}

export interface CooperateAgent {
  id: string;
  userId: string;
  companyName: string;
  travelBusinessDescription: string;
  howDidYouHear: string | null;
}

export interface Affiliate {
  id: string;
  userId: string;
  communityBrand: string;
  socialLinks: string[];
  howDidYouHear: string | null;
}

export interface UserProfile extends User {
  independentDetails?: IndependentAgent;
  cooperateDetails?: CooperateAgent;
  affiliateDetails?: Affiliate;
}
