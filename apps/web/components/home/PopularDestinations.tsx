'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { MapPin, TrendingUp } from 'lucide-react';

const POPULAR_DESTINATIONS = [
  { name: 'Bali, Indonesia', travelers: '2.3k+', flag: '🇮🇩' },
  { name: 'Machu Picchu, Peru', travelers: '1.8k+', flag: '🇵🇪' },
  { name: 'Banff, Canada', travelers: '1.5k+', flag: '🇨🇦' },
  { name: 'Santorini, Greece', travelers: '1.2k+', flag: '🇬🇷' },
  { name: 'Kyoto, Japan', travelers: '1.1k+', flag: '🇯🇵' },
  { name: 'Cape Town, SA', travelers: '950+', flag: '🇿🇦' },
  { name: 'Queenstown, NZ', travelers: '890+', flag: '🇳🇿' },
  { name: 'Dolomites, Italy', travelers: '820+', flag: '🇮🇹' },
];

export const PopularDestinations = () => {
  return (
    <Box bg='surface' py={{ base: 10, md: 16 }} mt={8}>
      <Container maxW='container.xl'>
        <VStack gap={8}>
          <Box textAlign='center'>
            <HStack justify='center' mb={2}>
              <Icon as={TrendingUp} color='secondary' />
              <Text color='secondary' fontWeight='semibold'>
                TRENDING NOW
              </Text>
            </HStack>
            <Heading color='primary' size='2xl' mb={3}>
              Popular Destinations
            </Heading>
            <Text color='gray.600' maxW='600px' mx='auto'>
              Join fellow travelers exploring these amazing locations around the
              world
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} width='full'>
            {POPULAR_DESTINATIONS.map((dest, idx) => (
              <Box
                key={idx}
                bg='white'
                p={4}
                borderRadius='lg'
                boxShadow='sm'
                _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
                transition='all 0.2s'
                cursor='pointer'
              >
                <HStack justify='space-between'>
                  <HStack>
                    <Text fontSize='2xl'>{dest.flag}</Text>
                    <VStack align='start' gap={0}>
                      <Text fontWeight='bold'>{dest.name}</Text>
                      <HStack color='gray.500' fontSize='sm'>
                        <Icon as={MapPin} size='md' />
                        <Text>{dest.travelers} travelers</Text>
                      </HStack>
                    </VStack>
                  </HStack>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};
