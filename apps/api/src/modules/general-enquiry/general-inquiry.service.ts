import { GeneralInquiry, Prisma } from '@zagotours/database';
import { BaseService } from 'src/common/service/base.service';
import { GeneralInquiryRepository } from './general-inquiry.repository';
import { GeneralInquiryListQueryDto, PaginationResult } from '@zagotours/types';
import { EmailService } from 'src/shared/services/email.service';

export class GeneralInquiryService extends BaseService<
  GeneralInquiry,
  Prisma.GeneralInquiryWhereInput,
  Prisma.GeneralInquiryCreateInput,
  Prisma.GeneralInquiryUpdateInput
> {
  protected readonly resourceName = 'GeneralInquiry';

  constructor(private readonly inquiryRepo: GeneralInquiryRepository) {
    super(inquiryRepo);
  }

  override async create(
    data: Prisma.GeneralInquiryCreateInput,
  ): Promise<GeneralInquiry> {
    const inquiry = await super.create(data);

    try {
      await EmailService.sendAdminInquiryNotification({
        email: data.email,
        message: data.message,
        phone: data.phone as string,
        address: data.address as string,
        createdAt: inquiry.createdAt,
      });
    } catch (error) {
      console.error('Failed to send admin notification email:', error);
      // Don't throw - inquiry was already saved successfully
    }

    return inquiry;
  }

  // 1. Updated the Promise return type to include the nested 'pagination' object
  async getAllInquiries(
    query: GeneralInquiryListQueryDto,
  ): Promise<PaginationResult<GeneralInquiry>> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const where: Prisma.GeneralInquiryWhereInput = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const result: any = await this.paginate(page, limit, {
      where,
      orderBy: { [sortBy]: sortOrder },
    });

    // Extract values with fallbacks
    const data = result.items ?? result.data ?? [];
    const total = (result.meta && result.meta.total) ?? result.total ?? 0;
    const currentPage =
      (result.meta && result.meta.page) ?? result.page ?? page;
    const currentLimit =
      (result.meta && result.meta.limit) ?? result.limit ?? limit;

    // 2. Return the nested structure required by ResponseUtil.paginated
    return {
      data,
      pagination: {
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages: Math.ceil(total / currentLimit),
        hasNext: false,
        hasPrev: false,
      },
    };
  }
  // Get recent inquiries
  async getRecent(): Promise<GeneralInquiry[]> {
    return this.inquiryRepo.findRecent();
  }

  // Get inquiry by ID
  async getById(id: string): Promise<GeneralInquiry> {
    return super.getById(id);
  }

  // Delete inquiry by ID
  async deleteInquiry(id: string): Promise<void> {
    await super.delete(id, true);
  }

  // Search inquiries
  async searchInquiries(searchTerm: string): Promise<GeneralInquiry[]> {
    return this.inquiryRepo.search(searchTerm);
  }
}
