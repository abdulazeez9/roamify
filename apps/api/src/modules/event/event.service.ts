import { Event, prisma, Prisma } from '@zagotours/database';
import { BaseService } from 'src/common/service/base.service';
import { EventRepository } from './event.repository';
import { EventStatus } from '@zagotours/types';
import { EmailService } from 'src/shared/services/email.service';

export class EventService extends BaseService<
  Event,
  Prisma.EventWhereInput,
  Prisma.EventCreateInput,
  Prisma.EventUpdateInput
> {
  protected readonly resourceName = 'Event';

  constructor(private readonly eventRepo: EventRepository) {
    super(eventRepo);
  }

  async getUpcoming(): Promise<Event[]> {
    return this.eventRepo.findUpcoming();
  }

  async getByLocation(location: string): Promise<Event[]> {
    return this.eventRepo.findByLocation(location);
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    return this.eventRepo.findByDateRange(startDate, endDate);
  }

  async getAvailableEvents(): Promise<Event[]> {
    return this.eventRepo.findWithAvailableSpots();
  }

  async getByIdWithDetails(id: string) {
    return this.eventRepo.findByIdWithDetails(id);
  }

  // Registration logic
  // event.service.ts

  async registerForEvent(eventId: string, userId: string) {
    // 1. Run the database logic inside a transaction
    const registration = await prisma.$transaction(async (tx) => {
      // Get event and check if it exists
      const event = await tx.event.findUnique({
        where: { id: eventId, deletedAt: null },
      });

      if (!event) throw new Error('Event not found');

      // Check for existing registration
      const existing = await tx.eventRegistration.findUnique({
        where: { userId_eventId: { userId, eventId } },
      });

      if (existing && existing.status !== EventStatus.CANCELLED) {
        throw new Error('Already registered for this event');
      }

      // Check spot availability
      if (event.spotLeft <= 0) throw new Error('Event is fully booked');

      // Decrement available spots
      await tx.event.update({
        where: { id: eventId },
        data: { spotLeft: { decrement: 1 } },
      });

      // Upsert registration and INCLUDE User/Event data for the email
      return await tx.eventRegistration.upsert({
        where: { userId_eventId: { userId, eventId } },
        update: { status: EventStatus.CONFIRMED },
        create: {
          eventId,
          userId,
          status: EventStatus.CONFIRMED,
        },
        include: {
          event: {
            select: {
              title: true,
              date: true,
              location: true,
            },
          },
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });
    });

    if (registration.user?.email) {
      EmailService.sendEventRegistrationEmail(
        registration.user.email,
        registration.user.name,
        {
          title: registration.event.title,
          date: registration.event.date,
          location: registration.event.location,
        },
      ).catch((err) => {
        console.error('Event Registration Email failed to send:', err);
      });
    }

    return registration;
  }
  async cancelRegistration(eventId: string, userId: string) {
    const result = await prisma.$transaction(async (tx) => {
      const registration = await tx.eventRegistration.findUnique({
        where: { userId_eventId: { userId, eventId } },
        include: {
          user: { select: { email: true, name: true } },
          event: { select: { title: true } },
        },
      });

      if (!registration || registration.status === EventStatus.CANCELLED) {
        throw new Error('Registration not found or already cancelled');
      }

      await tx.eventRegistration.update({
        where: { id: registration.id },
        data: { status: EventStatus.CANCELLED },
      });

      await tx.event.update({
        where: { id: eventId },
        data: { spotLeft: { increment: 1 } },
      });

      return registration;
    });

    EmailService.sendEventCancellationEmail(
      result.user.email,
      result.user.name,
      result.event.title,
    ).catch((err) => console.error('Email failed', err));

    return { message: 'Registration cancelled successfully' };
  }

  async getUserRegistrations(
    userId: string,
    filters?: { status?: string; upcomingOnly?: boolean },
  ) {
    return this.eventRepo.findUserRegistrations(userId, filters);
  }

  async getEventStats() {
    return this.eventRepo.getStats();
  }

  async checkUserRegistration(userId: string, eventId: string) {
    return this.eventRepo.findRegistration(userId, eventId);
  }
}
