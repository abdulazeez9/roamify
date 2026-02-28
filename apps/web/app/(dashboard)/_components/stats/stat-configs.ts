import {
  LuUsers,
  LuPlaneTakeoff,
  LuCalendarCheck,
  LuPhone,
  LuUserPlus,
  LuStar,
  LuTrendingUp,
  LuFileText,
  LuClipboardList,
} from 'react-icons/lu';
import {
  AdminStats,
  CorporateAgentStats,
  IndependentAgentStats,
  AffiliateStats,
  AdventurerStats,
} from '@zagotours/types';
import { StatCardData } from './stat-card';
import { AlertCircle } from 'lucide-react';

export const getAdminStatsConfig = (data: AdminStats): StatCardData[] => [
  {
    label: 'Total Users',
    value: data?.users.total.toLocaleString(),
    icon: LuUsers,
  },
  {
    label: 'Total Adventures',
    value: data?.adventures.total.toLocaleString(),
    icon: LuPlaneTakeoff,
  },
  {
    label: 'Upcoming Events',
    value: data?.events.upcoming.toLocaleString(),
    icon: LuCalendarCheck,
  },
  {
    label: 'Total Posts',
    value: data?.community.totalPosts.toLocaleString(),
    icon: LuFileText,
  },
  {
    label: 'Avg Rating',
    value: data?.community.avgRating?.toFixed(1) || '0.0',
    trend: `${data?.community.totalReviews} reviews`,
    icon: LuStar,
  },
  {
    label: 'Unassigned Trip Requests',
    value: data?.requests.unassignedTripRequests.toLocaleString(),
    icon: AlertCircle,
  },
  {
    label: 'Unassigned Callbacks',
    value: data?.requests.unassignedCallbacks.toLocaleString(),
    icon: LuPhone,
  },
  {
    label: 'Total Referrals',
    value: data?.referrals.total.toLocaleString(),
    icon: LuUserPlus,
  },
];

export const getCorporateAgentStatsConfig = (
  data: CorporateAgentStats,
): StatCardData[] => [
  {
    label: 'Trip Requests',
    value: data?.totalTripRequests.toLocaleString(),
    icon: LuPlaneTakeoff,
  },

  {
    label: 'Total Trips',
    value: data?.totalTripRequests.toLocaleString(),
    icon: LuPlaneTakeoff,
  },
];

export const getIndependentAgentStatsConfig = (
  data: IndependentAgentStats,
): StatCardData[] => [
  {
    label: 'Upcoming Calls',
    value: data?.upcomingCalls.toLocaleString(),
    icon: LuCalendarCheck,
  },
  {
    label: 'Completed Calls',
    value: data?.completedCalls.toLocaleString(),
    icon: LuPhone,
  },
  {
    label: 'Total Bookings',
    value: data?.totalBookings.toLocaleString(),
    icon: LuPlaneTakeoff,
  },
  {
    label: 'Points Earned',
    value: data?.pointsEarnedPerReferral.toLocaleString(),
    icon: LuTrendingUp,
  },
];

export const getAffiliateStatsConfig = (
  data: AffiliateStats,
): StatCardData[] => [
  {
    label: 'Total Referral',
    value: data?.totalReferred.toLocaleString(),
    icon: LuUserPlus,
  },
  {
    label: 'Total Bookings',
    value: data?.totalBookings.toLocaleString(),
    icon: LuClipboardList,
  },
  {
    label: 'Total Commission',
    value: data?.pointsEarned.toLocaleString(),
    icon: LuStar,
  },
];

export const getAdventurerStatsConfig = (
  data: AdventurerStats,
): StatCardData[] => [
  {
    label: 'Total Referred',
    value: data?.totalReferred.toLocaleString(),
    icon: LuUserPlus,
  },
  {
    label: 'Unlocked Tours',
    value: data?.totalUnlockedTours.toLocaleString(),
    icon: LuPlaneTakeoff,
  },
];
