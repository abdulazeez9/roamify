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
import AdventureCard from '@/components/ui/card/AdventureCard';
import { EventCard } from '@/components/ui/card/EventCard';
import { PaginationControl } from '@/components/ui/pagination/PaginationControl';
import { LoadingState } from '@/components/ui/LoadingState';
import { useAdventures, useEvents } from '@/hooks';
import { Calendar, Compass } from 'lucide-react';
import { AdventureResponseDto, EventResponseDto } from '@zagotours/types';
import { AdventureCardSkeleton } from '@/components/ui/card/Adventurecardskeleton';
import { EventCardSkeleton } from '@/components/ui/card/Eventcardskeleton';

export default function UpcomingAdventuresAndEventsPage() {
  const [toursPage, setToursPage] = useState(1);
  const [eventsPage, setEventsPage] = useState(1);

  const toursLimit = 6;
  const eventsLimit = 6;

  // Fetch adventures
  const { data: toursResponse, isLoading: toursLoading } = useAdventures({
    page: toursPage,
    limit: toursLimit,
  });

  // Fetch events
  const { data: eventsResponse, isLoading: eventsLoading } = useEvents({
    page: eventsPage,
    limit: eventsLimit,
  });

  // Filter upcoming tours (adventures with future dates)
  const allTours = toursResponse?.data || [];
  const upcomingTours = allTours.filter((tour: AdventureResponseDto) => {
    if (!tour.date) return true;
    return new Date(tour.date) >= new Date();
  });

  // Filter upcoming events (events with future dates)
  const allEvents = eventsResponse?.data || [];
  const upcomingEvents = allEvents.filter((event: EventResponseDto) => {
    if (!event.date) return true;
    return new Date(event.date) >= new Date();
  });

  const toursPagination = toursResponse?.pagination;
  const eventsPagination = eventsResponse?.pagination;

  return (
    <Container maxW='container.xl' py={10}>
      <VStack gap={16} align='stretch'>
        {/* ========== UPCOMING TOURS SECTION ========== */}
        <Box>
          {/* Header */}
          <Flex align='center' mb={6} gap={3}>
            <Icon as={Compass} boxSize={8} color='primary' />
            <Heading lineHeight='1.2' fontWeight='bold' color='primary'>
              Upcoming Tours
            </Heading>
          </Flex>

          {/* Loading */}
          {toursLoading && <AdventureCardSkeleton />}

          {/* Empty */}
          {!toursLoading && upcomingTours.length === 0 && (
            <Box
              p={8}
              textAlign='center'
              bg='gray.50'
              borderRadius='xl'
              color='gray.500'
            >
              No upcoming tours available at the moment.
            </Box>
          )}

          {/* Tours Grid */}
          {!toursLoading && upcomingTours.length > 0 && (
            <>
              <SimpleGrid
                columns={{ base: 1, md: 3 }}
                gap={{ base: 6, md: 4 }}
                rowGap={5}
                justifyItems='center'
              >
                {upcomingTours.map((tour) => (
                  <AdventureCard key={tour.id} adventure={tour} />
                ))}
              </SimpleGrid>

              {/* Pagination - Always show if there are multiple pages */}
              {toursPagination && toursPagination.totalPages > 1 && (
                <PaginationControl
                  pagination={toursPagination}
                  onPageChange={setToursPage}
                />
              )}
            </>
          )}
        </Box>

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
          {!eventsLoading && upcomingEvents.length === 0 && (
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
          {!eventsLoading && upcomingEvents.length > 0 && (
            <>
              <SimpleGrid
                columns={{ base: 1, md: 3 }}
                gap={{ base: 6, md: 4 }}
                justifyItems='center'
              >
                {upcomingEvents.map((event: EventResponseDto) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </SimpleGrid>

              {/* Pagination - Always show if there are multiple pages */}
              {eventsPagination && eventsPagination.totalPages > 1 && (
                <PaginationControl
                  pagination={eventsPagination}
                  onPageChange={setEventsPage}
                />
              )}
            </>
          )}
        </Box>
      </VStack>
    </Container>
  );
}
