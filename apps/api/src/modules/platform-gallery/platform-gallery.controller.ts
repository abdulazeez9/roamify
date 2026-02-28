import { Response } from 'express';
import { ResponseUtil } from 'src/shared/utils/responseUtils';
import { asyncHandler } from 'src/shared/middleware/async-handler.middleware';
import {
  ReqBody,
  ReqParams,
  ReqParamsBody,
  ReqParamsQuery,
  ReqQuery,
} from 'src/shared/types/express.types';
import { UuidParam } from 'src/common/validation/common.validation';
import {
  CreateGalleryDto,
  UpdateGalleryDto,
  GalleryQueryDto,
} from '@zagotours/types';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';
import { Prisma } from '@zagotours/database';
import { PlatformGalleryService } from './platform-gallery.service';

export class PlatformGalleryController {
  constructor(private readonly galleryService: PlatformGalleryService) {}

  //==================
  // ADMIN - UPLOAD MEDIA
  //==================
  create = asyncHandler(
    async (req: ReqBody<CreateGalleryDto>, res: Response) => {
      const galleryData = req.body;

      if (req.file) {
        const uploadResult = await CloudinaryService.uploadFile(
          req.file,
          'platform-gallery',
        );
        galleryData.mediaUrl = uploadResult.url;
        galleryData.publicId = uploadResult.publicId;
      }

      // Ensure numeric values are cast correctly
      const createData = {
        ...galleryData,
        order: galleryData.order ? Number(galleryData.order) : 0,
        featured: String(galleryData.featured) === 'true',
      };

      const item = await this.galleryService.create(createData as any);
      return ResponseUtil.success(res, item, 'Media added to gallery', 201);
    },
  );

  //==================
  // ADMIN - UPDATE MEDIA
  //==================
  update = asyncHandler(
    async (req: ReqParamsBody<UuidParam, UpdateGalleryDto>, res: Response) => {
      const { id } = req.params;
      const galleryData = req.body;

      const existingItem = await this.galleryService.getById(id);

      if (req.file) {
        // Remove old file from Cloudinary if replacing
        if (existingItem.publicId) {
          await CloudinaryService.deleteFile(existingItem.publicId);
        }

        const uploadResult = await CloudinaryService.uploadFile(
          req.file,
          'platform-gallery',
        );
        galleryData.mediaUrl = uploadResult.url;
        galleryData.publicId = uploadResult.publicId;
      }

      // Casting logic
      if (galleryData.order !== undefined)
        galleryData.order = Number(galleryData.order);
      if (galleryData.featured !== undefined) {
        galleryData.featured = String(galleryData.featured) === 'true';
      }

      const updatedItem = await this.galleryService.update(id, galleryData);
      return ResponseUtil.success(res, updatedItem, 'Gallery item updated');
    },
  );

  //==================
  // PUBLIC - GET GALLERY
  //==================
  getGallery = asyncHandler(
    async (req: ReqQuery<GalleryQueryDto>, res: Response) => {
      const { page = 1, limit = 12, category, featured } = req.query;

      const filters: Prisma.PlatformGalleryWhereInput = { deletedAt: null };

      if (category) {
        filters.category = String(category);
      }

      if (featured !== undefined) {
        filters.featured = String(featured) === 'true';
      }

      const result = await this.galleryService.paginate(
        Number(page),
        Number(limit),
        {
          where: filters,
          orderBy: { order: 'asc' },
        },
      );

      return ResponseUtil.paginated(res, result);
    },
  );

  //==================
  // ADMIN - DELETE MEDIA
  //==================
  delete = asyncHandler(
    async (
      req: ReqParamsQuery<UuidParam, { hard?: string }>,
      res: Response,
    ) => {
      const { id } = req.params;
      const isHard = req.query.hard === 'true';

      const item = await this.galleryService.getById(id);

      if (isHard && item.publicId) {
        await CloudinaryService.deleteFile(item.publicId);
      }

      await this.galleryService.delete(id, isHard);
      return ResponseUtil.success(res, null, 'Media removed from gallery');
    },
  );
}
