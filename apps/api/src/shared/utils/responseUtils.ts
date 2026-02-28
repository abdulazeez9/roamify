import { Response } from 'express';
import {
  ApiResponse,
  PaginatedResponse,
  PaginationResult,
} from '@zagotours/types';

export class ResponseUtil {
  //===== SUCCESS RESPONSE ======
  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = 200
  ) {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  //===== ERROR RESPONSE ======
  static error(
    res: Response,
    message: string,
    statusCode = 400,
    error?: string
  ) {
    const response: ApiResponse = {
      success: false,
      message,
      error,
    };
    return res.status(statusCode).json(response);
  }

  //===== PAGINATION REPONSE ======
  static paginated<T>(
    res: Response,
    result: PaginationResult<T>,
    message = 'Success',
    statusCode = 200
  ) {
    const response: PaginatedResponse<T> = {
      success: true,
      message,
      data: result.data,
      pagination: result.pagination,
    };
    return res.status(statusCode).json(response);
  }
}
