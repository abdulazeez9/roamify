import { Response } from 'express';
import { ItineraryService } from './itinerary.service';
import { ResponseUtil } from 'src/shared/utils/responseUtils';
import { asyncHandler } from 'src/shared/middleware/async-handler.middleware';
import { ReqParams, ReqParamsBody } from 'src/shared/types/express.types';
import { UuidParam } from 'src/common/validation/common.validation';
import {
  UpdateItineraryDto,
  BulkCreateItinerariesDto,
  CreateItineraryDto,
} from '@zagotours/types';

export class ItineraryController {
  constructor(private readonly service: ItineraryService) {}

  create = asyncHandler(
    async (
      req: ReqParamsBody<{ adventureId: string }, CreateItineraryDto>,
      res: Response,
    ) => {
      const dto: CreateItineraryDto = {
        dayNumber: Number(req.body.dayNumber),
        title: req.body.title,
        activityDetails: req.body.activityDetails,
      };

      const result = await this.service.createWithImage(
        req.params.adventureId,
        dto,
        req.file,
      );
      return ResponseUtil.success(res, result, 'Itinerary created', 201);
    },
  );

  //==============================
  // CREATE MULTIPLE ITINERARIES (BULK)
  //==============================
  createBulk = asyncHandler(
    async (
      req: ReqParamsBody<{ adventureId: string }, BulkCreateItinerariesDto>,
      res: Response,
    ) => {
      const { adventureId } = req.params;
      const { itineraries } = req.body;

      const files = req.files as Express.Multer.File[];

      const result = await this.service.createBulk(
        adventureId,
        itineraries,
        files,
      );

      return ResponseUtil.success(res, result, result.message, 201);
    },
  );

  //=================================
  // GET ITINERARY BY ADVENTURES
  //=================================
  getByAdventure = asyncHandler(
    async (req: ReqParams<{ adventureId: string }>, res: Response) => {
      const itineraries = await this.service.getByAdventure(
        req.params.adventureId,
      );
      return ResponseUtil.success(res, itineraries);
    },
  );

  //==============================
  // GET ITINERARY BY ID
  //==============================
  getById = asyncHandler(async (req: ReqParams<UuidParam>, res: Response) => {
    const itinerary = await this.service.getById(req.params.id);
    return ResponseUtil.success(res, itinerary);
  });

  //=====================
  // UPDATE ITINERARY
  //=====================
  update = asyncHandler(
    async (
      req: ReqParamsBody<UuidParam, UpdateItineraryDto>,
      res: Response,
    ) => {
      const dto: UpdateItineraryDto = {
        ...req.body,
        dayNumber: req.body.dayNumber ? Number(req.body.dayNumber) : undefined,
      };

      const result = await this.service.updateWithImage(
        req.params.id,
        dto,
        req.file,
      );
      return ResponseUtil.success(res, result, 'Itinerary updated');
    },
  );

  //==============================
  // DELETE ITINERARY
  //==============================
  delete = asyncHandler(async (req: ReqParams<UuidParam>, res: Response) => {
    await this.service.deleteWithImage(req.params.id);
    return ResponseUtil.success(res, null, 'Itinerary deleted');
  });
}
