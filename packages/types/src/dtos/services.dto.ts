import { CallStatus, ContractStatus, TripType } from '../enums';

// ==================== TRIP REQUEST DTOs ====================

export interface CreateTripRequestDto {
  tripType: TripType;
  destination: string;
  date: Date | string;
  preferences?: string;
}

export interface TripRequestResponseDto {
  id: string;
  tripType: string;
  destination: string;
  date: Date;
  preferences: string | null;
  createdAt: Date;
  adventurer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface TripRequestListQueryDto {
  page?: number;
  limit?: number;
  destination?: string;
  tripType?: TripType;
  startDate?: Date | string;
  endDate?: Date | string;
  sortBy?: 'createdAt' | 'date';
  sortOrder?: 'asc' | 'desc';
}

// ==================== CALLBACK REQUEST DTOs ====================

export interface CreateCallbackRequestDto {
  name: string;
  email: string;
  phone: string;
  bestTime: string;
}

export interface CallbackRequestResponseDto {
  id: string;
  name: string;
  email: string;
  image: string;
  phone: string;
  bestTime: string;
  createdAt: Date;
}

export interface CallbackRequestListQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// ==================== GENERAL INQUIRY DTOs ====================

export interface CreateGeneralInquiryDto {
  email: string;
  message: string;
  phone?: string;
  address?: string;
}

export interface GeneralInquiryResponseDto {
  id: string;
  email: string;
  message: string;
  phone: string | null;
  address: string | null;
  createdAt: Date;
}

export interface GeneralInquiryListQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// ==================== TRIP PLANNING CALL DTOs ====================

export interface CreateTripPlanningCallDto {
  startTime: Date | string;
  endTime?: Date | string;
  meetingLink?: string;
}

export interface ScheduleCallDto {
  startTime: Date;
  endTime?: Date;
  meetingLink?: string;
}

export interface UpdateTripPlanningCallDto {
  startTime?: Date | string;
  endTime?: Date | string;
  meetingLink?: string;
  status?: CallStatus;
  calendarEventId?: string;
}

export interface TripPlanningCallResponseDto {
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
  adventurer?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  agent?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

export interface TripPlanningCallListQueryDto {
  page?: number;
  limit?: number;
  adventurerId?: string;
  agentId?: string;
  status?: CallStatus;
  startDate?: Date | string;
  endDate?: Date | string;
  sortBy?: 'startTime' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CancelTripPlanningCallDto {
  callId: string;
}

export interface CompleteTripPlanningCallDto {
  callId: string;
}

// ==================== CONTRACT DTOs ====================

export interface CreateContractDto {
  userId: string;
  agreement: string;
  // Cloudinary document
  documentUrl?: string;
  publicId?: string;
}

export interface SignContractDto {
  contractId: string;
}

export interface ContractResponseDto {
  id: string;
  userId: string;
  agreement: string;
  status: ContractStatus;
  signedAt: Date | null;
  documentUrl: string;
  publicId: string | null;
  createdAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ContractListQueryDto {
  page?: number;
  limit?: number;
  userId?: string;
  status?: ContractStatus;
  sortBy?: 'createdAt' | 'signedAt';
  sortOrder?: 'asc' | 'desc';
}
