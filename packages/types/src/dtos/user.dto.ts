import { Role, UserStatus } from '../enums';

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  country?: string;
  image?: string;
  agentDetails?: UpdateIndependentAgentDto;
  cooperateDetails?: UpdateCooperateAgentDto;
  affiliateDetails?: UpdateAffiliateDto;
}

export interface UpdateUserStatusDto {
  status: UserStatus;
}

export interface UpdateIndependentAgentDto {
  certifications?: string[];
  howDidYouHear?: string;
}

export interface UpdateCooperateAgentDto {
  companyName?: string;
  travelBusinessDescription?: string;
  howDidYouHear?: string;
}

export interface UpdateAffiliateDto {
  communityBrand?: string;
  socialLinks?: string[];
  howDidYouHear?: string;
}

export interface UserProfileResponseDto {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
  country: string | null;
  role: Role;
  status: UserStatus;
  safetyAmbassador: boolean;
  referralCode: string;
  referredById: string | null;
  createdAt: Date;
  stats?: {
    totalReferrals: number;
    totalPosts: number;
    totalReviews: number;
    totalAdventureLikes: number;
  };
}

export interface ReferralStatsDto {
  totalReferrals: number;
  activeReferrals: number;
  referralCode: string;
  referrals: {
    id: string;
    name: string;
    email: string;
    image: string;
    status: UserStatus;
    createdAt: Date;
  }[];
}
