'use client';

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Grid,
  GridItem,
  Image,
  Separator,
  Center,
} from '@chakra-ui/react';
import { useRouter, useParams } from 'next/navigation';
import { FiEdit, FiImage, FiList, FiChevronLeft } from 'react-icons/fi';

import { useAdventure } from '@/hooks';
import {
  AdventureLevelLabels,
  TripTypeLabels,
  AdventureStatusLabels,
} from '@zagotours/types';
import { LoadingState } from '@/components/ui/LoadingState';
import { formatDate } from '@/utils/DateFormat';

export default function ViewAdventurePage() {
  const router = useRouter();
  const params = useParams();
  const adventureId = params.id as string;

  const { data: response, isLoading, isError } = useAdventure(adventureId);

  const adventure = response?.data;

  if (isLoading) {
    return <LoadingState message='Fetching adventure details...' />;
  }

  if (isError || !adventure) {
    return (
      <Container maxW='container.lg' py={20}>
        <Center flexDirection='column' gap={4}>
          <Heading size='md'>Adventure not found</Heading>
          <Button onClick={() => router.push('/admin/adventures')}>
            Return to List
          </Button>
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW='container.lg' py={8}>
      {/* Navigation & Actions */}
      <HStack justify='space-between' mb={6} wrap='wrap' gap={4}>
        <VStack align='start' gap={1}>
          <Button variant='ghost' size='sm' onClick={() => router.back()}>
            <FiChevronLeft style={{ marginRight: '8px' }} /> Back
          </Button>
          <Heading size='lg'>{adventure.title}</Heading>
        </VStack>

        <HStack gap={3}>
          <Button
            variant='outline'
            onClick={() => router.push(`/admin/adventures/${adventureId}/edit`)}
          >
            <FiEdit style={{ marginRight: '8px' }} /> Edit
          </Button>
          <Button
            variant='outline'
            onClick={() =>
              router.push(`/admin/adventures/${adventureId}/itinerary`)
            }
          >
            <FiList style={{ marginRight: '8px' }} />
            Itineraries ({adventure._count?.itineraries || 0})
          </Button>
          <Button
            variant='outline'
            onClick={() =>
              router.push(`/admin/adventures/${adventureId}/gallery`)
            }
          >
            <FiImage style={{ marginRight: '8px' }} />
            Gallery ({adventure._count?.gallery || 0})
          </Button>
        </HStack>
      </HStack>

      <Box bg='bg.panel' p={6} shadow='md' rounded='lg' borderWidth='1px'>
        <VStack gap={8} align='stretch'>
          {/* Hero Image */}
          {adventure.mediaUrl && (
            <Image
              src={adventure.mediaUrl}
              alt={adventure.title}
              h='400px'
              w='full'
              objectFit='cover'
              rounded='md'
            />
          )}

          {/* Quick Info Grid */}
          <Grid
            templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
            gap={6}
          >
            <GridItem>
              <Text
                fontSize='xs'
                color='fg.muted'
                textTransform='uppercase'
                fontWeight='bold'
              >
                Location
              </Text>
              <Text fontWeight='medium'>{adventure.location}</Text>
            </GridItem>

            <GridItem>
              <Text
                fontSize='xs'
                color='fg.muted'
                textTransform='uppercase'
                fontWeight='bold'
              >
                Price
              </Text>
              <Text fontWeight='bold' color='green.600' fontSize='lg'>
                ${adventure.price}
              </Text>
            </GridItem>

            <GridItem>
              <Text
                fontSize='xs'
                color='fg.muted'
                textTransform='uppercase'
                fontWeight='bold'
              >
                Duration
              </Text>
              <Text fontWeight='medium'>{adventure.days} days</Text>
            </GridItem>

            <GridItem>
              <Text
                fontSize='xs'
                color='fg.muted'
                textTransform='uppercase'
                fontWeight='bold'
              >
                Start Date
              </Text>
              <Text fontWeight='medium'>{formatDate(adventure.date)}</Text>
            </GridItem>

            <GridItem>
              <Text
                fontSize='xs'
                color='fg.muted'
                textTransform='uppercase'
                fontWeight='bold'
              >
                Rating
              </Text>
              <Text fontWeight='bold' color='yellow.500' fontSize='lg'>
                ⭐ {adventure.rating} / 5
              </Text>
            </GridItem>

            <GridItem>
              <Text
                fontSize='xs'
                color='fg.muted'
                textTransform='uppercase'
                fontWeight='bold'
              >
                Level
              </Text>
              <Badge colorPalette='blue'>
                {AdventureLevelLabels[
                  adventure.level as keyof typeof AdventureLevelLabels
                ] || adventure.level}
              </Badge>
            </GridItem>

            <GridItem>
              <Text
                fontSize='xs'
                color='fg.muted'
                textTransform='uppercase'
                fontWeight='bold'
              >
                Type
              </Text>
              <Badge colorPalette='purple'>
                {TripTypeLabels[
                  adventure.tripType as keyof typeof TripTypeLabels
                ] || adventure.tripType}
              </Badge>
            </GridItem>

            <GridItem>
              <Text
                fontSize='xs'
                color='fg.muted'
                textTransform='uppercase'
                fontWeight='bold'
              >
                Status
              </Text>
              <Badge
                colorPalette={adventure.status === 'DRAFT' ? 'gray' : 'green'}
              >
                {AdventureStatusLabels[
                  adventure.status as keyof typeof AdventureStatusLabels
                ] || adventure.status}
              </Badge>
            </GridItem>
          </Grid>

          <Separator />

          {/* Detailed Content */}
          <Box gap={4}>
            <Heading size='sm' mb={1}>
              Description
            </Heading>
            <Text lineHeight='tall' color='fg.subtle'>
              {adventure.description}
            </Text>
            <Heading size='sm' mb={1}>
              SafetyTips
            </Heading>
            <Text lineHeight='tall' color='fg.subtle'>
              {adventure.safetyTips}
            </Text>

            <Heading size='sm' mb={1}>
              Inclusions
            </Heading>
            <Text lineHeight='tall' color='fg.subtle'>
              {adventure.inclusions}
            </Text>
            <Heading size='sm' mb={1}>
              Exclusions
            </Heading>
            <Text lineHeight='tall' color='fg.subtle'>
              {adventure.exclusions}
            </Text>
            <Heading size='sm' mb={1}>
              Partner Detail
            </Heading>
            <Text lineHeight='tall' color='fg.subtle'>
              {adventure.partnerDescription}
            </Text>
          </Box>

          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
            {adventure.certification && (
              <Box>
                <Heading size='xs' mb={2} color='fg.muted'>
                  Certification Required
                </Heading>
                <Text fontSize='sm'>{adventure.certification}</Text>
              </Box>
            )}

            {adventure.gear && (
              <Box>
                <Heading size='xs' mb={2} color='fg.muted'>
                  Required Gear
                </Heading>
                <Text fontSize='sm'>{adventure.gear}</Text>
              </Box>
            )}
          </Grid>

          {/* Stats & Metadata */}
          <HStack gap={10} p={4} bg='bg.muted' rounded='md'>
            <Box>
              <Text fontSize='xs' color='fg.muted' fontWeight='bold'>
                Safety Score
              </Text>
              <Text fontWeight='bold' fontSize='xl'>
                {adventure.safetyScore}/100
              </Text>
            </Box>
            <Box>
              <Text fontSize='xs' color='fg.muted' fontWeight='bold'>
                Community Likes
              </Text>
              <Text fontWeight='bold' fontSize='xl'>
                {adventure._count?.likes || 0}
              </Text>
            </Box>
            <Box>
              <Text fontSize='xs' color='fg.muted' fontWeight='bold'>
                Access Type
              </Text>
              <Badge variant='surface'>{adventure.access}</Badge>
            </Box>
          </HStack>

          {/* Itinerary Preview */}
          {adventure.itineraries && adventure.itineraries.length > 0 && (
            <Box>
              <Heading size='sm' mb={4}>
                Itinerary Preview
              </Heading>
              <VStack align='stretch' gap={3}>
                {adventure.itineraries.slice(0, 3).map((itinerary: any) => (
                  <Box
                    key={itinerary.id}
                    p={4}
                    borderLeftWidth='4px'
                    borderLeftColor='blue.400'
                    bg='bg.subtle'
                    roundedRight='md'
                  >
                    <Text fontWeight='bold' fontSize='sm'>
                      Day {itinerary.dayNumber}: {itinerary.title}
                    </Text>
                    <Text fontSize='sm' color='fg.subtle' lineHeight={2}>
                      {itinerary.activityDetails}
                    </Text>
                  </Box>
                ))}
                {adventure.itineraries.length > 3 && (
                  <Button
                    variant='ghost'
                    size='sm'
                    alignSelf='flex-start'
                    onClick={() =>
                      router.push(`/admin/adventures/${adventureId}/itinerary`)
                    }
                  >
                    View all {adventure.itineraries.length} days...
                  </Button>
                )}
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>
    </Container>
  );
}
