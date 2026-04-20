"use client";
import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { Users, ShieldCheck, Globe } from "lucide-react";
import React from "react";
import { FeatureCard } from "../ui/card/FeatureCard";
import { ResponsiveImage } from "../media/ResponsiveImage";

const cardInfo = [
  {
    heading: "Unfiltered Insights",
    icon: Globe,
    description:
      "No fluff. Just honest advice from a community that has actually been there.",
  },
  {
    heading: "Safety First Culture",
    icon: ShieldCheck,
    description:
      "Access exclusive safety ratings and peer-vetted itineraries for total peace of mind.",
  },
  {
    heading: "The Global Network",
    icon: Users,
    description:
      "Connect with fellow roamers aged 18-35 to plan group trips or solo meetups.",
  },
];

export default function RoamifyDifference() {
  return (
    <Box
      bg="textPrimary"
      px={{ base: 4, md: 6 }}
      py={20}
      mx={5}
      my={9}
      borderRadius="xl"
    >
      <Heading
        size={{ base: "2xl", md: "4xl" }}
        color="primary"
        textAlign="center"
        mb={{ base: 5, md: 16 }}
      >
        Why Roam With Us?
      </Heading>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="center"
        align="stretch"
        gap={10}
      >
        <Box
          w={{ base: "full", md: "400px" }}
          h={{ base: "250px", md: "auto" }}
          position="relative"
        >
          <ResponsiveImage
            src="/images/community/roam-with-us.webp"
            alt="Roamify Community"
          />
        </Box>
        <Stack gap={8} flex="1" maxW={{ lg: "500px" }}>
          {cardInfo.map((card, idx) => (
            <FeatureCard
              key={idx}
              icon={card.icon}
              heading={card.heading}
              description={card.description}
            />
          ))}
        </Stack>
      </Flex>
    </Box>
  );
}
