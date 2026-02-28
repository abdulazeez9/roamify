import { PlatformGallery, Prisma, prisma } from '@zagotours/database';
import { BaseRepository } from 'src/common/repository/base.repository';

export class PlatformGalleryRepository extends BaseRepository<
  PlatformGallery,
  Prisma.PlatformGalleryWhereInput,
  Prisma.PlatformGalleryCreateInput,
  Prisma.PlatformGalleryUpdateInput,
  any
> {
  protected readonly modelDelegate = prisma.platformGallery;

  async create(
    data: Prisma.PlatformGalleryCreateInput,
  ): Promise<PlatformGallery> {
    return this.modelDelegate.create({ data });
  }

  async update(
    id: string,
    data: Prisma.PlatformGalleryUpdateInput,
  ): Promise<PlatformGallery> {
    return this.modelDelegate.update({
      where: { id },
      data,
    });
  }

  async findById(id: string): Promise<PlatformGallery | null> {
    return super.findById(id);
  }

  async paginate(options: any) {
    return super.paginate({
      ...options,
      where: { deletedAt: null, ...options.where },
      orderBy: options.orderBy || [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findFeatured() {
    return this.modelDelegate.findMany({
      where: { featured: true, deletedAt: null },
      orderBy: { order: 'asc' },
    });
  }

  async findByCategory(category: string) {
    return this.modelDelegate.findMany({
      where: { category, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }
}
