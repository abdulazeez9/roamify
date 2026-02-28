import { Response } from 'express';
import { CallbackRequestService } from './callback-request.service';
import { ResponseUtil } from 'src/shared/utils/responseUtils';
import {
  ReqParams,
  TypedRequest,
  ReqBody,
} from 'src/shared/types/express.types';
import { UuidParam } from 'src/common/validation/common.validation';
import { asyncHandler } from 'src/shared/middleware/async-handler.middleware';
import { CreateCallbackRequestDto } from '@zagotours/types';

export class CallbackRequestController {
  constructor(private readonly callbackService: CallbackRequestService) {}

  /**
   * Create callback request
   * If user is logged in (has userId), auto-assign to referrer
   * If anonymous, create without assignment
   */
  create = asyncHandler(
    async (req: ReqBody<CreateCallbackRequestDto>, res: Response) => {
      const { name, email, phone, bestTime } = req.body;

      // Validation
      if (!name || !email || !phone || !bestTime) {
        return ResponseUtil.error(res, 'All fields are required', 400);
      }

      let request;

      // Check if user is logged in
      if (req.userId) {
        // Logged in - assign to referrer
        request = await this.callbackService.createForAdventurer(req.userId, {
          name,
          email,
          phone,
          bestTime,
        });
      } else {
        // Anonymous - no assignment
        request = await this.callbackService.createAnonymous({
          name,
          email,
          phone,
          bestTime,
        });
      }

      return ResponseUtil.success(
        res,
        request,
        'Callback request submitted successfully',
        201,
      );
    },
  );

  /**
   * Get all callback requests (admin only)
   */
  getAll = asyncHandler(
    async (
      req: TypedRequest<
        {},
        {},
        { page?: number; limit?: number; startDate?: string; endDate?: string }
      >,
      res: Response,
    ) => {
      const { page = 1, limit = 10, startDate, endDate } = req.query;

      let result;

      if (startDate && endDate) {
        const requests = await this.callbackService.getByDateRange(
          new Date(String(startDate)),
          new Date(String(endDate)),
        );
        return ResponseUtil.success(res, requests);
      }

      result = await this.callbackService.paginate(Number(page), Number(limit));

      return ResponseUtil.paginated(res, result);
    },
  );

  /**
   * Get my callback requests (adventurer's own requests)
   */
  getMyRequests = asyncHandler(async (req: TypedRequest, res: Response) => {
    const requests = await this.callbackService.getByAdventurer(req.userId!);
    return ResponseUtil.success(res, requests);
  });

  /**
   * Get requests assigned to me (agent's assigned requests from their referrals)
   */
  getAssignedToMe = asyncHandler(async (req: TypedRequest, res: Response) => {
    const requests = await this.callbackService.getAssignedToAgent(req.userId!);
    return ResponseUtil.success(res, requests);
  });

  /**
   * Get pending requests
   */
  getPending = asyncHandler(async (req: TypedRequest, res: Response) => {
    const requests = await this.callbackService.getPending();
    return ResponseUtil.success(res, requests);
  });

  /**
   * Get by ID
   */
  getById = asyncHandler(async (req: ReqParams<UuidParam>, res: Response) => {
    const request = await this.callbackService.getById(req.params.id);
    return ResponseUtil.success(res, request);
  });

  /**
   * Delete request
   */
  delete = asyncHandler(async (req: ReqParams<UuidParam>, res: Response) => {
    await this.callbackService.delete(req.params.id, true);
    return ResponseUtil.success(res, null, 'Request deleted successfully');
  });
}
