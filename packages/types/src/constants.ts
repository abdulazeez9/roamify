import {
  AdventureLevel,
  AdventureStatus,
  CallStatus,
  ContractStatus,
  Role,
  TripType,
  UserStatus,
} from './enums';
export const TripTypeLabels: Record<TripType, string> = {
  HIKING: 'Hiking',
  KAYAKING: 'Kayaking',
  CANOEING: 'Canoeing',
  SNOWBOARDING: 'Snowboarding',
  TREKKING: 'Trekking',
  SKIING: 'Skiing',
  SKYDIVING: 'Skydiving',
  SAFARIS: 'Safaris',
  CLIMBING: 'Mountain Climbing',
  JUMPING: 'Jumping',
  RAFTING: 'Rafting',
};

export const RoleLabels: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Administrator',
  AFFILIATE: 'Affiliate Partner',
  ADVENTURER: 'Adventurer',
  INDEPENDENT_AGENT: 'Independent Agent',
  COOPERATE_AGENT: 'Corporate Agent',
};

export const AdventureLevelLabels: Record<AdventureLevel, string> = {
  MEDIUM: 'Medium',
  CHALLENGING: 'Challenging',
  HARD: 'Hard',
};

export const AdventureStatusLabels: Record<AdventureStatus, string> = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
};

export const CallStatusLabels: Record<CallStatus, string> = {
  SCHEDULED: 'Scheduled',
  EXPIRED: 'Expired',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const UserStatusLabels: Record<UserStatus, string> = {
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
};

export const ContractStatusLabels: Record<ContractStatus, string> = {
  SIGNED: 'Signed & Verified',
  NOT_SIGNED: 'Pending Signature',
};
