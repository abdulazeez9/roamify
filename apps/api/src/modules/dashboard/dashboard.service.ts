import { Prisma, Role } from '@zagotours/database';
import { DashboardRepository } from './dashboard.repository';
import { DashboardStatsResponse } from '@zagotours/types';
import { BaseService } from 'src/common/service/base.service';

export class DashboardService extends BaseService<
  Prisma.UserGetPayload<{}>,
  Prisma.UserWhereInput,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput
> {
  protected readonly resourceName = 'Dashboard';

  constructor(protected readonly repository: DashboardRepository) {
    super(repository);
  }

  async getStatsForUser(
    userId: string,
    role: Role,
  ): Promise<DashboardStatsResponse> {
    switch (role) {
      case Role.ADVENTURER:
        return {
          role: 'ADVENTURER',
          stats: await this.repository.getAdventurerStats(userId),
        };
      case Role.COOPERATE_AGENT:
        return {
          role: 'COOPERATE_AGENT',
          stats: await this.repository.getCorporateAgentStats(userId),
        };
      case Role.INDEPENDENT_AGENT:
        return {
          role: 'INDEPENDENT_AGENT',
          stats: await this.repository.getIndependentAgentStats(userId),
        };
      case Role.AFFILIATE:
        return {
          role: 'AFFILIATE',
          stats: await this.repository.getAffiliateStats(userId),
        };
      case Role.ADMIN:
      case Role.SUPER_ADMIN:
        return {
          role: role as 'ADMIN' | 'SUPER_ADMIN',
          stats: await this.repository.getAdminStats(),
        };
      default:
        throw new Error(
          `Access Denied: No dashboard available for role: ${role}`,
        );
    }
  }

  async getTopPerformers(limit: number = 10) {
    const [topAgents, topAffiliates] = await Promise.all([
      this.repository.getTopAgentsByPoints(limit),
      this.repository.getTopAffiliatesByPoints(limit),
    ]);
    return { topAgents, topAffiliates };
  }

  async getAgentDetailsForAdmin(agentId: string) {
    // Uses BaseService.getById to handle existence check
    const agent = await this.getById(agentId);

    if (
      agent.role !== Role.INDEPENDENT_AGENT &&
      agent.role !== Role.COOPERATE_AGENT
    ) {
      throw new Error('User is not an agent');
    }

    return agent.role === Role.INDEPENDENT_AGENT
      ? this.repository.getIndependentAgentStats(agentId)
      : this.repository.getCorporateAgentStats(agentId);
  }

  async getAffiliateDetailsForAdmin(affiliateId: string) {
    // Uses BaseService.getById to handle existence check
    const affiliate = await this.getById(affiliateId);

    if (affiliate.role !== Role.AFFILIATE) {
      throw new Error('User is not an affiliate');
    }

    return this.repository.getAffiliateStats(affiliateId);
  }
}
