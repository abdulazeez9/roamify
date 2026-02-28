import { apiRequest } from '@/lib/api';
import { dashboardKeys } from './query-keys';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/config/api.config';
import { DashboardStatsResponse, TopPerformers } from '@zagotours/types';

/**
 * Fetch dashboard statistics for the authenticated user
 * This works for all roles - returns role-specific stats
 */
export function useDashboardStats() {
  return useQuery<DashboardStatsResponse>({
    queryKey: dashboardKeys.stats(),
    queryFn: () => apiRequest(API_ENDPOINTS.DASHBOARD.STATS),
  });
}

/**
 * Fetch leaderboard data
 * IMPORTANT: Only admins/super admins can access this endpoint
 *
 * @param enabled - Whether to execute the query (should be isAnyAdmin)
 */
export function useLeaderboard(enabled: boolean = false) {
  return useQuery<TopPerformers>({
    queryKey: dashboardKeys.leaderboard(),
    queryFn: () => apiRequest(API_ENDPOINTS.DASHBOARD.LEADERBOARD),
    enabled,
  });
}

/**
 * Fetch specific agent statistics
 * Admin/Super Admin only
 */
export function useAgentStats(agentId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: dashboardKeys.agentStats(agentId),
    queryFn: () => apiRequest(API_ENDPOINTS.DASHBOARD.AGENT_STATS(agentId)),
    enabled: enabled && !!agentId,
  });
}

/**
 * Fetch specific affiliate statistics
 * Admin/Super Admin only
 */
export function useAffiliateStats(
  affiliateId: string,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: dashboardKeys.affiliateStats(affiliateId),
    queryFn: () =>
      apiRequest(API_ENDPOINTS.DASHBOARD.AFFILIATE_STATS(affiliateId)),
    enabled: enabled && !!affiliateId,
  });
}

// Type guards for narrowing stats types based on role
export const isAdminStats = (
  response: DashboardStatsResponse,
): response is Extract<
  DashboardStatsResponse,
  { role: 'ADMIN' | 'SUPER_ADMIN' }
> => {
  return response.role === 'ADMIN' || response.role === 'SUPER_ADMIN';
};

export const isCorporateAgentStats = (
  response: DashboardStatsResponse,
): response is Extract<DashboardStatsResponse, { role: 'COOPERATE_AGENT' }> => {
  return response.role === 'COOPERATE_AGENT';
};

export const isIndependentAgentStats = (
  response: DashboardStatsResponse,
): response is Extract<
  DashboardStatsResponse,
  { role: 'INDEPENDENT_AGENT' }
> => {
  return response.role === 'INDEPENDENT_AGENT';
};

export const isAffiliateStats = (
  response: DashboardStatsResponse,
): response is Extract<DashboardStatsResponse, { role: 'AFFILIATE' }> => {
  return response.role === 'AFFILIATE';
};

export const isAdventurerStats = (
  response: DashboardStatsResponse,
): response is Extract<DashboardStatsResponse, { role: 'ADVENTURER' }> => {
  return response.role === 'ADVENTURER';
};
