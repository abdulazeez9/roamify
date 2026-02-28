import { Response } from 'express';
import { AdventureGalleryService } from './gallery.service';
import { ResponseUtil } from 'src/shared/utils/responseUtils';
import { asyncHandler } from 'src/shared/middleware/async-handler.middleware';
import {
  ReqBody,
  ReqParams,
  ReqParamsBody,
} from 'src/shared/types/express.types';
import { UuidParam } from 'src/common/validation/common.validation';
import {
  UpdateAdventureGalleryDto,
  BulkUploadGalleryDto,
  ReorderGalleryDto,
  MediaType,
} from '@zagotours/types';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';

export class AdventureGalleryController {
  constructor(private readonly service: AdventureGalleryService) {}

  //==============================
  // BULK UPLOAD GALLERY (ONLY ENDPOINT FOR UPLOAD)
  //==============================
  bulkUpload = asyncHandler(
    async (
      req: ReqParamsBody<{ adventureId: string }, BulkUploadGalleryDto>,
      res: Response,
    ) => {
      const { adventureId } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return ResponseUtil.error(
          res,
          'At least one media file is required',
          400,
        );
      }

      // Upload all files to Cloudinary
      const uploadPromises = files.map((file) =>
        CloudinaryService.uploadFile(file, 'adventure-gallery'),
      );
      const uploadResults = await Promise.all(uploadPromises);

      // Map upload results with metadata
      const media = uploadResults.map((upload, index) => ({
        mediaUrl: upload.url,
        publicId: upload.publicId,
        mediaType:
          (req.body.mediaTypes?.[index] as MediaType) || MediaType.IMAGE,
        altText: req.body.altTexts?.[index],
      }));

      const result = await this.service.bulkUpload(adventureId, media);
      return ResponseUtil.success(
        res,
        result,
        'Gallery updated successfully',
        201,
      );
    },
  );

  //==============================
  // GET GALLERY BY ADVENTURE
  //==============================
  getByAdventure = asyncHandler(
    async (req: ReqParams<{ adventureId: string }>, res: Response) => {
      const gallery = await this.service.getByAdventure(req.params.adventureId);
      return ResponseUtil.success(res, gallery);
    },
  );

  //==============================
  // GET SINGLE GALLERY ITEM BY ID
  //==============================
  getById = asyncHandler(async (req: ReqParams<UuidParam>, res: Response) => {
    const item = await this.service.getById(req.params.id);
    return ResponseUtil.success(res, item);
  });

  //==============================
  // UPDATE GALLERY ITEM METADATA
  //==============================
  update = asyncHandler(
    async (
      req: ReqParamsBody<UuidParam, UpdateAdventureGalleryDto>,
      res: Response,
    ) => {
      const result = await this.service.update(req.params.id, req.body);
      return ResponseUtil.success(res, result, 'Gallery item updated');
    },
  );

  //==============================
  // REORDER GALLERY ITEMS
  //==============================
  reorder = asyncHandler(
    async (req: ReqBody<ReorderGalleryDto>, res: Response) => {
      const result = await this.service.reorder(req.body);
      return ResponseUtil.success(res, result, result.message);
    },
  );

  //==============================
  // DELETE GALLERY ITEM
  //==============================
  delete = asyncHandler(async (req: ReqParams<UuidParam>, res: Response) => {
    await this.service.deleteWithMedia(req.params.id);
    return ResponseUtil.success(res, null, 'Gallery item deleted');
  });
}
