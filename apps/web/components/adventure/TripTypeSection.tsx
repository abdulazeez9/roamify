'use client';

import { SimpleGrid, Container, Heading } from '@chakra-ui/react';
import { TripTypeCard } from '../ui/card/TripTypeCard';
import { TripType, TripTypeLabels } from '@zagotours/types';
import { useAdventureTripTypeCounts } from '@/hooks';

const tripTypeImageMap: Record<TripType, string> = {
  [TripType.HIKING]: '/images/adventures/tripType/hiking.webp',
  [TripType.KAYAKING]: '/images/adventures/tripType/kayaking.webp',
  [TripType.CANOEING]: '/images/adventures/tripType/canoeing.webp',
  [TripType.SNOWBOARDING]: '/images/adventures/tripType/snowboarding.webp',
  [TripType.TREKKING]: '/images/adventures/tripType/trekking.webp',
  [TripType.SKIING]: '/images/adventures/tripType/skiing.webp',
  [TripType.SKYDIVING]: '/images/adventures/tripType/skydiving.webp',
  [TripType.SAFARIS]: '/images/adventures/tripType/safari.webp',
  [TripType.CLIMBING]: '/images/adventures/tripType/mountain-climbing.webp',
  [TripType.JUMPING]: '/images/adventures/tripType/base-jumping.webp',
  [TripType.RAFTING]: '/images/adventures/tripType/rafting.webp',
};

export default function TripTypeSection() {
  const { data: response } = useAdventureTripTypeCounts();
  const counts = response?.data as Record<TripType, number> | undefined;

  const tripTypes = Object.entries(TripTypeLabels).map(([key, label]) => {
    const typeKey = key as TripType;
    return {
      key: typeKey,
      name: label,
      count: counts?.[typeKey] ?? 0,
      image: tripTypeImageMap[typeKey],
    };
  });

  return (
    <Container maxW='container.lg' py={10}>
      <Heading
        mb={6}
        size={{ base: '2xl', md: '4xl' }}
        lineHeight='1.2'
        textAlign='center'
      >
        Adventures
      </Heading>

      <SimpleGrid
        columns={{ base: 1, md: 5 }}
        gap={{ base: 4 }}
        rowGap={5}
        maxW={{ lg: '1000px', xl: '1200px' }}
        mx='auto'
        px={4}
      >
        {tripTypes.map((t) => (
          <TripTypeCard
            key={t.key}
            type={t.key}
            label={t.name}
            count={t.count}
            imageUrl={t.image}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}
