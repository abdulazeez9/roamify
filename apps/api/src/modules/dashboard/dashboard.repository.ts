import { Prisma, prisma } from '@zagotours/database';
import {
  Role,
  CorporateAgentStats,
  IndependentAgentStats,
  AffiliateStats,
  AdminStats,
  AdventurerStats,
} from '@zagotours/types';
import { BaseRepository } from 'src/common/repository/base.repository';

export class DashboardRepository extends BaseRepository<
  Prisma.UserGetPayload<{}>,
  Prisma.UserWhereInput,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput
> {
  // Point the delegate to user
  protected readonly modelDelegate = prisma.user;

  // ==================== ADVENTURER STATS ====================
  async getAdventurerStats(userId: string): Promise<AdventurerStats> {
    const [totalReferred, totalUnlockedTours] = await this.prisma.$transaction([
      // Total referrals
      this.prisma.user.count({
        where: { referredById: userId },
      }),
      // Total unlocked/active adventures in the platform
      this.prisma.adventure.count({
        where: { status: 'ACTIVE' },
      }),
    ]);

    return {
      totalReferred,
      totalUnlockedTours,
    };
  }

  // ==================== CORPORATE AGENT STATS ====================
  async getCorporateAgentStats(userId: string): Promise<CorporateAgentStats> {
    // Trip requests submitted by this corporate agent
    const totalTripRequests = await this.prisma.tripRequest.count({
      where: { adventurerId: userId },
    });

    return {
      totalTripRequests,
    };
  }

  // ==================== INDEPENDENT AGENT STATS ====================
  async getIndependentAgentStats(
    userId: string,
  ): Promise<IndependentAgentStats> {
    const [upcomingCalls, completedCalls, totalReferrals, totalBookings] =
      await this.prisma.$transaction([
        // Upcoming calls (as agent)
        this.prisma.tripPlanningCall.count({
          where: { agentId: userId, status: 'SCHEDULED' },
        }),
        // Completed calls (as agent)
        this.prisma.tripPlanningCall.count({
          where: { agentId: userId, status: 'COMPLETED' },
        }),
        // Total referrals
        this.prisma.user.count({ where: { referredById: userId } }),
        // Total bookings (trip requests submitted by this agent)
        this.prisma.tripRequest.count({ where: { adventurerId: userId } }),
      ]);

    const pointsEarnedPerReferral = totalReferrals * 100;

    return {
      upcomingCalls,
      completedCalls,
      pointsEarnedPerReferral,
      totalBookings,
    };
  }

  // ==================== AFFILIATE STATS ====================
  async getAffiliateStats(userId: string): Promise<AffiliateStats> {
    const [totalReferred, totalBookings] = await this.prisma.$transaction([
      // Total referrals
      this.prisma.user.count({ where: { referredById: userId } }),
      // Total bookings (trip requests submitted by this affiliate)
      this.prisma.tripRequest.count({ where: { adventurerId: userId } }),
    ]);

    return {
      totalReferred,
      totalBookings,
      pointsEarned: totalReferred * 100,
    };
  }

  // ==================== ADMIN STATS ====================
  async getAdminStats(): Promise<AdminStats> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      usersByRole,
      activeToday,
      newThisMonth,
      totalAdventures,
      verifiedAdventures,
      activeAdventures,
      avgPrice,
      totalEvents,
      upcomingEvents,
      totalEventRegistrations,
      totalPosts,
      totalComments,
      totalReviews,
      avgRating,
      totalReferrals,
      topReferrers,
      totalTripRequests,
      totalCallbackRequests,
      totalPlanningCalls,
      pendingCallbacks,
      unassignedTripRequests,
      unassignedCallbacks,
    ] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: { role: true },
        orderBy: { _count: { role: 'desc' } },
      }),
      this.prisma.user.count({ where: { updatedAt: { gte: startOfToday } } }),
      this.prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      this.prisma.adventure.count(),
      this.prisma.adventure.count({ where: { isVerified: true } }),
      this.prisma.adventure.count({ where: { status: 'ACTIVE' } }),
      this.prisma.adventure.aggregate({ _avg: { price: true } }),
      this.prisma.event.count(),
      this.prisma.event.count({ where: { date: { gte: new Date() } } }),
      this.prisma.eventRegistration.count(),
      this.prisma.post.count(),
      this.prisma.comment.count(),
      this.prisma.review.count(),
      this.prisma.review.aggregate({ _avg: { rating: true } }),
      this.prisma.user.count({ where: { referredById: { not: null } } }),
      this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          _count: {
            select: {
              referees: true,
              agentCalls: { where: { status: 'COMPLETED' } },
            },
          },
        },
        where: { referees: { some: {} } },
        orderBy: { referees: { _count: 'desc' } },
        take: 10,
      }),
      this.prisma.tripRequest.count(),
      this.prisma.callbackRequest.count(),
      this.prisma.tripPlanningCall.count(),
      this.prisma.callbackRequest.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      // All trip requests are unassigned (no agent assignment)
      this.prisma.tripRequest.count({
        where: { assignedAgentId: null },
      }),
      // All callback requests are unassigned (no agent assignment)
      this.prisma.callbackRequest.count({
        where: { assignedAgentId: null },
      }),
    ]);

    const byRole: Record<Role, number> = {
      [Role.SUPER_ADMIN]: 0,
      [Role.ADMIN]: 0,
      [Role.AFFILIATE]: 0,
      [Role.ADVENTURER]: 0,
      [Role.INDEPENDENT_AGENT]: 0,
      [Role.COOPERATE_AGENT]: 0,
    };

    // Cast usersByRole as any to bypass the Prisma internal 'true | object' union error
    (usersByRole as any[]).forEach((group) => {
      if (group.role) byRole[group.role as Role] = group._count?.role || 0;
    });

    return {
      users: { total: totalUsers, byRole, activeToday, newThisMonth },
      adventures: {
        total: totalAdventures,
        verified: verifiedAdventures,
        active: activeAdventures,
        avgPrice: Number((avgPrice as any)._avg?.price) || 0,
      },
      events: {
        total: totalEvents,
        upcoming: upcomingEvents,
        totalRegistrations: totalEventRegistrations,
      },
      community: {
        totalPosts,
        totalComments,
        totalReviews,
        avgRating: Number((avgRating as any)._avg?.rating) || 0,
      },
      referrals: {
        total: totalReferrals,
        topReferrers: topReferrers.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role as Role,
          referralCount: u._count.referees,
          pointsEarned:
            u._count.referees * 100 +
            (u.role === Role.INDEPENDENT_AGENT ? u._count.agentCalls * 50 : 0),
        })),
      },
      requests: {
        totalTripRequests,
        totalCallbackRequests,
        totalPlanningCalls,
        pendingCallbacks,
        unassignedTripRequests,
        unassignedCallbacks,
      },
    };
  }

  async getTopAgentsByPoints(limit: number = 10) {
    const agents = await this.prisma.user.findMany({
      where: { role: { in: [Role.INDEPENDENT_AGENT, Role.COOPERATE_AGENT] } },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        _count: {
          select: {
            referees: true,
            agentCalls: { where: { status: 'COMPLETED' } },
          },
        },
      },
      take: limit * 2,
    });

    return agents
      .map((a) => ({
        id: a.id,
        name: a.name,
        email: a.email,
        role: a.role as 'INDEPENDENT_AGENT' | 'COOPERATE_AGENT',
        pointsEarned:
          a._count.referees * 100 +
          (a.role === Role.INDEPENDENT_AGENT ? a._count.agentCalls * 50 : 0),
      }))
      .sort((a, b) => b.pointsEarned - a.pointsEarned)
      .slice(0, limit);
  }

  async getTopAffiliatesByPoints(limit: number = 10) {
    const affiliates = await this.prisma.user.findMany({
      where: { role: Role.AFFILIATE },
      select: {
        id: true,
        name: true,
        email: true,
        _count: { select: { referees: true } },
      },
      orderBy: { referees: { _count: 'desc' } },
      take: limit,
    });
    return affiliates.map((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      referralCount: a._count.referees,
      pointsEarned: a._count.referees * 100,
    }));
  }
}
