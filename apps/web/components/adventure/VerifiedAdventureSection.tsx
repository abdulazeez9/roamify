'use client';

import { useState, useMemo } from 'react';
import {
  SimpleGrid,
  Container,
  Box,
  Center,
  Icon,
  Heading,
  Flex,
} from '@chakra-ui/react';
import AdventureCard from '../ui/card/AdventureCard';
import Button from '../ui/button/Button';
import { Grip, Verified } from 'lucide-react';
import { useAdventures } from '@/hooks';
import { PaginationControl } from '../ui/pagination/PaginationControl';
import { AdventureCardSkeleton } from '../ui/card/Adventurecardskeleton';

interface VerifiedAdventureSectionProps {
  searchQuery?: string;
  selectedDestination?: string;
  selectedDate?: string;
}

export default function VerifiedAdventureSection({
  searchQuery = '',
  selectedDestination = '',
  selectedDate = '',
}: VerifiedAdventureSectionProps) {
  const [page, setPage] = useState(1);
  const [showPagination, setShowPagination] = useState(false);

  const limit = 6;

  const { data: response, isLoading } = useAdventures({
    page,
    limit,
  });

  const adventures = response?.data || [];
  const pagination = response?.pagination;
  // Filter adventures based on search query and filters
  const filteredAdventures = useMemo(() => {
    return adventures.filter((adventure) => {
      // Search query filter (searches in title, description, location, etc.)
      const matchesSearch = searchQuery
        ? adventure.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          adventure.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          adventure.location?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      // Destination filter - matches against location field
      const matchesDestination = selectedDestination
        ? adventure.location
            ?.toLowerCase()
            .includes(selectedDestination.toLowerCase())
        : true;

      // Date filter - matches against the adventure.date field
      const matchesDate = selectedDate
        ? (() => {
            const adventureDate = new Date(adventure.date);
            const now = new Date();

            switch (selectedDate) {
              case 'week':
                const weekFromNow = new Date(now);
                weekFromNow.setDate(now.getDate() + 7);
                return adventureDate >= now && adventureDate <= weekFromNow;

              case 'month':
                const monthFromNow = new Date(now);
                monthFromNow.setMonth(now.getMonth() + 1);
                return adventureDate >= now && adventureDate <= monthFromNow;

              case 'next-month':
                const nextMonth = new Date(now);
                nextMonth.setMonth(now.getMonth() + 1);
                const nextMonthEnd = new Date(nextMonth);
                nextMonthEnd.setMonth(nextMonth.getMonth() + 1);
                return (
                  adventureDate >= nextMonth && adventureDate < nextMonthEnd
                );

              default:
                return true;
            }
          })()
        : true;

      return matchesSearch && matchesDestination && matchesDate;
    });
  }, [adventures, searchQuery, selectedDestination, selectedDate]);

  return (
    <Container maxW='container.xl' mt={5}>
      {/* Header */}
      <Flex align='center' justify='center' mb={6} gap={5}>
        <Heading
          size={{ base: '2xl', md: '4xl' }}
          lineHeight='1.2'
          fontWeight='bolder'
          textAlign='center'
          color='primary'
        >
          Verified Adventures
        </Heading>
        <Icon as={Verified} />
      </Flex>

      {isLoading && (
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          rowGap={{ base: 6, md: 5 }}
          columnGap={{ base: 6, md: 8 }}
          width={{ base: 'full', lg: '900px' }}
          mx='auto'
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <AdventureCardSkeleton key={idx} />
          ))}
        </SimpleGrid>
      )}

      {/* Empty state */}
      {!isLoading && filteredAdventures.length === 0 && (
        <Box textAlign='center' py={10}>
          <Heading size='md' color='gray.500'>
            {searchQuery || selectedDestination || selectedDate
              ? 'No adventures found matching your search'
              : 'No adventures found yet!'}
          </Heading>
        </Box>
      )}

      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        rowGap={{ base: 6, md: 5 }}
        columnGap={{ base: 6, md: 8 }}
        width={{ base: 'full', lg: '900px' }}
        mx='auto'
        mt={4}
        p={0}
      >
        {filteredAdventures.map((adventure) => (
          <AdventureCard key={adventure.id} adventure={adventure} />
        ))}
      </SimpleGrid>

      {!showPagination && pagination && filteredAdventures.length > 0 && (
        <Center mt={6}>
          <Button
            bg='dark'
            color='white'
            py='1'
            pr='4'
            onClick={() => setShowPagination(true)}
          >
            <Icon as={Grip} mr='4' boxSize='3' />
            Load More Tours
          </Button>
        </Center>
      )}

      {/* Pagination */}
      {showPagination && pagination && (
        <PaginationControl pagination={pagination} onPageChange={setPage} />
      )}
    </Container>
  );
}
