import { Response } from 'express';
import { PlatformSettingsService } from './platform-settings.service';
import { ResponseUtil } from 'src/shared/utils/responseUtils';
import { asyncHandler } from 'src/shared/middleware/async-handler.middleware';
import { ReqBody, TypedRequest } from 'src/shared/types/express.types';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';

export class PlatformSettingsController {
  constructor(private readonly service: PlatformSettingsService) {}

  create = asyncHandler(async (req: ReqBody<any>, res: Response) => {
    const data = { ...req.body };

    if (req.file) {
      const upload = await CloudinaryService.uploadFile(
        req.file,
        'platform-setting',
      );
      data.coverImage = upload.url;
      data.publicId = upload.publicId;
    }

    const result = await this.service.create(data);
    return ResponseUtil.success(res, result, 'Platform settings created', 201);
  });

  get = asyncHandler(async (req: TypedRequest<{}, {}, {}>, res: Response) => {
    const result = await this.service.get();
    return ResponseUtil.success(res, result);
  });

  update = asyncHandler(async (req: ReqBody<any>, res: Response) => {
    const data = { ...req.body };

    if (req.file) {
      const existing = await this.service.get();
      if (existing?.publicId) {
        await CloudinaryService.deleteFile(existing.publicId);
      }
      const upload = await CloudinaryService.uploadFile(
        req.file,
        'platform-setting',
      );
      data.coverImage = upload.url;
      data.publicId = upload.publicId;
    }

    const result = await this.service.update(data);
    return ResponseUtil.success(res, result, 'Platform settings updated');
  });
}
