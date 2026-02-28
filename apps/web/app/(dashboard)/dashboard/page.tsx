'use client';
import { useDashboardStats, usePermissions } from '@/hooks';
import { useLeaderboard } from '@/hooks/api/use-dashboard';
import { Box, Stack, Text, Heading, Flex, Center } from '@chakra-ui/react';
import {
  getAdminStatsConfig,
  getAdventurerStatsConfig,
  getAffiliateStatsConfig,
  getCorporateAgentStatsConfig,
  getIndependentAgentStatsConfig,
} from '../_components/stats/stat-configs';
import { StatsGrid } from '../_components/stats/stat-card';
import { Leaderboard } from '../_components/leaderboard/Leaderboard';
import { ReferralCard } from '@/components/ui/card/ReferralCard';
import { CommunityCard } from '@/components/ui/card/CommunityCard';
import { TripRequestsTable } from '../_components/dataDisplay/TripRequestTable';
import UpcomingAdventuresAndEventsPage from '../_components/dataDisplay/UpcomingAdventuresAndEvents';
import { WelcomeBanner } from '../_components/banner/WelcomeBanner';
import { TripPlanningCalls } from '../_components/trip-planning-calls/TripPlanningCalls';
import SafetyAmbassadorTable from '../_components/table/SafetyAmbassadorTable';
import {
  AffiliateContractTable,
  CorporateContractTable,
} from '../_components/table/ContractTable';
import MediaKitPage from '../independent-agent/media-kits/page';

export default function DashboardPage() {
  const { data: response, isLoading: statsLoading } = useDashboardStats();
  const {
    isAnyAdmin,
    isCooperateAgent,
    isIndependentAgent,
    isAdventurer,
    isAffiliate,
  } = usePermissions();

  const { data: leaderResponse, isLoading: leaderboardLoading } =
    useLeaderboard(isAnyAdmin);

  const statsData = response?.data;
  const leaderboardData = leaderResponse;

  const getStatsConfig = () => {
    if (!statsData?.stats) return [];

    switch (statsData.role) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return getAdminStatsConfig(statsData.stats);
      case 'COOPERATE_AGENT':
        return getCorporateAgentStatsConfig(statsData.stats);
      case 'INDEPENDENT_AGENT':
        return getIndependentAgentStatsConfig(statsData.stats);
      case 'AFFILIATE':
        return getAffiliateStatsConfig(statsData.stats);
      case 'ADVENTURER':
        return getAdventurerStatsConfig(statsData.stats);
      default:
        return [];
    }
  };

  return (
    <Box>
      <WelcomeBanner />
      <Stack gap={8}>
        {!statsLoading && !statsData && (
          <Center p={6}>
            <Text color='gray.500'>No dashboard data available</Text>
          </Center>
        )}
        <StatsGrid stats={getStatsConfig()} isLoading={statsLoading} />

        {isCooperateAgent && <TripRequestsTable />}

        {isAnyAdmin && (
          <Box>
            <Heading size='lg' mb={4}>
              Top Performers
            </Heading>
            <Leaderboard
              topAgents={leaderboardData?.topAgents || []}
              topAffiliates={leaderboardData?.topAffiliates || []}
              isLoading={leaderboardLoading}
            />
          </Box>
        )}

        {statsData?.role === 'ADVENTURER' && statsData?.stats && (
          <UpcomingAdventuresAndEventsPage />
        )}

        {!isAnyAdmin && <TripPlanningCalls />}

        {isAdventurer && <SafetyAmbassadorTable />}

        {isCooperateAgent && (
          <Box bg='surface' border='1px solid gray.200' p={5}>
            <Heading mb={6} fontSize='lg' fontWeight='bold'>
              Corporate Contract
            </Heading>
            <CorporateContractTable />
          </Box>
        )}

        {isIndependentAgent && <MediaKitPage />}

        {isAffiliate && (
          <Box bg='surface' border='1px solid gray.200' p={5}>
            <Heading mb={6} fontSize='lg' fontWeight='bold'>
              Affiliate Management
            </Heading>
            <AffiliateContractTable />
          </Box>
        )}
        {!isAnyAdmin && (
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify='space-between'
            alignItems='stretch'
            gap={6}
          >
            <CommunityCard />
            <ReferralCard />
          </Flex>
        )}
      </Stack>
    </Box>
  );
}
