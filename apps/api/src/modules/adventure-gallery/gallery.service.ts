import { AdventureGallery, Prisma } from '@zagotours/database';
import { BaseService } from 'src/common/service/base.service';
import { AdventureGalleryRepository } from './gallery.repository';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';
import { ReorderGalleryDto, MediaType } from '@zagotours/types';

export class AdventureGalleryService extends BaseService<
  AdventureGallery,
  Prisma.AdventureGalleryWhereInput,
  Prisma.AdventureGalleryCreateInput,
  Prisma.AdventureGalleryUpdateInput,
  Prisma.AdventureGalleryInclude
> {
  protected readonly resourceName = 'gallery item';

  constructor(private readonly galleryRepo: AdventureGalleryRepository) {
    super(galleryRepo);
  }

  //==============================
  // BULK UPLOAD
  //==============================
  async bulkUpload(
    adventureId: string,
    media: Array<{
      mediaUrl: string;
      publicId: string;
      mediaType?: MediaType;
      altText?: string;
    }>,
  ) {
    const items = await Promise.all(
      media.map(async (item, index) => {
        const order = await this.galleryRepo.getNextOrder(adventureId);
        return {
          ...item,
          mediaType: item.mediaType || MediaType.IMAGE,
          adventureId,
          order: order + index,
        };
      }),
    );

    const result = await this.galleryRepo.createMany(items);
    return {
      count: result.count,
      message: `Uploaded ${result.count} media items`,
    };
  }

  //==============================
  // REORDER GALLERY
  //==============================
  async reorder(dto: ReorderGalleryDto) {
    await Promise.all(
      dto.items.map((item) =>
        this.galleryRepo.updateOrder(item.id, item.order),
      ),
    );
    return { message: 'Gallery reordered successfully' };
  }

  //==============================
  // GET BY ADVENTURE
  //==============================
  async getByAdventure(adventureId: string): Promise<AdventureGallery[]> {
    return this.galleryRepo.findByAdventure(adventureId);
  }

  //==============================
  // DELETE WITH CLOUDINARY CLEANUP
  //==============================
  async deleteWithMedia(id: string): Promise<void> {
    const item = await this.getById(id);

    // Delete from Cloudinary
    if (item.publicId) {
      await CloudinaryService.deleteFile(item.publicId);
    }

    await this.galleryRepo.softDelete(id);
  }
}
