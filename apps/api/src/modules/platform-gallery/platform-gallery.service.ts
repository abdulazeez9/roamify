import { BaseService } from 'src/common/service/base.service';
import { PlatformGalleryRepository } from './platform-gallery.repository';
import { PlatformGalleryDto } from '@zagotours/types';
import { PlatformGallery, Prisma } from '@zagotours/database';

export class PlatformGalleryService extends BaseService<
  PlatformGallery,
  Prisma.PlatformGalleryWhereInput,
  Prisma.PlatformGalleryCreateInput,
  Prisma.PlatformGalleryUpdateInput
> {
  protected readonly resourceName = 'PlatformGallery';

  constructor(
    protected readonly platformGalleryRepo: PlatformGalleryRepository,
  ) {
    super(platformGalleryRepo);
  }

  async getFeaturedMedia(): Promise<PlatformGalleryDto[]> {
    const items = await this.platformGalleryRepo.findFeatured();
    // Use type assertion to bridge the enum gap
    return items as unknown as PlatformGalleryDto[];
  }

  async getGalleryByCategory(category: string): Promise<PlatformGalleryDto[]> {
    const items = await this.platformGalleryRepo.findByCategory(category);
    return items as unknown as PlatformGalleryDto[];
  }

  async updateOrder(id: string, newOrder: number): Promise<PlatformGalleryDto> {
    const item = await this.update(id, { order: newOrder } as any);
    return item as unknown as PlatformGalleryDto;
  }
}
