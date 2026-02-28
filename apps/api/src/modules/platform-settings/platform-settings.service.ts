import { prisma } from '@zagotours/database';

export class PlatformSettingsService {
  async get() {
    return prisma.platformSettings.findFirst();
  }

  async create(data: any) {
    return prisma.platformSettings.create({ data });
  }

  async update(data: any) {
    const existing = await this.get();
    if (!existing) return this.create(data);

    return prisma.platformSettings.update({
      where: { id: existing.id },
      data,
    });
  }
}
