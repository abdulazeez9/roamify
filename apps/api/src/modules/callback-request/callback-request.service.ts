import { CallbackRequest, Prisma, prisma } from '@zagotours/database';
import { BaseService } from 'src/common/service/base.service';
import { CallbackRequestRepository } from './callback-request.repository';
import { EmailService } from 'src/shared/services/email.service';
import { CreateCallbackRequestDto } from '@zagotours/types';

export class CallbackRequestService extends BaseService<
  CallbackRequest,
  Prisma.CallbackRequestWhereInput,
  Prisma.CallbackRequestCreateInput,
  Prisma.CallbackRequestUpdateInput,
  Prisma.CallbackRequestInclude
> {
  protected readonly resourceName = 'CallbackRequest';

  constructor(private readonly callbackRepo: CallbackRequestRepository) {
    super(callbackRepo);
  }

  /**
   * Create callback request from logged-in adventurer
   * Automatically assigns to their referrer
   */
  async createForAdventurer(
    adventurerId: string,
    data: CreateCallbackRequestDto,
  ): Promise<CallbackRequest> {
    // Get adventurer to find their referrer
    const adventurer = await prisma.user.findUnique({
      where: { id: adventurerId },
      select: {
        referredById: true,
        referrer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!adventurer) {
      throw new Error('Adventurer not found');
    }

    // Create request with auto-assignment to referrer
    const request = await this.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      bestTime: data.bestTime,
      adventurer: { connect: { id: adventurerId } },
      assignedAgent: adventurer.referredById
        ? { connect: { id: adventurer.referredById } }
        : undefined,
    });

    // Send notification to assigned agent
    if (adventurer.referrer) {
      await EmailService.sendCallbackRequestNotification(
        adventurer.referrer.email,
        adventurer.referrer.name,
        {
          requestorName: data.name,
          requestorEmail: data.email,
          requestorPhone: data.phone,
          bestTime: data.bestTime,
          requestId: request.id,
          isRegisteredUser: true,
        },
      );
    }

    return request;
  }

  /**
   * Create callback request from anonymous user (not logged in)
   * No assignment since there's no referrer
   */
  async createAnonymous(
    data: CreateCallbackRequestDto,
  ): Promise<CallbackRequest> {
    const request = await this.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      bestTime: data.bestTime,
    });

    // Send notification to admin for anonymous requests
    await EmailService.sendAnonymousCallbackNotification({
      name: data.name,
      email: data.email,
      phone: data.phone,
      bestTime: data.bestTime,
      requestId: request.id,
      createdAt: request.createdAt,
    });

    return request;
  }

  /**
   * Get requests assigned to an agent (from their referrals)
   */
  async getAssignedToAgent(agentId: string): Promise<CallbackRequest[]> {
    return this.callbackRepo.findByAssignedAgent(agentId);
  }

  /**
   * Get requests by adventurer
   */
  async getByAdventurer(adventurerId: string): Promise<CallbackRequest[]> {
    return this.callbackRepo.findByAdventurer(adventurerId);
  }

  /**
   * Get requests by date range
   */
  async getByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<CallbackRequest[]> {
    return this.callbackRepo.findByDateRange(startDate, endDate);
  }

  /**
   * Get pending requests
   */
  async getPending(): Promise<CallbackRequest[]> {
    return this.callbackRepo.findPending();
  }

  /**
   * Paginate with filters
   */
  async paginate(
    page: number,
    limit: number,
    filters?: {
      where?: Prisma.CallbackRequestWhereInput;
      include?: Prisma.CallbackRequestInclude;
      orderBy?: any;
    },
  ) {
    return this.callbackRepo.paginateWithDetails(page, limit, filters?.where);
  }
}
