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
  Badge,
  Text,
} from '@chakra-ui/react';
import AdventureCard from '../ui/card/AdventureCard';
import Button from '../ui/button/Button';
import { Compass, ShieldCheck } from 'lucide-react';
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
      // Search query filter
      const matchesSearch = searchQuery
        ? adventure.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          adventure.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          adventure.location?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      // Destination filter
      const matchesDestination = selectedDestination
        ? adventure.location
            ?.toLowerCase()
            .includes(selectedDestination.toLowerCase())
        : true;

      // Date filter
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

  // Show active filters
  const hasActiveFilters = searchQuery || selectedDestination || selectedDate;

  return (
    <Container maxW='container.xl' mt={5} mb={10}>
      {/* Header */}
      <Flex direction='column' align='center' justify='center' mb={8} gap={3}>
        <Flex align='center' gap={3}>
          <Icon as={ShieldCheck} color='secondary' boxSize={8} />
          <Heading
            size={{ base: '2xl', md: '3xl' }}
            fontWeight='bolder'
            textAlign='center'
            color='primary'
          >
            Verified Adventures
          </Heading>
        </Flex>
        <Text color='gray.600' maxW='600px' textAlign='center'>
          Every experience is vetted for quality, safety, and authenticity
        </Text>

        {/* Active filters display */}
        {hasActiveFilters && (
          <Badge bg='secondary' color='dark' px={4} py={2} borderRadius='full'>
            Filtering by:{' '}
            {[
              searchQuery && `"${searchQuery}"`,
              selectedDestination,
              selectedDate &&
                dates.find((d) => d.value === selectedDate)?.label,
            ]
              .filter(Boolean)
              .join(' • ')}
          </Badge>
        )}
      </Flex>

      {/* Loading state */}
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
        <Box textAlign='center' py={16} bg='surface' borderRadius='2xl'>
          <Icon as={Compass} boxSize={12} color='gray.400' mb={4} />
          <Heading size='lg' color='gray.600' mb={2}>
            {hasActiveFilters
              ? 'No adventures match your search'
              : 'No adventures found yet!'}
          </Heading>
          <Text color='gray.500'>
            {hasActiveFilters
              ? 'Try adjusting your filters or browse all adventures'
              : 'Check back soon for new experiences'}
          </Text>
        </Box>
      )}

      {/* Adventures grid */}
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

      {/* Load more button */}
      {!showPagination &&
        pagination &&
        filteredAdventures.length > 0 &&
        pagination.totalPages > 1 && (
          <Center mt={8}>
            <Button
              bg='primary'
              color='white'
              py='3'
              px='6'
              borderRadius='full'
              _hover={{ bg: 'primary', opacity: 0.9 }}
              onClick={() => setShowPagination(true)}
            >
              <Icon as={Compass} mr='2' boxSize='4' />
              Load More Adventures
            </Button>
          </Center>
        )}

      {/* Pagination */}
      {showPagination && pagination && (
        <Box mt={8}>
          <PaginationControl pagination={pagination} onPageChange={setPage} />
        </Box>
      )}
    </Container>
  );
}

// Helper for date labels
const dates = [
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Next Month', value: 'next-month' },
];
