import { TripPlanningCall, Prisma, CallStatus } from '@zagotours/database';
import { BaseRepository } from 'src/common/repository/base.repository';
import { prisma } from '@zagotours/database';

export class TripPlanningCallRepository extends BaseRepository<
  TripPlanningCall,
  Prisma.TripPlanningCallWhereInput,
  Prisma.TripPlanningCallCreateInput,
  Prisma.TripPlanningCallUpdateInput,
  Prisma.TripPlanningCallInclude
> {
  protected readonly modelDelegate = prisma.tripPlanningCall;

  private readonly standardInclude: Prisma.TripPlanningCallInclude = {
    adventurer: {
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    },
  };

  // Get calls by adventurer
  async findByAdventurer(adventurerId: string): Promise<TripPlanningCall[]> {
    return this.findAll({
      where: { adventurerId },
      include: this.standardInclude,
      orderBy: { startTime: 'desc' },
    });
  }

  async findUpcoming(userId: string): Promise<TripPlanningCall[]> {
    return this.findAll({
      where: {
        adventurerId: userId,
        startTime: { gte: new Date() },
        status: CallStatus.SCHEDULED,
      },
      include: this.standardInclude,
      orderBy: { startTime: 'asc' },
    });
  }

  // Get calls by status
  async findByStatus(status: CallStatus): Promise<TripPlanningCall[]> {
    return this.findAll({
      where: { status },
      include: this.standardInclude,
      orderBy: { startTime: 'desc' },
    });
  }

  // Get calls by date range
  async findByDateRange(
    startDate: Date,
    endDate: Date,
    userId?: string,
  ): Promise<TripPlanningCall[]> {
    const where: Prisma.TripPlanningCallWhereInput = {
      startTime: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (userId) {
      where.OR = [{ adventurerId: userId }, { agentId: userId }];
    }

    return this.findAll({
      where,
      include: this.standardInclude,
      orderBy: { startTime: 'asc' },
    });
  }

  // Check for scheduling conflicts
  async hasConflict(
    startTime: Date,
    endTime: Date,
    excludeCallId?: string,
  ): Promise<boolean> {
    const where: Prisma.TripPlanningCallWhereInput = {
      status: CallStatus.SCHEDULED,
      OR: [
        {
          startTime: {
            gte: startTime,
            lt: endTime,
          },
        },
        {
          endTime: {
            gt: startTime,
            lte: endTime,
          },
        },
        {
          AND: [
            { startTime: { lte: startTime } },
            { endTime: { gte: endTime } },
          ],
        },
      ],
    };

    if (excludeCallId) {
      where.NOT = { id: excludeCallId };
    }

    const conflicts = await this.modelDelegate.findFirst({ where });
    return !!conflicts;
  }

  // Paginate with details
  async paginateWithDetails(
    page: number,
    limit: number,
    filters?: Prisma.TripPlanningCallWhereInput,
  ) {
    return this.paginate({
      page,
      limit,
      where: filters,
      include: this.standardInclude,
      orderBy: { startTime: 'desc' },
    });
  }
}
