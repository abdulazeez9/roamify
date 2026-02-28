'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Heading,
  Flex,
  Icon,
  Badge,
  Tabs,
} from '@chakra-ui/react';
import { PaginationControl } from '@/components/ui/pagination/PaginationControl';
import { useAdventures } from '@/hooks';
import { Unlock, Calendar, CheckCircle } from 'lucide-react';
import { AdventureResponseDto } from '@zagotours/types';
import { formatDate } from '@/utils/DateFormat';
import { AppLink } from '@/components/ui/link/AppLink';
import { Column, DataTable } from '../table/DataTable';
import { AdventureCardSkeleton } from '@/components/ui/card/Adventurecardskeleton';

export default function UpcomingAndCompletedAdventuresPage() {
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const limit = 10;

  // Fetch adventures
  const { data: adventuresResponse, isLoading } = useAdventures({
    page: 1,
    limit: 100,
  });

  const allAdventures = adventuresResponse?.data || [];

  // Filter only UNLOCKED adventures
  const unlockedAdventures = allAdventures.filter(
    (adventure: AdventureResponseDto) => adventure.access === 'UNLOCKED',
  );

  const currentDate = new Date();

  const upcomingAdventures = unlockedAdventures.filter(
    (adventure: AdventureResponseDto) => {
      const adventureDate = new Date(adventure.date);
      return adventureDate >= currentDate;
    },
  );

  // Filter completed adventures (past dates)
  const completedAdventures = unlockedAdventures.filter(
    (adventure: AdventureResponseDto) => {
      const adventureDate = new Date(adventure.date);
      return adventureDate < currentDate;
    },
  );

  // Pagination for upcoming
  const upcomingTotal = upcomingAdventures.length;
  const upcomingTotalPages = Math.ceil(upcomingTotal / limit);
  const upcomingStartIndex = (upcomingPage - 1) * limit;
  const upcomingEndIndex = upcomingStartIndex + limit;
  const paginatedUpcoming = upcomingAdventures.slice(
    upcomingStartIndex,
    upcomingEndIndex,
  );

  const upcomingPagination = {
    page: upcomingPage,
    limit,
    total: upcomingTotal,
    totalPages: upcomingTotalPages,
    hasNext: upcomingPage < upcomingTotalPages,
    hasPrev: upcomingPage > 1,
  };

  // Pagination for completed
  const completedTotal = completedAdventures.length;
  const completedTotalPages = Math.ceil(completedTotal / limit);
  const completedStartIndex = (completedPage - 1) * limit;
  const completedEndIndex = completedStartIndex + limit;
  const paginatedCompleted = completedAdventures.slice(
    completedStartIndex,
    completedEndIndex,
  );

  const completedPagination = {
    page: completedPage,
    limit,
    total: completedTotal,
    totalPages: completedTotalPages,
    hasNext: completedPage < completedTotalPages,
    hasPrev: completedPage > 1,
  };

  // Define table columns
  const columns: readonly Column<AdventureResponseDto>[] = [
    {
      label: 'Title',
      key: 'title',
      render: (value, row) => (
        <AppLink href={`/adventures/${row.id}`}>
          <Box
            fontWeight='semibold'
            color='primary'
            _hover={{ textDecoration: 'underline' }}
          >
            {value}
          </Box>
        </AppLink>
      ),
    },
    {
      label: 'Location',
      key: 'location',
    },
    {
      label: 'Date',
      key: 'date',
      render: (value) => (value ? formatDate(value) : 'N/A'),
    },
    {
      label: 'Days',
      key: 'days',
      render: (value) => `${value} ${value === 1 ? 'Day' : 'Days'}`,
    },
    {
      label: 'Price',
      key: 'price',
      render: (value) => `$${value}`,
    },
    {
      label: 'Level',
      key: 'level',
      render: (value) => (
        <Badge
          colorPalette={
            value === 'EASY'
              ? 'green'
              : value === 'MEDIUM'
                ? 'yellow'
                : value === 'HARD'
                  ? 'orange'
                  : 'red'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      label: 'Trip Type',
      key: 'tripType',
    },
    {
      label: 'Rating',
      key: 'rating',
      render: (value) => `${value.toFixed(1)} ⭐`,
    },
    {
      label: 'Status',
      key: 'status',
      render: (value) => (
        <Badge
          colorPalette={
            value === 'PUBLISHED' ? 'green' : value === 'DRAFT' ? 'gray' : 'red'
          }
        >
          {value}
        </Badge>
      ),
    },
  ] as const;

  return (
    <Container maxW='container.xl' py={10}>
      {/* Loading */}
      {isLoading && <AdventureCardSkeleton />}

      {/* Content */}
      {!isLoading && (
        <>
          {/* Upcoming Adventures Section */}
          <Box mb={12}>
            <Flex align='center' mb={4} gap={2}>
              <Icon as={Calendar} boxSize={6} color='blue.500' />
              <Heading size='xl' fontWeight='bold' color='gray.700'>
                Upcoming Adventures
              </Heading>
              <Badge colorPalette='blue' ml={2}>
                {upcomingTotal}
              </Badge>
            </Flex>

            {paginatedUpcoming.length === 0 ? (
              <Box
                p={8}
                textAlign='center'
                bg='gray.50'
                borderRadius='xl'
                color='gray.500'
              >
                No upcoming adventures available.
              </Box>
            ) : (
              <>
                <Box
                  borderWidth='1px'
                  borderColor='gray.200'
                  borderRadius='xl'
                  overflow='hidden'
                  bg='white'
                >
                  <DataTable columns={columns} data={paginatedUpcoming} />
                </Box>

                {upcomingPagination.totalPages > 1 && (
                  <PaginationControl
                    pagination={upcomingPagination}
                    onPageChange={setUpcomingPage}
                  />
                )}
              </>
            )}
          </Box>

          {/* Completed Adventures Section */}
          <Box>
            <Flex align='center' mb={4} gap={2}>
              <Icon as={CheckCircle} boxSize={6} color='green.500' />
              <Heading size='xl' fontWeight='bold' color='gray.700'>
                Completed Adventures
              </Heading>
              <Badge colorPalette='green' ml={2}>
                {completedTotal}
              </Badge>
            </Flex>

            {paginatedCompleted.length === 0 ? (
              <Box
                p={8}
                textAlign='center'
                bg='gray.50'
                borderRadius='xl'
                color='gray.500'
              >
                No completed adventures yet.
              </Box>
            ) : (
              <>
                <Box
                  borderWidth='1px'
                  borderColor='gray.200'
                  borderRadius='xl'
                  overflow='hidden'
                  bg='white'
                >
                  <DataTable columns={columns} data={paginatedCompleted} />
                </Box>

                {completedPagination.totalPages > 1 && (
                  <PaginationControl
                    pagination={completedPagination}
                    onPageChange={setCompletedPage}
                  />
                )}
              </>
            )}
          </Box>
        </>
      )}
    </Container>
  );
}
