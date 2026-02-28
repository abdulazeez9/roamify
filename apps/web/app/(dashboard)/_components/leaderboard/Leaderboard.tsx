'use client';
import {
  Box,
  Stack,
  Text,
  HStack,
  Badge,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { LuTrophy, LuStar, LuUsers, LuAward } from 'react-icons/lu';

// Use string literals to match backend response
type AgentRole = 'INDEPENDENT_AGENT' | 'COOPERATE_AGENT';

interface TopAgent {
  id: string;
  name: string;
  email: string;
  role: AgentRole;
  pointsEarned: number;
}

interface TopAffiliate {
  id: string;
  name: string;
  email: string;
  referralCount: number;
  pointsEarned: number;
}

interface LeaderboardCardProps<T> {
  title: string;
  users: T[];
  isLoading?: boolean;
  icon: React.ElementType;
  renderUserInfo: (user: T) => React.ReactNode;
  renderPoints: (user: T) => { points: number; subtitle?: string };
}

const getRoleBadgeColor = (role: AgentRole) => {
  switch (role) {
    case 'COOPERATE_AGENT':
      return 'purple';
    case 'INDEPENDENT_AGENT':
      return 'blue';
    default:
      return 'gray';
  }
};

const getRoleLabel = (role: AgentRole) => {
  switch (role) {
    case 'COOPERATE_AGENT':
      return 'Corporate';
    case 'INDEPENDENT_AGENT':
      return 'Independent';
    default:
      return role;
  }
};

function LeaderboardCard<
  T extends { id: string; name: string; email: string },
>({
  title,
  users,
  isLoading,
  icon,
  renderUserInfo,
  renderPoints,
}: LeaderboardCardProps<T>) {
  if (isLoading) {
    return (
      <Box
        bg='white'
        p={6}
        borderRadius='2xl'
        border='1px solid'
        borderColor='gray.100'
        boxShadow='sm'
      >
        <HStack mb={4}>
          <Icon as={icon} boxSize={5} color='blue.600' />
          <Text fontSize='lg' fontWeight='bold'>
            {title}
          </Text>
        </HStack>
        <Stack gap={3}>
          {[1, 2, 3].map((i) => (
            <Box key={i} h='60px' bg='gray.100' borderRadius='lg' />
          ))}
        </Stack>
      </Box>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Box
        bg='white'
        p={6}
        borderRadius='2xl'
        border='1px solid'
        borderColor='gray.100'
        boxShadow='sm'
      >
        <HStack mb={4}>
          <Icon as={icon} boxSize={5} color='blue.600' />
          <Text fontSize='lg' fontWeight='bold'>
            {title}
          </Text>
        </HStack>
        <Box
          py={8}
          textAlign='center'
          color='gray.400'
          borderRadius='lg'
          bg='gray.50'
        >
          <Text fontSize='sm'>No data available</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      bg='white'
      p={6}
      borderRadius='2xl'
      border='1px solid'
      borderColor='gray.100'
      boxShadow='sm'
    >
      <HStack mb={4}>
        <Icon as={icon} boxSize={5} color='blue.600' />
        <Text fontSize='lg' fontWeight='bold'>
          {title}
        </Text>
      </HStack>

      <Stack gap={3}>
        {users.map((user, index) => {
          const { points, subtitle } = renderPoints(user);

          return (
            <Box
              key={user.id}
              p={4}
              borderRadius='lg'
              border='1px solid'
              borderColor={index === 0 ? 'yellow.300' : 'gray.100'}
              bg={index === 0 ? 'yellow.50' : 'gray.50'}
              transition='all 0.2s'
              _hover={{
                borderColor: index === 0 ? 'yellow.400' : 'gray.200',
                transform: 'translateX(4px)',
              }}
            >
              <HStack justify='space-between'>
                <HStack gap={3}>
                  {/* Rank Badge */}
                  <Box
                    w={8}
                    h={8}
                    borderRadius='full'
                    bg={
                      index === 0
                        ? 'yellow.400'
                        : index === 1
                          ? 'gray.300'
                          : index === 2
                            ? 'orange.300'
                            : 'gray.200'
                    }
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    fontWeight='bold'
                    fontSize='sm'
                    color={index === 0 ? 'yellow.900' : 'gray.700'}
                  >
                    {index === 0 ? (
                      <Icon as={LuTrophy} boxSize={4} />
                    ) : (
                      index + 1
                    )}
                  </Box>

                  {/* User Info */}
                  <Stack gap={0}>
                    <Text fontWeight='semibold' fontSize='sm'>
                      {user.name}
                    </Text>
                    <HStack gap={2}>
                      <Text fontSize='xs' color='gray.500'>
                        {user.email}
                      </Text>
                      {renderUserInfo(user)}
                    </HStack>
                  </Stack>
                </HStack>

                {/* Points */}
                <Stack gap={0} align='flex-end'>
                  <HStack gap={1}>
                    <Icon as={LuStar} boxSize={4} color='yellow.500' />
                    <Text fontWeight='bold' fontSize='lg'>
                      {points.toLocaleString()}
                    </Text>
                  </HStack>
                  {subtitle && (
                    <Text fontSize='xs' color='gray.500'>
                      {subtitle}
                    </Text>
                  )}
                </Stack>
              </HStack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}

interface LeaderboardProps {
  topAgents: TopAgent[];
  topAffiliates: TopAffiliate[];
  isLoading?: boolean;
}

export const Leaderboard = ({
  topAgents,
  topAffiliates,
  isLoading,
}: LeaderboardProps) => {
  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
      <LeaderboardCard<TopAgent>
        title='Top Agents'
        users={topAgents}
        isLoading={isLoading}
        icon={LuAward}
        renderUserInfo={(user) => (
          <Badge
            colorPalette={getRoleBadgeColor(user.role)}
            variant='subtle'
            size='xs'
          >
            {getRoleLabel(user.role)}
          </Badge>
        )}
        renderPoints={(user) => ({
          points: user.pointsEarned,
        })}
      />
      <LeaderboardCard<TopAffiliate>
        title='Top Affiliates'
        users={topAffiliates}
        isLoading={isLoading}
        icon={LuUsers}
        renderUserInfo={() => null}
        renderPoints={(user) => ({
          points: user.pointsEarned,
          subtitle: `${user.referralCount} referrals`,
        })}
      />
    </SimpleGrid>
  );
};
