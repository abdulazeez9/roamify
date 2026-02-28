import { PaginationMeta } from './pagination';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  statusCode: number;
}
