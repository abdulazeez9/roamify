import { Role, UserStatus } from '../enums';

export type RegistrableRole = Exclude<Role, Role.SUPER_ADMIN>;

export type CustomerRole = Exclude<Role, Role.SUPER_ADMIN | Role.ADMIN>;

export const STAFF_ROLES: Role[] = [Role.SUPER_ADMIN, Role.ADMIN];

export const PARTNER_ROLES: Role[] = [
  Role.ADVENTURER,
  Role.AFFILIATE,
  Role.INDEPENDENT_AGENT,
  Role.COOPERATE_AGENT,
];

export const PUBLIC_ROLES_LIST: RegistrableRole[] = [
  Role.ADMIN,
  Role.AFFILIATE,
  Role.ADVENTURER,
  Role.INDEPENDENT_AGENT,
  Role.COOPERATE_AGENT,
];

export const ROLE_PREFIXES: Record<Role, string> = {
  [Role.ADVENTURER]: 'ADV',
  [Role.AFFILIATE]: 'AFF',
  [Role.INDEPENDENT_AGENT]: 'IND',
  [Role.COOPERATE_AGENT]: 'COR',
  [Role.ADMIN]: 'ADM',
  [Role.SUPER_ADMIN]: 'SUP',
};

export interface IndependentAgentDto {
  certifications: string[];
  howDidYouHear?: string;
}

export interface CooperateAgentDto {
  companyName: string;
  travelBusinessDescription: string;
  howDidYouHear?: string;
}

export interface AffiliateDto {
  communityBrand: string;
  socialLinks: string[];
  howDidYouHear?: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  country?: string;
  role: CustomerRole;
  referralCode?: string;
  safetyAmbassador?: boolean;
  agentDetails?: IndependentAgentDto;
  cooperateDetails?: CooperateAgentDto;
  affiliateDetails?: AffiliateDto;
}

export interface AdminRegisterDto {
  name?: string;
  email: string;
  password: string;
  phone?: string;
  country?: string;
  role: Role.ADMIN;
  referralCode?: string;
}

export type UserProfileResponse =
  | (IndependentAgentDto & { type: Role.INDEPENDENT_AGENT })
  | (CooperateAgentDto & { type: Role.COOPERATE_AGENT })
  | (AffiliateDto & { type: Role.AFFILIATE })
  | null;

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  country?: string;
  role: Role;
  status: UserStatus;
  safetyAmbassador: boolean;
  referralCode: string;
  referredById: string | null;
  referralLink: string;
  referralCount?: number;
  createdAt: Date;
  updatedAt: Date;
  profile: UserProfileResponse;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}
