import { TripRequest, Prisma, TripType } from '@zagotours/database';
import { BaseRepository } from 'src/common/repository/base.repository';
import { prisma } from '@zagotours/database';

export class TripRequestRepository extends BaseRepository<
  TripRequest,
  Prisma.TripRequestWhereInput,
  Prisma.TripRequestCreateInput,
  Prisma.TripRequestUpdateInput,
  Prisma.TripRequestInclude
> {
  protected readonly modelDelegate = prisma.tripRequest;

  private readonly standardInclude: Prisma.TripRequestInclude = {
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
  async findByAssignedAgent(agentId: string): Promise<TripRequest[]> {
    return this.findAll({
      where: { assignedAgentId: agentId },
      include: this.standardInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get requests by adventurer
  async findByAdventurer(adventurerId: string): Promise<TripRequest[]> {
    return this.findAll({
      where: { adventurerId },
      include: this.standardInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get requests by trip type
  async findByTripType(tripType: TripType): Promise<TripRequest[]> {
    return this.findAll({
      where: { tripType },
      include: this.standardInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get requests by destination
  async findByDestination(destination: string): Promise<TripRequest[]> {
    return this.findAll({
      where: {
        destination: {
          contains: destination,
          mode: 'insensitive',
        },
      },
      include: this.standardInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get requests by date range
  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<TripRequest[]> {
    return this.findAll({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: this.standardInclude,
      orderBy: { date: 'asc' },
    });
  }

  // Get recent requests (last 7 days)
  async findRecent(): Promise<TripRequest[]> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return this.findAll({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
      include: this.standardInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Paginate with details
  async paginateWithDetails(
    page: number,
    limit: number,
    filters?: Prisma.TripRequestWhereInput,
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
