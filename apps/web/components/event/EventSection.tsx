'use client';
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
  Text,
  Center,
} from '@chakra-ui/react';
import { EventResponseDto } from '@zagotours/types';
import React, { useMemo, useState } from 'react';
import { EventCard } from '../ui/card/EventCard';
import { SelectInput } from '../ui/input/SelectInput';
import { useEvents } from '@/hooks';
import { ErrorState } from '../ui/ErrorState';
import { EventCardSkeleton } from '../ui/card/Eventcardskeleton';

export default function EventSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const sectionWidth = { base: 'full', lg: '900px' };
  const { data, isLoading, isError, error } = useEvents();

  // Generate unique locations from events data
  const uniqueLocations = useMemo(() => {
    if (!data?.data) return [{ label: 'All Locations', value: '' }];

    const validLocations: string[] = [];
    data.data.forEach((event: EventResponseDto) => {
      if (event.location && typeof event.location === 'string') {
        validLocations.push(event.location);
      }
    });

    const uniqueLocs = [...new Set(validLocations)];

    return [
      { label: 'All Locations', value: '' },
      ...uniqueLocs.map((loc) => ({
        label: loc,
        value: loc,
      })),
    ];
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
    let events: EventResponseDto[] = data.data;

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

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [data, searchQuery, selectedLocation, selectedDate]);

  if (isError) return <ErrorState message={error?.message} />;

  return (
    <Container
      id='join-event-section'
      scrollMarginTop='100px'
      maxW='container.xl'
      py={10}
    >
      <VStack spaceY={12} align='stretch'>
        {/* --- UPCOMING EVENTS SECTION --- */}
        <Box>
          <Flex
            justify='space-between'
            align='center'
            width={sectionWidth}
            mx='auto'
            mb={6}
          >
            <Heading
              size={{ base: 'xl', md: '2xl' }}
              lineHeight='1.2'
              color='primary'
              fontWeight='bold'
            >
              Upcoming Events
            </Heading>

            <HStack display={{ base: 'none', md: 'flex' }} spaceX={4}>
              <SelectInput
                value={selectedLocation}
                onChange={(value) => setSelectedLocation(value)}
                placeholder='Location'
                options={uniqueLocations}
              />
              <SelectInput
                value={selectedDate}
                onChange={(value) => setSelectedDate(value)}
                placeholder='Date Range'
                options={dateOptions}
              />
            </HStack>
          </Flex>

          {/* Loading State for Upcoming Events */}
          {isLoading && (
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap={6}
              width={sectionWidth}
              mx='auto'
            >
              {Array.from({ length: 3 }).map((_, idx) => (
                <EventCardSkeleton key={idx} />
              ))}
            </SimpleGrid>
          )}

          {/* Empty State for Upcoming Events */}
          {!isLoading && upcomingEvents.length === 0 && (
            <Center width={sectionWidth} mx='auto' py={10}>
              <Text color='gray.500' fontSize='lg'>
                {searchQuery || selectedLocation || selectedDate
                  ? 'No upcoming events match your search'
                  : 'No upcoming events at the moment'}
              </Text>
            </Center>
          )}

          {/* Upcoming Events Grid */}
          {!isLoading && upcomingEvents.length > 0 && (
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap={{ base: 6, md: 5 }}
              rowGap={{ base: 6, md: 5 }}
              mx='auto'
              width={sectionWidth}
            >
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </SimpleGrid>
          )}
        </Box>

        {/* --- PAST EVENTS SECTION --- */}
        <Box>
          <Flex
            justify='space-between'
            align='center'
            width={sectionWidth}
            mx='auto'
            mb={6}
          >
            <Heading
              size={{ base: 'xl', md: '2xl' }}
              lineHeight='1.2'
              color='primary'
              fontWeight='bold'
            >
              Past Events
            </Heading>

            <HStack display={{ base: 'none', md: 'flex' }} spaceX={4}>
              <SelectInput
                value={selectedLocation}
                onChange={(value) => setSelectedLocation(value)}
                placeholder='Location'
                options={uniqueLocations}
              />
              <SelectInput
                value={selectedDate}
                onChange={(value) => setSelectedDate(value)}
                placeholder='Date Range'
                options={dateOptions}
              />
            </HStack>
          </Flex>

          {/* Loading State for Past Events */}
          {isLoading && (
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap={6}
              width={sectionWidth}
              mx='auto'
            >
              {Array.from({ length: 3 }).map((_, idx) => (
                <EventCardSkeleton key={idx} />
              ))}
            </SimpleGrid>
          )}

          {/* Empty State for Past Events */}
          {!isLoading && pastEvents.length === 0 && (
            <Center width={sectionWidth} mx='auto' py={10}>
              <Text color='gray.500' fontSize='lg'>
                {searchQuery || selectedLocation || selectedDate
                  ? 'No past events match your search'
                  : 'No past events to display'}
              </Text>
            </Center>
          )}

          {/* Past Events Grid */}
          {!isLoading && pastEvents.length > 0 && (
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap={6}
              width={sectionWidth}
              mx='auto'
              justifyItems='center'
            >
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </VStack>
    </Container>
  );
}
