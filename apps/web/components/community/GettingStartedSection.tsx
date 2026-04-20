"use client";
import { Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { DynamicImageCard } from "../ui/card/DynamicImageCard";

const cardInfo = [
  {
    url: "/images/community/passport.webp",
    title: (
      <Text fontSize="xl" fontWeight="bold" color="primary" textAlign="center">
        Claim Your <br /> Passport
      </Text>
    ),
    content:
      "Create your unique traveler profile and let the world know what kind of adventures fuel your soul.",
  },
  {
    url: "/images/community/tribe.webp",
    title: (
      <Text fontSize="xl" fontWeight="bold" color="primary" textAlign="center">
        Find Your <br /> Tribe
      </Text>
    ),
    content:
      "Filter by interest—from mountain trekking to city hopping. Discover travelers who match your frequency.",
  },
];

export default function GettingStartedSection() {
  return (
    <Stack mx={{ base: 0, md: 4 }} my={24} py={15} gap={10}>
      <Heading size="2xl" color="primary" textAlign="center">
        Start Your Journey
      </Heading>
      <Flex
        gap={7}
        direction={{ base: "column", md: "row" }}
        justify="center"
        align="center"
        px={4}
      >
        {cardInfo.map((card, idx) => (
          <DynamicImageCard
            key={idx}
            image={card.url}
            title={card.title}
            description={card.content}
            maxWidth="350px"
          />
        ))}
      </Flex>
    </Stack>
  );
}
