import { AdventureGallery, Prisma, prisma } from '@zagotours/database';
import { BaseRepository } from 'src/common/repository/base.repository';

export class AdventureGalleryRepository extends BaseRepository<
  AdventureGallery,
  Prisma.AdventureGalleryWhereInput,
  Prisma.AdventureGalleryCreateInput,
  Prisma.AdventureGalleryUpdateInput,
  Prisma.AdventureGalleryInclude
> {
  protected readonly modelDelegate = prisma.adventureGallery;

  async createMany(data: Prisma.AdventureGalleryCreateManyInput[]) {
    return this.modelDelegate.createMany({ data });
  }

  async findByAdventure(adventureId: string): Promise<AdventureGallery[]> {
    return this.modelDelegate.findMany({
      where: { adventureId, deletedAt: null },
      orderBy: { order: 'asc' },
    });
  }

  async updateOrder(id: string, order: number): Promise<AdventureGallery> {
    return this.modelDelegate.update({ where: { id }, data: { order } });
  }

  async getNextOrder(adventureId: string): Promise<number> {
    const lastItem = await this.modelDelegate.findFirst({
      where: { adventureId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    return (lastItem?.order ?? -1) + 1;
  }
}
