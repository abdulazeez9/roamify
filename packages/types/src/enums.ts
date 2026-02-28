export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  AFFILIATE = 'AFFILIATE',
  ADVENTURER = 'ADVENTURER',
  INDEPENDENT_AGENT = 'INDEPENDENT_AGENT',
  COOPERATE_AGENT = 'COOPERATE_AGENT',
}

export enum EventPricing {
  FREE = 'FREE',
  PAID = 'PAID',
}
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum AdventureStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export enum AdventureLevel {
  MEDIUM = 'MEDIUM',
  CHALLENGING = 'CHALLENGING',
  HARD = 'HARD',
}

export enum AccessType {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
}

export enum CallStatus {
  SCHEDULED = 'SCHEDULED',
  EXPIRED = 'EXPIRED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ContractStatus {
  SIGNED = 'SIGNED',
  NOT_SIGNED = 'NOT_SIGNED',
}

export enum EventStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  ATTENDED = 'ATTENDED',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
}

export enum TripType {
  HIKING = 'HIKING',
  KAYAKING = 'KAYAKING',
  CANOEING = 'CANOEING',
  SNOWBOARDING = 'SNOWBOARDING',
  TREKKING = 'TREKKING',
  SKIING = 'SKIING',
  SKYDIVING = 'SKYDIVING',
  SAFARIS = 'SAFARIS',
  CLIMBING = 'CLIMBING',
  JUMPING = 'JUMPING',
  RAFTING = 'RAFTING',
}
