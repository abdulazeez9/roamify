import { Adventure, Prisma } from '@zagotours/database';
import { BaseService } from 'src/common/service/base.service';
import { AdventureRepository } from './adventure.repository';

export class AdventureService extends BaseService<
  Adventure,
  Prisma.AdventureWhereInput,
  Prisma.AdventureCreateInput,
  Prisma.AdventureUpdateInput,
  Prisma.AdventureInclude
> {
  protected readonly resourceName = 'adventure';

  constructor(private readonly adventureRepo: AdventureRepository) {
    super(adventureRepo);
  }

  async createBulk(adventures: Prisma.AdventureCreateManyInput[]) {
    const result = await this.adventureRepo.createMany(adventures);
    return {
      count: result.count,
      message: `Created ${result.count} adventures`,
    };
  }

  async toggleLike(userId: string, adventureId: string) {
    await this.getById(adventureId);
    const existing = await this.adventureRepo.findLike(userId, adventureId);

    if (existing) {
      await this.adventureRepo.deleteLike(existing.id);
      return { liked: false, message: 'Unliked' };
    }
    await this.adventureRepo.createLike(userId, adventureId);
    return { liked: true, message: 'Liked' };
  }

  async getLikedIds(userId: string, adventureIds: string[]): Promise<string[]> {
    return this.adventureRepo.findLikedIds(userId, adventureIds);
  }

  async checkIfLiked(userId: string, adventureId: string): Promise<boolean> {
    return !!(await this.adventureRepo.findLike(userId, adventureId));
  }

  async getTripTypeCounts() {
    return this.adventureRepo.getTripTypeCounts();
  }
}
