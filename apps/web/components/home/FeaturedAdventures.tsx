'use client';

import {
  SimpleGrid,
  Container,
  Box,
  Center,
  Icon,
  Grid,
} from '@chakra-ui/react';
import AdventureCard from '../ui/card/AdventureCard';
import Button from '../ui/button/Button';
import { Grip } from 'lucide-react';
import { useAdventures } from '@/hooks';
import { AppLink } from '../ui/link/AppLink';
import { AdventureCardSkeleton } from '../ui/card/Adventurecardskeleton';

export const FeaturedAdventures = () => {
  const { data: response, isLoading } = useAdventures({ limit: 6 });

  const adventures = response?.data || [];

  return (
    <Container maxW='container.xl' my={8} px={{ base: 4, md: 6 }}>
      {isLoading && (
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          rowGap={{ base: 6, md: 5 }}
          columnGap={{ base: 6, md: 8 }}
          width={{ base: 'full', lg: '900px' }}
          mx='auto'
        >
          {Array.from({ length: 3 }).map((_, idx) => (
            <AdventureCardSkeleton key={idx} />
          ))}
        </SimpleGrid>
      )}

      {!isLoading && adventures.length === 0 && (
        <Box>No adventures found yet!.</Box>
      )}

      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        rowGap={{ base: 6, md: 5 }}
        columnGap={{ base: 6, md: 8 }}
        width={{ base: 'full', lg: '900px' }}
        mx='auto'
      >
        {adventures.map((adventure) => (
          <AdventureCard key={adventure.id} adventure={adventure} />
        ))}
      </SimpleGrid>

      {/* Show if total adventures > 6 */}
      <Center mt={6}>
        <AppLink href='/adventures'>
          <Button bg='dark' color='white' py='1' pr='4'>
            <Icon as={Grip} mr='4' boxSize='3' />
            Load More Tours
          </Button>
        </AppLink>
      </Center>
    </Container>
  );
};
