import { GeneralInquiry, Prisma } from '@zagotours/database';
import { BaseRepository } from 'src/common/repository/base.repository';
import { prisma } from '@zagotours/database';

export class GeneralInquiryRepository extends BaseRepository<
  GeneralInquiry,
  Prisma.GeneralInquiryWhereInput,
  Prisma.GeneralInquiryCreateInput,
  Prisma.GeneralInquiryUpdateInput
> {
  protected readonly modelDelegate = prisma.generalInquiry;

  // Get recent inquiries (last 7 days)
  async findRecent(): Promise<GeneralInquiry[]> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return this.findAll({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Search inquiries by email, message, phone, or address
  async search(searchTerm: string): Promise<GeneralInquiry[]> {
    return this.findAll({
      where: {
        OR: [
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { message: { contains: searchTerm, mode: 'insensitive' } },
          { phone: { contains: searchTerm, mode: 'insensitive' } },
          { address: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
