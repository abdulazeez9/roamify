import { CallbackRequest, Prisma } from '@zagotours/database';
import { BaseRepository } from 'src/common/repository/base.repository';
import { prisma } from '@zagotours/database';

export class CallbackRequestRepository extends BaseRepository<
  CallbackRequest,
  Prisma.CallbackRequestWhereInput,
  Prisma.CallbackRequestCreateInput,
  Prisma.CallbackRequestUpdateInput,
  Prisma.CallbackRequestInclude
> {
  protected readonly modelDelegate = prisma.callbackRequest;

  private readonly standardInclude: Prisma.CallbackRequestInclude = {
    adventurer: {
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    },
    assignedAgent: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    },
  };

  // Get requests assigned to an agent (their referrals)
  async findByAssignedAgent(agentId: string): Promise<CallbackRequest[]> {
    return this.findAll({
      where: { assignedAgentId: agentId },
      include: this.standardInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get requests by adventurer
  async findByAdventurer(adventurerId: string): Promise<CallbackRequest[]> {
    return this.findAll({
      where: { adventurerId },
      include: this.standardInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get requests by date range
  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<CallbackRequest[]> {
    return this.findAll({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: this.standardInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get pending requests (last 7 days, for admin dashboard)
  async findPending(): Promise<CallbackRequest[]> {
    return this.findAll({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      include: this.standardInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Paginate with details
  async paginateWithDetails(
    page: number,
    limit: number,
    filters?: Prisma.CallbackRequestWhereInput,
  ) {
    return this.paginate({
      page,
      limit,
      where: filters,
      include: this.standardInclude,
      orderBy: { createdAt: 'desc' },
    });
  }
}
