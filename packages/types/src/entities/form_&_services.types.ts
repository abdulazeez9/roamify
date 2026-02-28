import { CallStatus, ContractStatus } from '../enums';
import { User } from './user.types';

export interface TripRequest {
  id: string;
  tripType: string;
  destination: string;
  date: Date;
  preferences: string | null;
  createdAt: Date;
}

export interface CallbackRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  bestTime: string;
  createdAt: Date;
}

export interface GeneralInquiry {
  id: string;
  email: string;
  message: string;
  phone: string | null;
  address: string | null;
  createdAt: Date;
}

export interface TripPlanningCall {
  id: string;
  adventurerId: string;
  agentId?: string;
  calendarEventId: string | null;
  meetingLink: string | null;
  startTime: Date;
  endTime: Date | null;
  status: CallStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface TripPlanningCallWithRelations extends TripPlanningCall {
  adventurer?: Omit<
    User,
    'password' | 'resetPasswordToken' | 'resetPasswordExpires'
  >;
  agent?: Omit<
    User,
    'password' | 'resetPasswordToken' | 'resetPasswordExpires'
  >;
}

export interface Contract {
  id: string;
  userId: string;
  agreement: string;
  status: ContractStatus;
  signedAt: Date | null;
  documentUrl: string;
  publicId: string | null;
  createdAt: Date;
}

export interface ContractWithUser extends Contract {
  user: Omit<User, 'password' | 'resetPasswordToken' | 'resetPasswordExpires'>;
}
