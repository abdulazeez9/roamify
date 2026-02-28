import { Response } from 'express';
import { TripRequestService } from './trip-request.service';
import { ResponseUtil } from 'src/shared/utils/responseUtils';
import { Prisma, TripType } from '@zagotours/database';
import { asyncHandler } from 'src/shared/middleware/async-handler.middleware';
import {
  ReqBody,
  ReqParams,
  ReqQuery,
  TypedRequest,
} from 'src/shared/types/express.types';
import { CreateTripRequestDto } from '@zagotours/types';
import { UuidParam } from 'src/common/validation/common.validation';

export class TripRequestController {
  constructor(private readonly tripRequestService: TripRequestService) {}

  /**
   * Create a trip request (adventurer creates their own request)
   * Automatically assigns to their referrer
   */
  create = asyncHandler(
    async (req: ReqBody<CreateTripRequestDto>, res: Response) => {
      const dto: CreateTripRequestDto = req.body;

      if (!dto.tripType || !dto.destination || !dto.date) {
        return ResponseUtil.error(
          res,
          'Trip type, destination, and date are required',
          400,
        );
      }

      const request = await this.tripRequestService.createForAdventurer(
        req.userId!,
        dto,
      );

      return ResponseUtil.success(
        res,
        request,
        'Trip request submitted successfully',
        201,
      );
    },
  );

  /**
   * Get all trip requests
   */
  getAll = asyncHandler(
    async (
      req: ReqQuery<{
        page?: number;
        limit?: number;
        tripType?: TripType;
        destination?: string;
        startDate?: string;
        endDate?: string;
      }>,
      res: Response,
    ) => {
      const {
        page = 1,
        limit = 10,
        tripType,
        destination,
        startDate,
        endDate,
      } = req.query;

      const filters: Prisma.TripRequestWhereInput = {};

      if (tripType) {
        filters.tripType = tripType;
      }

      if (destination) {
        filters.destination = {
          contains: String(destination),
          mode: 'insensitive',
        };
      }

      if (startDate && endDate) {
        filters.date = {
          gte: new Date(String(startDate)),
          lte: new Date(String(endDate)),
        };
      }

      const result = await this.tripRequestService.paginate(
        Number(page),
        Number(limit),
        { where: filters },
      );

      return ResponseUtil.paginated(res, result);
    },
  );

  /**
   * Get my trip requests (adventurer's own requests)
   */
  getMyRequests = asyncHandler(async (req: TypedRequest, res: Response) => {
    const requests = await this.tripRequestService.getByAdventurer(req.userId!);
    return ResponseUtil.success(res, requests);
  });

  /**
   * Get requests assigned to me (agent's assigned requests from their referrals)
   */
  getAssignedToMe = asyncHandler(async (req: TypedRequest, res: Response) => {
    const requests = await this.tripRequestService.getAssignedToAgent(
      req.userId!,
    );
    return ResponseUtil.success(res, requests);
  });

  /**
   * Get recent requests
   */
  getRecent = asyncHandler(async (req: TypedRequest, res: Response) => {
    const requests = await this.tripRequestService.getRecent();
    return ResponseUtil.success(res, requests);
  });

  /**
   * Get by ID
   */
  getById = asyncHandler(async (req: ReqParams<UuidParam>, res: Response) => {
    const request = await this.tripRequestService.getById(req.params.id);
    return ResponseUtil.success(res, request);
  });

  /**
   * Delete request
   */
  delete = asyncHandler(async (req: ReqParams<UuidParam>, res: Response) => {
    await this.tripRequestService.delete(req.params.id, true);
    return ResponseUtil.success(res, null, 'Trip request deleted successfully');
  });
}
