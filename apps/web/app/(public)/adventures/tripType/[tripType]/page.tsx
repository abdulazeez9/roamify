'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Container,
  Heading,
  SimpleGrid,
  Box,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';
import AdventureCard from '@/components/ui/card/AdventureCard';
import { useAdventures } from '@/hooks';
import { PaginationControl } from '@/components/ui/pagination/PaginationControl';
import { TripTypeLabels } from '@zagotours/types';
import { ArrowLeft } from 'lucide-react';
import { AppLink } from '@/components/ui/link/AppLink';
import { AdventureCardSkeleton } from '@/components/ui/card/Adventurecardskeleton';

export default function TripTypePage() {
  const params = useParams();
  const tripType = params?.tripType as string;

  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useAdventures({
    page,
    tripType,
  });

  const adventures = response?.data || [];
  const pagination = response?.pagination;
  const displayName =
    TripTypeLabels[tripType as keyof typeof TripTypeLabels] || tripType;

  return (
    <Container maxW='container.xl' py={10}>
      {/* Back button */}
      <AppLink href='/adventures'>
        <Flex
          align='center'
          gap={2}
          mb={6}
          color='primary'
          _hover={{ textDecoration: 'underline' }}
        >
          <Icon as={ArrowLeft} />
          <Text>Back to Adventures</Text>
        </Flex>
      </AppLink>

      {/* Header */}
      <Heading size='4xl' mb={8} color='primary'>
        {displayName}
      </Heading>

      {/* Loading state */}
      {isLoading && (
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          gap={{ base: 6, md: 3 }}
          columnGap={6}
          width='full'
          justifyItems='center'
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <AdventureCardSkeleton key={idx} />
          ))}
        </SimpleGrid>
      )}

      {/* Empty state */}
      {!isLoading && adventures.length === 0 && (
        <Box textAlign='center' py={10}>
          <Text fontSize='lg' color='gray.500'>
            No {displayName.toLowerCase()} adventures available yet.
          </Text>
        </Box>
      )}

      {/* Adventures grid */}
      {!isLoading && adventures.length > 0 && (
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          gap={{ base: 6, md: 3 }}
        >
          {adventures.map((adventure) => (
            <AdventureCard key={adventure.id} adventure={adventure} />
          ))}
        </SimpleGrid>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Box mt={8}>
          <PaginationControl pagination={pagination} onPageChange={setPage} />
        </Box>
      )}
    </Container>
  );
}
