import { Adventure, Prisma, prisma } from '@zagotours/database';
import { BaseRepository } from 'src/common/repository/base.repository';

export class AdventureRepository extends BaseRepository<
  Adventure,
  Prisma.AdventureWhereInput,
  Prisma.AdventureCreateInput,
  Prisma.AdventureUpdateInput,
  Prisma.AdventureInclude
> {
  protected readonly modelDelegate = prisma.adventure;

  // For LIST (paginate) - only counts, no nested data
  private readonly listInclude: Prisma.AdventureInclude = {
    _count: {
      select: {
        likes: true,
        itineraries: true,
        gallery: true,
      },
    },
    gallery: {
      where: { deletedAt: null },
      orderBy: { order: 'asc' },
      take: 1,
    },
  };

  private readonly standardInclude: Prisma.AdventureInclude = {
    itineraries: { orderBy: { dayNumber: 'asc' } },
    gallery: { where: { deletedAt: null }, orderBy: { order: 'asc' } },
    likes: {
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    },
    _count: {
      select: {
        likes: true,
        itineraries: true,
        gallery: { where: { deletedAt: null } },
      },
    },
  };

  async create(
    data: Prisma.AdventureCreateInput,
    include?: Prisma.AdventureInclude,
  ): Promise<Adventure> {
    return this.modelDelegate.create({
      data,
      include: include || this.standardInclude,
    });
  }

  //==================
  //
  //==================
  async createMany(data: Prisma.AdventureCreateManyInput[]) {
    return this.modelDelegate.createMany({ data, skipDuplicates: true });
  }

  async update(
    id: string,
    data: Prisma.AdventureUpdateInput,
    include?: Prisma.AdventureInclude,
  ): Promise<Adventure> {
    return this.modelDelegate.update({
      where: { id },
      data,
      include: include || this.standardInclude,
    });
  }

  async findById(id: string, include?: Prisma.AdventureInclude) {
    return this.modelDelegate.findFirst({
      where: { id, deletedAt: null },
      include: include || this.standardInclude,
    });
  }

  async paginate(options: any) {
    return super.paginate({
      ...options,
      include: options.include || this.listInclude,
      where: { deletedAt: null, ...options.where },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findLike(userId: string, adventureId: string) {
    return prisma.adventureLike.findUnique({
      where: { userId_adventureId: { userId, adventureId } },
    });
  }

  async findLikedIds(
    userId: string,
    adventureIds: string[],
  ): Promise<string[]> {
    const likes = await prisma.adventureLike.findMany({
      where: {
        userId,
        adventureId: { in: adventureIds },
      },
      select: { adventureId: true },
    });
    return likes.map((l) => l.adventureId);
  }

  async createLike(userId: string, adventureId: string) {
    return prisma.adventureLike.create({ data: { userId, adventureId } });
  }

  async getAdventureWithLikers(id: string) {
    return this.modelDelegate.findUnique({
      where: { id },
      include: {
        likes: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
      },
    });
  }

  async deleteLike(id: string) {
    return prisma.adventureLike.delete({ where: { id } });
  }

  async getTripTypeCounts(): Promise<Record<string, number>> {
    const counts = await prisma.adventure.groupBy({
      by: ['tripType'],
      where: { deletedAt: null },
      _count: { tripType: true },
    });

    return counts.reduce(
      (acc, item) => {
        acc[item.tripType] = item._count.tripType;
        return acc;
      },
      {} as Record<string, number>,
    );
  }
}
