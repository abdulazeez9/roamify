import NodeCache from 'node-cache';
import { Response } from 'express';
import { AdventureService } from './adventure.service';
import { ResponseUtil } from 'src/shared/utils/responseUtils';
import {
  AdventureListQueryDto,
  CreateAdventureDto,
  UpdateAdventureDto,
} from '@zagotours/types';
import { asyncHandler } from 'src/shared/middleware/async-handler.middleware';
import {
  ReqBody,
  ReqParams,
  ReqParamsBody,
  ReqParamsQuery,
  ReqQuery,
  TypedRequest,
} from 'src/shared/types/express.types';
import { UuidParam } from 'src/common/validation/common.validation';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';

const cache = new NodeCache({ stdTTL: 60 });
export class AdventureController {
  constructor(private readonly service: AdventureService) {}

  //==== CREATE NEW ADVENTURE ======
  create = asyncHandler(
    async (req: ReqBody<CreateAdventureDto>, res: Response) => {
      const adventureData = req.body;

      if (adventureData.price)
        adventureData.price = Number(adventureData.price);
      if (adventureData.days) adventureData.days = Number(adventureData.days);
      if (adventureData.safetyScore)
        adventureData.safetyScore = Number(adventureData.safetyScore);
      if (adventureData.rating)
        adventureData.rating = Number(adventureData.rating);
      if (adventureData.date) adventureData.date = new Date(adventureData.date);

      if (req.file) {
        const uploadResult = await CloudinaryService.uploadFile(
          req.file,
          'adventure',
        );
        adventureData.mediaUrl = uploadResult.url;
        adventureData.publicId = uploadResult.publicId;
      }

      const result = await this.service.create(adventureData);
      return ResponseUtil.success(res, result, 'Created', 201);
    },
  );

  //==== CREATE MULTIPLE ADVENTURES ======
  createBulk = asyncHandler(
    async (req: ReqBody<CreateAdventureDto[]>, res: Response) => {
      const adventures = req.body;

      if (!Array.isArray(adventures) || adventures.length === 0) {
        return ResponseUtil.error(
          res,
          'A non-empty array of adventures is required',
          400,
        );
      }

      const result = await this.service.createBulk(adventures);
      return ResponseUtil.success(res, result, result.message, 201);
    },
  );

  //==== UPDATE AN ADVENTURE ======
  update = asyncHandler(
    async (
      req: ReqParamsBody<UuidParam, UpdateAdventureDto>,
      res: Response,
    ) => {
      const { id } = req.params;
      const adventureData: UpdateAdventureDto = { ...req.body };

      if (adventureData.price)
        adventureData.price = Number(adventureData.price);
      if (adventureData.days) adventureData.days = Number(adventureData.days);
      if (adventureData.safetyScore)
        adventureData.safetyScore = Number(adventureData.safetyScore);
      if (adventureData.rating)
        adventureData.rating = Number(adventureData.rating);

      if (adventureData.date) {
        adventureData.date = new Date(adventureData.date);
      }
      if (adventureData.lastSafetyCertDate) {
        adventureData.lastSafetyCertDate = new Date(
          adventureData.lastSafetyCertDate,
        );
      }

      const existingAdventure = await this.service.getById(id);

      if (req.file) {
        if (existingAdventure?.publicId) {
          await CloudinaryService.deleteFile(existingAdventure.publicId);
        }

        const uploadResult = await CloudinaryService.uploadFile(
          req.file,
          'adventure',
        );
        adventureData.mediaUrl = uploadResult.url;
        adventureData.publicId = uploadResult.publicId;
      }

      const result = await this.service.update(id, adventureData);
      return ResponseUtil.success(res, result, 'Adventure updated');
    },
  );

  //==== GET ALL ADVENTURES ======
  getAll = asyncHandler(
    async (req: ReqQuery<AdventureListQueryDto>, res: Response) => {
      const {
        page = '1',
        limit = '10',
        status,
        level,
        access,
        location,
        search,
        tripType,
        maxPrice,
        minPrice,
      } = req.query;

      const hasFilters = !!(
        status ||
        level ||
        access ||
        location ||
        search ||
        tripType ||
        maxPrice ||
        minPrice
      );
      const isAuthed = !!req.userId;
      const isDefaultPage = page === '1' && limit === '10';

      // Serve from cache for default unauthenticated list only
      if (!hasFilters && !isAuthed && isDefaultPage) {
        const cached = cache.get<any>('adventures:list:default');
        if (cached) return ResponseUtil.paginated(res, cached);
      }

      const where: any = { deletedAt: null };

      if (status) where.status = status.toUpperCase();
      if (level) where.level = level.toUpperCase();
      if (access) where.access = access.toUpperCase();
      if (tripType) where.tripType = tripType.toUpperCase();

      if (location) {
        where.location = { contains: location, mode: 'insensitive' };
      }

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
          { certification: { contains: search, mode: 'insensitive' } },
          { gear: { contains: search, mode: 'insensitive' } },
        ];
      }

      const result = await this.service.paginate(Number(page), Number(limit), {
        where,
        orderBy: { createdAt: 'desc' },
      });

      if (req.userId) {
        const likedIds = await this.service.getLikedIds(
          req.userId,
          result.data.map((a) => a.id),
        );
        const likedSet = new Set(likedIds);
        result.data = result.data.map((adventure) => ({
          ...adventure,
          isLiked: likedSet.has(adventure.id),
        }));
      }

      // Store in cache only for default unauthenticated list
      if (!hasFilters && !isAuthed && isDefaultPage) {
        cache.set('adventures:list:default', result);
      }

      return ResponseUtil.paginated(res, result);
    },
  );
  //==== GET ADVENTURE BY ID ======
  getById = asyncHandler(async (req: ReqParams<UuidParam>, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;

    const result = await this.service.getById(id);

    if (userId && result) {
      const isLiked = await this.service.checkIfLiked(userId, id);
      return ResponseUtil.success(res, { ...result, isLiked });
    }

    return ResponseUtil.success(res, result);
  });
  //==== DELETE AN ADVENTURE ======
  delete = asyncHandler(
    async (req: ReqParamsQuery<UuidParam, { hard: string }>, res: Response) => {
      const isHard = req.query.hard === 'true';
      const { id } = req.params;

      const adventure = await this.service.getById(id);

      if (isHard && adventure?.publicId) {
        await CloudinaryService.deleteFile(adventure.publicId);
      }

      await this.service.delete(id, isHard);
      return ResponseUtil.success(res, null, 'Deleted');
    },
  );

  //==== TOGGLING ADVENTURE LIKE ======
  toggleLike = asyncHandler(
    async (req: ReqParams<UuidParam>, res: Response) => {
      const result = await this.service.toggleLike(req.userId!, req.params.id);
      return ResponseUtil.success(res, result);
    },
  );

  getTripTypeCounts = asyncHandler(
    async (req: TypedRequest<{}, {}, {}>, res: Response) => {
      const result = await this.service.getTripTypeCounts();
      return ResponseUtil.success(res, result);
    },
  );
}
