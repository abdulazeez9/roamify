'use client';
import {
  Box,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  Center,
  Badge,
  Tabs,
} from '@chakra-ui/react';
import React, { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { EventCard } from '../ui/card/EventCard';
import { EventCardSkeleton } from '../ui/card/Eventcardskeleton';
import { SelectInput } from '../ui/input/SelectInput';
import { useEvents } from '@/hooks';
import { ErrorState } from '../ui/ErrorState';
import { SearchBar } from '../ui/search/Search';

export default function EventSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const { data, isLoading, isError, error } = useEvents();

  // Generate unique locations from events data
  const uniqueLocations = useMemo(() => {
    if (!data?.data) return [];

    const validLocations: string[] = [];
    data.data.forEach((event: any) => {
      if (event.location && typeof event.location === 'string') {
        validLocations.push(event.location);
      }
    });

    const uniqueLocs = [...new Set(validLocations)];
    return uniqueLocs.map((loc) => ({
      label: loc,
      value: loc,
    }));
  }, [data]);

  // Date range options
  const dateOptions = [
    { label: 'Any Time', value: '' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'Next Month', value: 'next-month' },
  ];

  const { upcomingEvents, pastEvents } = useMemo(() => {
    if (!data?.data) {
      return { upcomingEvents: [], pastEvents: [] };
    }

    const now = new Date();
    let events: any[] = data.data;

    // Apply filters
    events = events.filter((event) => {
      // Search query filter
      const matchesSearch = searchQuery
        ? event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      // Location filter
      const matchesLocation = selectedLocation
        ? event.location?.toLowerCase().includes(selectedLocation.toLowerCase())
        : true;

      // Date filter
      const matchesDate = selectedDate
        ? (() => {
            const eventDate = new Date(event.date);

            switch (selectedDate) {
              case 'week':
                const weekFromNow = new Date(now);
                weekFromNow.setDate(now.getDate() + 7);
                return eventDate >= now && eventDate <= weekFromNow;

              case 'month':
                const monthFromNow = new Date(now);
                monthFromNow.setMonth(now.getMonth() + 1);
                return eventDate >= now && eventDate <= monthFromNow;

              case 'next-month':
                const nextMonth = new Date(now);
                nextMonth.setMonth(now.getMonth() + 1);
                const nextMonthEnd = new Date(nextMonth);
                nextMonthEnd.setMonth(nextMonth.getMonth() + 1);
                return eventDate >= nextMonth && eventDate < nextMonthEnd;

              default:
                return true;
            }
          })()
        : true;

      return matchesSearch && matchesLocation && matchesDate;
    });

    const upcoming = events.filter((event) => new Date(event.date) >= now);
    const past = events.filter((event) => new Date(event.date) < now);

    // Sort by date
    upcoming.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    past.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ); // Most recent past first

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [data, searchQuery, selectedLocation, selectedDate]);

  if (isError) return <ErrorState message={error?.message} />;

  return (
    <Box id='events-section' py={16} bg='white'>
      <Container maxW='1200px'>
        <VStack gap={8} align='stretch'>
          {/* Header */}
          <VStack gap={2} textAlign='center'>
            <Heading size='2xl' color='gray.800'>
              Discover Events
            </Heading>
            <Text fontSize='lg' color='gray.600'>
              Find the perfect event for your interests and schedule
            </Text>
          </VStack>

          {/* Search and Filters */}
          <Flex
            direction={{ base: 'column', md: 'row' }}
            gap={4}
            bg='gray.50'
            p={6}
            borderRadius='xl'
            align='center'
          >
            S
            <Box flex={2}>
              <SearchBar
                placeholder='Search events...'
                value={searchQuery}
                onSearch={setSearchQuery}
                bg='white'
                width='100%'
              />
            </Box>
            <Box flex={1}>
              <SelectInput
                value={selectedLocation}
                onChange={setSelectedLocation}
                options={uniqueLocations}
                placeholder='All Locations'
                width='100%'
              />
            </Box>
            <Box flex={1}>
              <SelectInput
                value={selectedDate}
                onChange={setSelectedDate}
                options={dateOptions}
                placeholder='Date Range'
                width='100%'
              />
            </Box>
          </Flex>

          {/* Active Filters */}
          {(searchQuery || selectedLocation || selectedDate) && (
            <Flex gap={2} flexWrap='wrap'>
              <Text color='gray.600' mr={2}>
                Active filters:
              </Text>
              {searchQuery && (
                <Badge colorScheme='blue' px={3} py={1} borderRadius='full'>
                  Search: {searchQuery}
                </Badge>
              )}
              {selectedLocation && (
                <Badge colorScheme='green' px={3} py={1} borderRadius='full'>
                  Location: {selectedLocation}
                </Badge>
              )}
              {selectedDate && (
                <Badge colorScheme='purple' px={3} py={1} borderRadius='full'>
                  Date:{' '}
                  {dateOptions.find((d) => d.value === selectedDate)?.label}
                </Badge>
              )}
            </Flex>
          )}

          {/* Events Tabs */}
          <Box>
            <Tabs.Root
              defaultValue='upcoming'
              variant='enclosed'
              colorScheme='blue'
            >
              <Tabs.List mb={6}>
                <Tabs.Trigger value='upcoming'>
                  Upcoming Events ({upcomingEvents.length})
                </Tabs.Trigger>
                <Tabs.Trigger value='past'>
                  Past Events ({pastEvents.length})
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value='upcoming'>
                {isLoading ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                    {[1, 2, 3].map((i) => (
                      <EventCardSkeleton key={i} />
                    ))}
                  </SimpleGrid>
                ) : upcomingEvents.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                    {upcomingEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Center py={12}>
                    <VStack gap={2}>
                      <Calendar size={48} color='#CBD5E0' />
                      <Text color='gray.500' fontSize='lg'>
                        No upcoming events match your criteria
                      </Text>
                      <Text color='gray.400'>
                        Try adjusting your filters or check back later
                      </Text>
                    </VStack>
                  </Center>
                )}
              </Tabs.Content>

              <Tabs.Content value='past'>
                {isLoading ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                    {[1, 2, 3].map((i) => (
                      <EventCardSkeleton key={i} />
                    ))}
                  </SimpleGrid>
                ) : pastEvents.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                    {pastEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Center py={12}>
                    <VStack gap={2}>
                      <Calendar size={48} color='#CBD5E0' />
                      <Text color='gray.500' fontSize='lg'>
                        No past events match your criteria
                      </Text>
                    </VStack>
                  </Center>
                )}
              </Tabs.Content>
            </Tabs.Root>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
