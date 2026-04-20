"use client";

import { SimpleGrid, Container, Heading, Box } from "@chakra-ui/react";
import { TripTypeCard } from "../ui/card/TripTypeCard";
import { TripType, TripTypeLabels } from "@roamify/types";
import { useAdventureTripTypeCounts } from "@/hooks";

const tripTypeImageMap: Record<TripType, string> = {
  [TripType.HIKING]: "/images/adventures/tripType/hiking.webp",
  [TripType.KAYAKING]: "/images/adventures/tripType/kayaking.webp",
  [TripType.CANOEING]: "/images/adventures/tripType/canoeing.webp",
  [TripType.SNOWBOARDING]: "/images/adventures/tripType/snowboarding.webp",
  [TripType.TREKKING]: "/images/adventures/tripType/trekking.webp",
  [TripType.SKIING]: "/images/adventures/tripType/skiing.webp",
  [TripType.SKYDIVING]: "/images/adventures/tripType/skydiving.webp",
  [TripType.SAFARIS]: "/images/adventures/tripType/safari.webp",
  [TripType.CLIMBING]: "/images/adventures/tripType/mountain-climbing.webp",
  [TripType.JUMPING]: "/images/adventures/tripType/base-jumping.webp",
  [TripType.RAFTING]: "/images/adventures/tripType/rafting.webp",
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
    <Container maxW="container.xl" py={6}>
      <Box textAlign="center" mb={8}>
        <Heading color="primary" size="2xl" mb={2}>
          Browse by Activity
        </Heading>
      </Box>

      <SimpleGrid
        columns={{ base: 1, md: 3, lg: 5 }}
        gap={4}
        rowGap={6}
        maxW="1200px"
        mx="auto"
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
