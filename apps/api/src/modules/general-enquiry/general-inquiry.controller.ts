import { Response } from 'express';
import { GeneralInquiryService } from './general-inquiry.service';
import { ResponseUtil } from 'src/shared/utils/responseUtils';
import { asyncHandler } from 'src/shared/middleware/async-handler.middleware';
import {
  ReqBody,
  ReqParams,
  ReqQuery,
  TypedRequest,
} from 'src/shared/types/express.types';
import { UuidParam } from 'src/common/validation/common.validation';
import {
  CreateGeneralInquiryDto,
  GeneralInquiryListQueryDto,
} from '@zagotours/types';
export class GeneralInquiryController {
  constructor(private readonly inquiryService: GeneralInquiryService) {}

  // POST / - Create a new inquiry
  create = asyncHandler(
    async (req: ReqBody<CreateGeneralInquiryDto>, res: Response) => {
      const { email, message, phone, address } = req.body;

      if (!email || !message) {
        return ResponseUtil.error(res, 'Email and message are required', 400);
      }

      const inquiry = await this.inquiryService.create({
        email,
        message,
        phone,
        address,
      });

      return ResponseUtil.success(
        res,
        inquiry,
        'Inquiry submitted successfully',
        201,
      );
    },
  );

  // GET / - Get all inquiries with pagination and filters
  getAll = asyncHandler(
    async (req: ReqQuery<GeneralInquiryListQueryDto>, res: Response) => {
      const result = await this.inquiryService.getAllInquiries(req.query);
      return ResponseUtil.paginated(res, result);
    },
  );

  // GET /recent - Get recent inquiries
  getRecent = asyncHandler(async (req: TypedRequest, res: Response) => {
    const inquiries = await this.inquiryService.getRecent();
    return ResponseUtil.success(res, inquiries);
  });

  // GET /:id - Get inquiry by ID
  getById = asyncHandler(async (req: ReqParams<UuidParam>, res: Response) => {
    const inquiry = await this.inquiryService.getById(req.params.id);
    return ResponseUtil.success(res, inquiry);
  });

  // DELETE /:id - Delete inquiry
  delete = asyncHandler(async (req: ReqParams<UuidParam>, res: Response) => {
    await this.inquiryService.deleteInquiry(req.params.id);
    return ResponseUtil.success(res, null, 'Inquiry deleted successfully');
  });
}
