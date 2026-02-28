import {
  TripPlanningCall,
  Prisma,
  CallStatus,
  prisma,
} from '@zagotours/database';
import { BaseService } from 'src/common/service/base.service';
import { TripPlanningCallRepository } from './trip-planning-call.repository';
import { CalendarService } from 'src/shared/utils/calendar.service';
import { EmailService } from 'src/shared/services/email.service';
import { ScheduleCallDto } from '@zagotours/types';

export class TripPlanningCallService extends BaseService<
  TripPlanningCall,
  Prisma.TripPlanningCallWhereInput,
  Prisma.TripPlanningCallCreateInput,
  Prisma.TripPlanningCallUpdateInput,
  Prisma.TripPlanningCallInclude
> {
  protected readonly resourceName = 'TripPlanningCall';
  private calendarService: CalendarService;
  private readonly DEFAULT_MEETING_LINK =
    process.env.DEFAULT_MEETING_LINK || 'https://meet.google.com/kby-bhgn-hdt';

  constructor(private readonly callRepo: TripPlanningCallRepository) {
    super(callRepo);
    this.calendarService = new CalendarService();
  }

  async scheduleCall(
    adventurerId: string,
    data: ScheduleCallDto,
  ): Promise<TripPlanningCall> {
    const { startTime, endTime, meetingLink } = data;

    if (new Date(startTime) <= new Date()) {
      throw new Error('Start time must be in the future');
    }

    const adventurer = await prisma.user.findUnique({
      where: { id: adventurerId },
      select: {
        name: true,
        email: true,
        phone: true,
      },
    });

    if (!adventurer) {
      throw new Error('Adventurer not found');
    }

    const callEndTime =
      endTime || new Date(new Date(startTime).getTime() + 30 * 60 * 1000);

    let calendarEventId: string | undefined;
    let finalMeetingLink: string;

    if (meetingLink) {
      finalMeetingLink = meetingLink;
    } else {
      try {
        const calendarEvent = await this.calendarService.createEvent({
          summary: `Trip Planning Call - ${adventurer.name}`,
          description: `Trip planning consultation call with ${adventurer.name}`,
          startTime: new Date(startTime),
          endTime: new Date(callEndTime),
          attendees: [adventurer.email],
        });

        calendarEventId = calendarEvent.id || undefined;
        finalMeetingLink =
          calendarEvent.meetingLink || this.DEFAULT_MEETING_LINK;
      } catch (error) {
        finalMeetingLink = this.DEFAULT_MEETING_LINK;
      }
    }

    const call = await this.create({
      adventurer: { connect: { id: adventurerId } },
      startTime: new Date(startTime),
      endTime: new Date(callEndTime),
      meetingLink: finalMeetingLink,
      calendarEventId: calendarEventId,
      status: CallStatus.SCHEDULED,
    });

    try {
      await EmailService.sendAdminNewCallRequest({
        adventurerName: adventurer.name,
        adventurerEmail: adventurer.email,
        adventurerPhone: adventurer.phone || undefined,
        startTime: new Date(startTime),
        endTime: new Date(callEndTime),
        callId: call.id,
        createdAt: call.createdAt,
        meetingLink: call.meetingLink as string,
      });
    } catch (error) {
      console.error('Failed to send admin notification:', error);
    }

    return call;
  }

  async rescheduleCall(
    callId: string,
    newStartTime: Date,
    newEndTime?: Date,
  ): Promise<TripPlanningCall> {
    const call = await this.getById(callId);

    if (call.status !== CallStatus.SCHEDULED) {
      throw new Error('Only scheduled calls can be rescheduled');
    }

    if (new Date(newStartTime) <= new Date()) {
      throw new Error('New start time must be in the future');
    }

    const callEndTime =
      newEndTime || new Date(new Date(newStartTime).getTime() + 30 * 60 * 1000);

    // Removed agentId from conflict check since calls are handled centrally
    const hasConflict = await this.callRepo.hasConflict(
      new Date(newStartTime),
      new Date(callEndTime),
      callId,
    );

    if (hasConflict) {
      throw new Error('A call is already scheduled at this time');
    }

    if (call.calendarEventId) {
      try {
        await this.calendarService.updateEvent(call.calendarEventId, {
          startTime: new Date(newStartTime),
          endTime: new Date(callEndTime),
        });
      } catch (error) {
        console.error('Failed to update calendar event:', error);
      }
    }

    const updated = await this.update(callId, {
      startTime: new Date(newStartTime),
      endTime: new Date(callEndTime),
    });

    const adventurer = await prisma.user.findUnique({
      where: { id: updated.adventurerId },
      select: { name: true, email: true },
    });

    if (adventurer) {
      try {
        await EmailService.sendCallRescheduledNotification(
          adventurer.email,
          adventurer.name,
          {
            agentName: 'Zago Tours Admin',
            oldStartTime: call.startTime,
            newStartTime: new Date(newStartTime),
            meetingLink: updated.meetingLink as string,
          },
        );
      } catch (error) {
        console.error('Failed to send reschedule email:', error);
      }
    }

    return updated;
  }

  async cancelCall(callId: string, reason?: string): Promise<TripPlanningCall> {
    const call = await this.getById(callId);

    if (call.status === CallStatus.COMPLETED) {
      throw new Error('Cannot cancel a completed call');
    }

    if (call.calendarEventId) {
      try {
        await this.calendarService.deleteEvent(call.calendarEventId);
      } catch (error) {
        console.error('Failed to delete calendar event:', error);
      }
    }

    const updated = await this.update(callId, {
      status: CallStatus.CANCELLED,
    });

    const adventurer = await prisma.user.findUnique({
      where: { id: call.adventurerId },
      select: { name: true, email: true },
    });

    if (adventurer) {
      try {
        await EmailService.sendCallCancelledNotification(
          adventurer.email,
          adventurer.name,
          {
            agentName: 'Zago Tours Admin',
            startTime: call.startTime,
            reason: reason || 'No reason provided',
          },
        );
      } catch (error) {
        console.error('Failed to send cancellation email:', error);
      }
    }

    return updated;
  }

  async markAsCompleted(callId: string): Promise<TripPlanningCall> {
    const call = await this.getById(callId);

    if (call.status !== CallStatus.SCHEDULED) {
      throw new Error('Only scheduled calls can be marked as completed');
    }

    return this.update(callId, {
      status: CallStatus.COMPLETED,
    });
  }

  async expirePastCalls(): Promise<number> {
    const now = new Date();
    const pastCalls = await this.callRepo.findByStatus(CallStatus.SCHEDULED);

    let expiredCount = 0;
    for (const call of pastCalls) {
      if (call.startTime < now) {
        await this.update(call.id, { status: CallStatus.EXPIRED });
        expiredCount++;
      }
    }
    return expiredCount;
  }

  // --- Cleaned up Getters (Removed Agent logic) ---

  async getUpcoming(userId: string): Promise<TripPlanningCall[]> {
    return this.callRepo.findUpcoming(userId);
  }

  async getByAdventurer(adventurerId: string): Promise<TripPlanningCall[]> {
    return this.callRepo.findByAdventurer(adventurerId);
  }

  async getByDateRange(
    startDate: Date,
    endDate: Date,
    userId?: string,
  ): Promise<TripPlanningCall[]> {
    return this.callRepo.findByDateRange(startDate, endDate, userId);
  }

  async paginate(
    page: number,
    limit: number,
    filters?: {
      where?: Prisma.TripPlanningCallWhereInput;
      include?: Prisma.TripPlanningCallInclude;
      orderBy?: any;
    },
  ) {
    return this.callRepo.paginateWithDetails(page, limit, filters?.where);
  }
}
