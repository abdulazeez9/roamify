import { Response } from 'express';
import { EventService } from './event.service';
import { ResponseUtil } from 'src/shared/utils/responseUtils';
import { Prisma } from '@zagotours/database';
import { asyncHandler } from 'src/shared/middleware/async-handler.middleware';
import {
  ReqBody,
  ReqParams,
  ReqParamsBody,
  ReqParamsQuery,
  ReqQuery,
  TypedRequest,
} from 'src/shared/types/express.types';
import { UuidParam } from 'src/common/validation/common.validation';
import {
  CreateEventDto,
  UpdateEventDto,
  EventListQueryDto,
  MyBookingsQueryDto,
} from '@zagotours/types';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';

export class EventController {
  constructor(private readonly eventService: EventService) {}

  //==================
  // ADMIN - CREATE EVENT
  //==================
  create = asyncHandler(async (req: ReqBody<CreateEventDto>, res: Response) => {
    const eventData = req.body;

    if (req.file) {
      const uploadResult = await CloudinaryService.uploadFile(
        req.file,
        'event',
      );
      eventData.mediaUrl = uploadResult.url;
      eventData.publicId = uploadResult.publicId;
    }

    const createData = {
      ...eventData,
      spotLeft: eventData.spotLeft ? Number(eventData.spotLeft) : 0,

      date: eventData.date ? new Date(eventData.date) : new Date(),
      joinTill: eventData.joinTill ? new Date(eventData.joinTill) : new Date(),

      isSignature: String(eventData.isSignature) === 'true',

      creator: {
        connect: { id: req.userId },
      },
    };

    if (
      isNaN(createData.date.getTime()) ||
      isNaN(createData.joinTill.getTime())
    ) {
      throw new Error('One or more provided dates are invalid.');
    }

    const event = await this.eventService.create(createData as any);
    return ResponseUtil.success(res, event, 'Event created', 201);
  });

  //==================
  // ADMIN - UPDATE EVENT
  //==================
  update = asyncHandler(
    async (req: ReqParamsBody<UuidParam, UpdateEventDto>, res: Response) => {
      const eventData = req.body;
      const { id } = req.params;

      if (eventData.spotLeft) eventData.spotLeft = Number(eventData.spotLeft);
      if (eventData.date) eventData.date = new Date(eventData.date);
      if (eventData.joinTill) eventData.joinTill = new Date(eventData.joinTill);
      if (eventData.isSignature !== undefined) {
        eventData.isSignature = String(eventData.isSignature) === 'true';
      }

      const existingEvent = await this.eventService.getById(id);

      // Handle media replacement
      if (req.file) {
        if (existingEvent.publicId) {
          await CloudinaryService.deleteFile(existingEvent.publicId);
        }

        const uploadResult = await CloudinaryService.uploadFile(
          req.file,
          'event',
        );
        eventData.mediaUrl = uploadResult.url;
        eventData.publicId = uploadResult.publicId;
      }

      const event = await this.eventService.update(id, eventData);
      return ResponseUtil.success(res, event, 'Event updated');
    },
  );

  //==================
  // PUBLIC - GET ALL EVENTS
  //==================
  getAll = asyncHandler(
    async (req: ReqQuery<EventListQueryDto>, res: Response) => {
      const {
        page = 1,
        limit = 10,
        location,
        startDate,
        endDate,
        hasSpots,
        sortBy = 'date',
        sortOrder = 'asc',
      } = req.query;

      const filters: Prisma.EventWhereInput = { deletedAt: null };

      if (location) {
        filters.location = {
          contains: String(location),
          mode: 'insensitive',
        };
      }

      if (startDate && endDate) {
        filters.date = {
          gte: new Date(String(startDate)),
          lte: new Date(String(endDate)),
        };
      }

      if (hasSpots) {
        filters.spotLeft = { gt: 0 };
      }

      // In EventController.getAll
      const result = await this.eventService.paginate(
        Number(page),
        Number(limit),
        {
          where: filters,
          orderBy: { [String(sortBy)]: String(sortOrder) },
          include: {
            creator: {
              // ADD THIS HERE
              select: { id: true, name: true, image: true },
            },
            registrations: {
              take: 5,
              include: {
                user: { select: { id: true, name: true, image: true } },
              },
            },
            _count: { select: { registrations: true } },
          },
        },
      );

      return ResponseUtil.paginated(res, result);
    },
  );

  //==================
  // PUBLIC - GET UPCOMING EVENTS
  //==================
  getUpcoming = asyncHandler(async (req: TypedRequest, res: Response) => {
    const events = await this.eventService.getUpcoming();
    return ResponseUtil.success(res, events);
  });

  //==================
  // PUBLIC - GET SINGLE EVENT
  //==================
  getById = asyncHandler(async (req: ReqParams<UuidParam>, res: Response) => {
    const event = await this.eventService.getByIdWithDetails(req.params.id);
    if (!event) {
      throw new Error('Event not found');
    }
    const userId = req.userId;

    let hasJoined = false;
    if (userId) {
      const registration = await this.eventService.checkUserRegistration(
        userId,
        req.params.id,
      );
      hasJoined = !!registration && registration.status === 'CONFIRMED';
    }

    const enrichedEvent = {
      ...event,
      isExpired: new Date() > new Date(event.joinTill),
      isFull: event.spotLeft <= 0,
      hasJoined,
    };

    return ResponseUtil.success(res, enrichedEvent);
  });

  //==================
  // PROTECTED - JOIN EVENT
  //==================
  joinEvent = asyncHandler(async (req: ReqParams<UuidParam>, res: Response) => {
    const { id: eventId } = req.params;
    const userId = req.userId!;

    const registration = await this.eventService.registerForEvent(
      eventId,
      userId,
    );

    return ResponseUtil.success(
      res,
      registration,
      'Successfully joined the event',
      201,
    );
  });

  //==================
  // PROTECTED - CANCEL REGISTRATION
  //==================
  cancelRegistration = asyncHandler(
    async (req: ReqParams<UuidParam>, res: Response) => {
      const { id: eventId } = req.params;
      const userId = req.userId!;

      const result = await this.eventService.cancelRegistration(
        eventId,
        userId,
      );

      return ResponseUtil.success(res, result, result.message);
    },
  );

  //==================
  // PROTECTED - GET MY BOOKINGS
  //==================
  getMyBookings = asyncHandler(
    async (req: ReqQuery<MyBookingsQueryDto>, res: Response) => {
      const userId = req.userId!;
      const { status, upcomingOnly } = req.query;

      const upcomingOnlyFlag =
        typeof upcomingOnly === 'string'
          ? upcomingOnly === 'true'
          : !!upcomingOnly;

      const bookings = await this.eventService.getUserRegistrations(userId, {
        status: status as string,
        upcomingOnly: upcomingOnlyFlag,
      });

      return ResponseUtil.success(res, bookings);
    },
  );

  //==================
  // ADMIN - DELETE EVENT
  //==================
  delete = asyncHandler(
    async (
      req: ReqParamsQuery<UuidParam, { hard?: string }>,
      res: Response,
    ) => {
      const isHard = req.query.hard === 'true';
      const { id } = req.params;

      const event = await this.eventService.getById(id);

      // Delete media on hard delete
      if (isHard && event.publicId) {
        await CloudinaryService.deleteFile(event.publicId);
      }

      await this.eventService.delete(id, isHard);
      return ResponseUtil.success(res, null, 'Event deleted');
    },
  );

  //==================
  // ADMIN - GET STATS
  //==================
  getStats = asyncHandler(async (req: TypedRequest, res: Response) => {
    const stats = await this.eventService.getEventStats();
    return ResponseUtil.success(res, stats);
  });
}
