'use client';
import {
  SimpleGrid,
  Box,
  Text,
  Stack,
  HStack,
  Icon,
  Badge,
} from '@chakra-ui/react';
import { LuTrendingUp, LuTrendingDown } from 'react-icons/lu';

export interface StatCardData {
  label: string;
  value: string | number;
  trend?: string;
  isUpward?: boolean;
  icon: React.ElementType;
}

interface StatCardProps extends StatCardData {}

const StatCard = ({
  label,
  value,
  trend,
  icon,
  isUpward = true,
}: StatCardProps) => (
  <Box
    bg='white'
    p={3}
    borderRadius='2xl'
    border='1px solid'
    borderColor='gray.100'
    boxShadow='sm'
    transition='transform 0.2s, box-shadow 0.2s'
    _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
  >
    <Stack gap={2}>
      <HStack justify='space-between' align='flex-start'>
        <Box p={2.5} bg='green.50' borderRadius='xl' color='green.600'>
          <Icon as={icon} boxSize={6} />
        </Box>
        {trend && (
          <Badge
            colorPalette={isUpward ? 'green' : 'red'}
            variant='subtle'
            borderRadius='full'
            px={2}
            py={0.5}
            display='flex'
            alignItems='center'
            gap={1}
          >
            <Icon as={isUpward ? LuTrendingUp : LuTrendingDown} boxSize={3} />
            {trend}
          </Badge>
        )}
      </HStack>

      <Stack gap={1}>
        <Text
          fontSize='sm'
          color='gray.500'
          fontWeight='medium'
          letterSpacing='tight'
        >
          {label}
        </Text>
        <Text fontSize='2xl' fontWeight='bold' color='gray.900'>
          {value}
        </Text>
      </Stack>
    </Stack>
  </Box>
);

interface StatsGridProps {
  stats: StatCardData[];
  isLoading?: boolean;
}

export const StatsGrid = ({ stats, isLoading }: StatsGridProps) => {
  if (isLoading) {
    return (
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
        {[1, 2, 3, 4].map((i) => (
          <Box key={i} bg='gray.100' h='150px' borderRadius='2xl' />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </SimpleGrid>
  );
};
