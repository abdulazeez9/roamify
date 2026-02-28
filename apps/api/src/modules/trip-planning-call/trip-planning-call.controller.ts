import { Response } from 'express';
import { TripPlanningCallService } from './trip-planning-call.service';
import { ResponseUtil } from 'src/shared/utils/responseUtils';
import { Prisma, CallStatus } from '@zagotours/database';
import { asyncHandler } from 'src/shared/middleware/async-handler.middleware';
import { ReqParams, TypedRequest } from 'src/shared/types/express.types';
import { CreateTripPlanningCallDto } from '@zagotours/types';
import { UuidParam } from 'src/common/validation/common.validation';

export class TripPlanningCallController {
  constructor(private readonly callService: TripPlanningCallService) {}

  /**
   * Schedule a call (adventurer schedules with their referrer/agent)
   */
  scheduleCall = asyncHandler(
    async (req: TypedRequest<{}, CreateTripPlanningCallDto>, res: Response) => {
      const { startTime, endTime, meetingLink } = req.body;

      if (!startTime) {
        return ResponseUtil.error(res, 'Start time is required', 400);
      }

      const call = await this.callService.scheduleCall(req.userId!, {
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : undefined,
        meetingLink,
      });

      return ResponseUtil.success(
        res,
        call,
        'Call scheduled successfully',
        201,
      );
    },
  );

  /**
   * Reschedule a call
   */
  rescheduleCall = asyncHandler(
    async (
      req: TypedRequest<UuidParam, { startTime?: string; endTime?: string }>,
      res: Response,
    ) => {
      const { startTime, endTime } = req.body;

      if (!startTime) {
        return ResponseUtil.error(res, 'Start time is required', 400);
      }

      const call = await this.callService.rescheduleCall(
        req.params.id,
        new Date(startTime),
        endTime ? new Date(endTime) : undefined,
      );

      return ResponseUtil.success(res, call, 'Call rescheduled successfully');
    },
  );

  /**
   * Cancel a call
   */
  cancelCall = asyncHandler(
    async (
      req: TypedRequest<UuidParam, { reason?: string }>,
      res: Response,
    ) => {
      const { reason } = req.body;

      const call = await this.callService.cancelCall(req.params.id, reason);
      return ResponseUtil.success(res, call, 'Call cancelled successfully');
    },
  );

  /**
   * Mark call as completed
   */
  markAsCompleted = asyncHandler(
    async (req: ReqParams<UuidParam>, res: Response) => {
      const call = await this.callService.markAsCompleted(req.params.id);
      return ResponseUtil.success(res, call, 'Call marked as completed');
    },
  );

  /**
   * Get upcoming calls for current user
   */
  getUpcoming = asyncHandler(async (req: TypedRequest, res: Response) => {
    const calls = await this.callService.getUpcoming(req.userId!);
    return ResponseUtil.success(res, calls);
  });

  /**
   * Get my calls (as adventurer or agent)
   */
  getMyCalls = asyncHandler(async (req: TypedRequest, res: Response) => {
    const calls = await this.callService.getByAdventurer(req.userId!);
    return ResponseUtil.success(res, calls);
  });

  /**
   * Get all calls (admin only - paginated)
   */
  getAll = asyncHandler(
    async (
      req: TypedRequest<
        {},
        {},
        {
          page?: number;
          limit?: number;
          status?: string;
          startDate?: string;
          endDate?: string;
        }
      >,
      res: Response,
    ) => {
      const { page = 1, limit = 10, status, startDate, endDate } = req.query;

      const filters: Prisma.TripPlanningCallWhereInput = {};

      if (status) {
        filters.status = status as CallStatus;
      }

      if (startDate && endDate) {
        filters.startTime = {
          gte: new Date(String(startDate)),
          lte: new Date(String(endDate)),
        };
      }

      const result = await this.callService.paginate(
        Number(page),
        Number(limit),
        { where: filters },
      );

      return ResponseUtil.paginated(res, result);
    },
  );

  /**
   * Get call by ID
   */
  getById = asyncHandler(async (req: ReqParams<UuidParam>, res: Response) => {
    const call = await this.callService.getById(req.params.id);
    return ResponseUtil.success(res, call);
  });

  /**
   * Delete call
   */
  delete = asyncHandler(async (req: ReqParams<UuidParam>, res: Response) => {
    await this.callService.delete(req.params.id, true);
    return ResponseUtil.success(res, null, 'Call deleted successfully');
  });
}
