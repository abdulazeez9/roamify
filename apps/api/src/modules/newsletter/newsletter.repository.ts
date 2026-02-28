import { prisma } from '@zagotours/database';

export class NewsletterRepository {
  async subscribe(email: string) {
    return prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
  }

  async getAllSubscribers() {
    return prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async countSubscribers() {
    return prisma.newsletterSubscriber.count();
  }
}
