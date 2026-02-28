import { EventPricing } from '../enums';

export interface Event {
  id: string;
  title: string;
  date: Date;
  description: string;
  location: string;
  pricing: EventPricing;
  createdBy: string;
  spotLeft: number;
  isSignature: boolean;
  joinTill: Date;
  cancellationTerms: string;
  mediaUrl: string | null;
  publicId: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isExpired?: boolean;
  isFull?: boolean;
  hasJoined?: boolean;
}
