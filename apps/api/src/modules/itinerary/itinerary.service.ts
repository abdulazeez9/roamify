import { Itinerary, Prisma } from '@zagotours/database';
import { BaseService } from 'src/common/service/base.service';
import { ItineraryRepository } from './itinerary.repository';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';
import { UpdateItineraryDto, CreateItineraryDto } from '@zagotours/types';

export class ItineraryService extends BaseService<
  Itinerary,
  Prisma.ItineraryWhereInput,
  Prisma.ItineraryCreateInput,
  Prisma.ItineraryUpdateInput,
  Prisma.ItineraryInclude
> {
  protected readonly resourceName = 'itinerary';

  constructor(private readonly itineraryRepo: ItineraryRepository) {
    super(itineraryRepo);
  }

  // Add this to ItineraryService
  async createWithImage(
    adventureId: string,
    dto: CreateItineraryDto,
    file?: Express.Multer.File,
  ): Promise<Itinerary> {
    let imageUrl: string | undefined;
    let publicId: string | undefined;

    if (file) {
      const uploadResult = await CloudinaryService.uploadFile(
        file,
        'itinerary',
      );
      imageUrl = uploadResult.url;
      publicId = uploadResult.publicId;
    }

    return this.itineraryRepo.create({
      ...dto,
      adventure: {
        connect: { id: adventureId },
      },
      imageUrl,
      publicId,
    });
  }

  //==========================
  // CREATE BULK
  //==========================
  async createBulk(
    adventureId: string,
    itineraries: CreateItineraryDto[],
    files: Express.Multer.File[],
  ) {
    // 1. Upload all files to Cloudinary first
    const uploadResults = await CloudinaryService.uploadMultiple(
      files,
      'itinerary',
    );

    const itineraryData = itineraries.map((item, index) => ({
      ...item,
      adventureId,
      imageUrl: uploadResults[index]?.url || item.imageUrl,
      publicId: uploadResults[index]?.publicId || item.publicId,
    }));

    const result = await this.itineraryRepo.replaceAdventureItineraries(
      adventureId,
      itineraryData,
    );

    return {
      count: result.count,
      message: `Successfully created ${result.count} itinerary days.`,
    };
  }

  //==========================
  // GET BY ADVENTURE
  //==========================
  async getByAdventure(adventureId: string): Promise<Itinerary[]> {
    return this.itineraryRepo.findByAdventure(adventureId);
  }

  //==========================
  // UPDATE
  //==========================
  async updateWithImage(
    id: string,
    dto: UpdateItineraryDto,
    file?: Express.Multer.File,
  ): Promise<Itinerary> {
    const existing = await this.getById(id);
    const updateData: Prisma.ItineraryUpdateInput = { ...dto };

    // Handle image upload
    if (file) {
      // Delete old image if exists
      if (existing.publicId) {
        await CloudinaryService.deleteFile(existing.publicId);
      }

      const uploadResult = await CloudinaryService.uploadFile(
        file,
        'itinerary',
      );
      updateData.imageUrl = uploadResult.url;
      updateData.publicId = uploadResult.publicId;
    }

    return this.itineraryRepo.update(id, updateData);
  }

  //==========================
  // DELETE
  //==========================
  async deleteWithImage(id: string): Promise<void> {
    const itinerary = await this.getById(id);

    // Delete Cloudinary image if exists
    if (itinerary.publicId) {
      await CloudinaryService.deleteFile(itinerary.publicId);
    }

    await this.itineraryRepo.delete(id);
  }
}
