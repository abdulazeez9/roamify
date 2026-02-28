'use client';

import { useState } from 'react';
import {
  SimpleGrid,
  Container,
  Box,
  Heading,
  Flex,
  Icon,
  VStack,
} from '@chakra-ui/react';
import { EventCard } from '@/components/ui/card/EventCard';
import { PaginationControl } from '@/components/ui/pagination/PaginationControl';
import { useEvents } from '@/hooks';
import { Calendar, Clock } from 'lucide-react';
import { EventResponseDto } from '@zagotours/types';
import { EventCardSkeleton } from '@/components/ui/card/Eventcardskeleton';

export default function EventsPage() {
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

  const limit = 6;

  // Fetch all events
  const { data: eventsResponse, isLoading: eventsLoading } = useEvents({
    page: 1,
    limit: 100, // Fetch more to split client-side
  });

  const allEvents = eventsResponse?.data || [];
  const currentDate = new Date();

  // Split events into upcoming and past
  const upcomingEvents = allEvents.filter((event: EventResponseDto) => {
    if (!event.date) return false;
    return new Date(event.date) >= currentDate;
  });

  const pastEvents = allEvents.filter((event: EventResponseDto) => {
    if (!event.date) return false;
    return new Date(event.date) < currentDate;
  });

  // Client-side pagination for upcoming events
  const upcomingTotal = upcomingEvents.length;
  const upcomingTotalPages = Math.ceil(upcomingTotal / limit);
  const upcomingStartIndex = (upcomingPage - 1) * limit;
  const upcomingEndIndex = upcomingStartIndex + limit;
  const paginatedUpcomingEvents = upcomingEvents.slice(
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

  // Client-side pagination for past events
  const pastTotal = pastEvents.length;
  const pastTotalPages = Math.ceil(pastTotal / limit);
  const pastStartIndex = (pastPage - 1) * limit;
  const pastEndIndex = pastStartIndex + limit;
  const paginatedPastEvents = pastEvents.slice(pastStartIndex, pastEndIndex);

  const pastPagination = {
    page: pastPage,
    limit,
    total: pastTotal,
    totalPages: pastTotalPages,
    hasNext: pastPage < pastTotalPages,
    hasPrev: pastPage > 1,
  };

  return (
    <Container maxW='container.xl' py={10}>
      <VStack gap={16} align='stretch'>
        {/* ========== UPCOMING EVENTS SECTION ========== */}
        <Box>
          {/* Header */}
          <Flex align='center' mb={6} gap={3}>
            <Icon as={Calendar} boxSize={8} color='primary' />
            <Heading lineHeight='1.2' fontWeight='bold' color='primary'>
              Upcoming Events
            </Heading>
          </Flex>

          {/* Loading */}
          {eventsLoading && <EventCardSkeleton />}

          {/* Empty */}
          {!eventsLoading && paginatedUpcomingEvents.length === 0 && (
            <Box
              p={8}
              textAlign='center'
              bg='gray.50'
              borderRadius='xl'
              color='gray.500'
            >
              No upcoming events available at the moment.
            </Box>
          )}

          {/* Events Grid */}
          {!eventsLoading && paginatedUpcomingEvents.length > 0 && (
            <>
              <SimpleGrid
                columns={{ base: 1, md: 3 }}
                gap={{ base: 6, md: 4 }}
                justifyItems='center'
              >
                {paginatedUpcomingEvents.map((event: EventResponseDto) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </SimpleGrid>

              {/* Pagination - Always show if there are multiple pages */}
              {upcomingPagination.totalPages > 1 && (
                <PaginationControl
                  pagination={upcomingPagination}
                  onPageChange={setUpcomingPage}
                />
              )}
            </>
          )}
        </Box>

        {/* ========== PAST EVENTS SECTION ========== */}
        <Box>
          {/* Header */}
          <Flex align='center' mb={6} gap={3}>
            <Icon as={Clock} boxSize={8} color='gray.600' />
            <Heading lineHeight='1.2' fontWeight='bolde' color='gray.600'>
              Past Events
            </Heading>
          </Flex>

          {/* Loading */}
          {eventsLoading && <EventCardSkeleton />}

          {/* Empty */}
          {!eventsLoading && paginatedPastEvents.length === 0 && (
            <Box
              p={8}
              textAlign='center'
              bg='gray.50'
              borderRadius='xl'
              color='gray.500'
            >
              No past events to display.
            </Box>
          )}

          {/* Events Grid */}
          {!eventsLoading && paginatedPastEvents.length > 0 && (
            <>
              <SimpleGrid
                columns={{ base: 1, md: 3 }}
                gap={{ base: 6, md: 4 }}
                justifyItems='center'
              >
                {paginatedPastEvents.map((event: EventResponseDto) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </SimpleGrid>

              {/* Pagination - Always show if there are multiple pages */}
              {pastPagination.totalPages > 1 && (
                <PaginationControl
                  pagination={pastPagination}
                  onPageChange={setPastPage}
                />
              )}
            </>
          )}
        </Box>
      </VStack>
    </Container>
  );
}
