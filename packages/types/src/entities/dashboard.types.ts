import { Role } from '../enums';

// ==================== BASE METRICS ====================

/**
 * Common metrics shared across different dashboard views
 */
export interface ReferralMetrics {
  total: number;
  pointsEarned: number;
}

// ==================== ROLE-SPECIFIC STATS ====================

/**
 * Dashboard statistics for Adventurers
 * Shows total referrals and unlocked tours
 */
export interface AdventurerStats {
  totalReferred: number;
  totalUnlockedTours: number;
}

/**
 * Dashboard statistics for Corporate Agents
 * Shows only trip requests
 */
export interface CorporateAgentStats {
  totalTripRequests: number;
}

/**
 * Dashboard statistics for Independent Agents
 * Shows calls, bookings, and referral points
 */
export interface IndependentAgentStats {
  upcomingCalls: number;
  completedCalls: number;
  pointsEarnedPerReferral: number;
  totalBookings: number;
}

/**
 * Dashboard statistics for Affiliates
 * Shows referrals, bookings, and points earned
 */
export interface AffiliateStats {
  totalReferred: number;
  totalBookings: number;
  pointsEarned: number;
}

/**
 * Comprehensive dashboard statistics for Admins and Super Admins
 * Provides complete system overview including all incoming requests
 */
export interface AdminStats {
  users: {
    total: number;
    byRole: Record<Role, number>;
    activeToday: number;
    newThisMonth: number;
  };
  adventures: {
    total: number;
    verified: number;
    active: number;
    avgPrice: number;
  };
  events: {
    total: number;
    upcoming: number;
    totalRegistrations: number;
  };
  community: {
    totalPosts: number;
    totalComments: number;
    totalReviews: number;
    avgRating: number;
  };
  referrals: {
    total: number;
    topReferrers: Array<{
      id: string;
      name: string;
      email: string;
      role: Role;
      referralCount: number;
      pointsEarned: number;
    }>;
  };
  requests: {
    totalTripRequests: number;
    totalCallbackRequests: number;
    totalPlanningCalls: number;
    pendingCallbacks: number;
    unassignedTripRequests: number;
    unassignedCallbacks: number;
  };
}

// ==================== DASHBOARD RESPONSE TYPE ====================

/**
 * Type-safe dashboard response discriminated by user role
 */
export type DashboardStatsResponse =
  | { role: 'COOPERATE_AGENT'; stats: CorporateAgentStats }
  | { role: 'INDEPENDENT_AGENT'; stats: IndependentAgentStats }
  | { role: 'AFFILIATE'; stats: AffiliateStats }
  | { role: 'ADMIN' | 'SUPER_ADMIN'; stats: AdminStats }
  | { role: 'ADVENTURER'; stats: AdventurerStats };

// ==================== LEADERBOARD TYPES ====================

/**
 * Top performers across the platform
 */
export interface TopPerformers {
  topAgents: Array<{
    id: string;
    name: string;
    email: string;
    role: 'INDEPENDENT_AGENT' | 'COOPERATE_AGENT';
    pointsEarned: number;
  }>;
  topAffiliates: Array<{
    id: string;
    name: string;
    email: string;
    referralCount: number;
    pointsEarned: number;
  }>;
}

/**
 * Date range filter for analytics queries
 */
export interface DateRangeFilter {
  startDate: Date;
  endDate: Date;
}

/**
 * Analytics overview with time-series data
 */
export interface AnalyticsOverview extends DateRangeFilter {
  metrics: {
    newUsers: number;
    newAdventures: number;
    newPosts: number;
    newReviews: number;
    totalRevenue: number;
  };
  trends: Array<{
    date: Date;
    users: number;
    adventures: number;
    posts: number;
    revenue: number;
  }>;
}
