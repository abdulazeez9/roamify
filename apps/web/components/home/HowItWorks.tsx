"use client";
import {
  Box,
  Center,
  Text,
  Stack,
  Heading,
  AvatarGroup,
  Avatar,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import React from "react";
import { AvatarImage } from "../media/AvatarImage";
import { Compass, Map, Users } from "lucide-react";
import { ResponsiveImage } from "../media/ResponsiveImage";
import { FeatureCard } from "../ui/card/FeatureCard";

// Updated advisors with generic images
const travelers = [
  {
    id: "traveler-1",
    src: "/images/avatars/traveler-1.webp",
    name: "Alex",
  },
  {
    id: "traveler-2",
    src: "/images/avatars/traveler-2.webp",
    name: "Jamie",
  },
  {
    id: "traveler-3",
    src: "/images/avatars/traveler-3.webp",
    name: "Taylor",
  },
];

// Updated card data
const cardData = [
  {
    heading: "Discover Unique Adventures",
    icon: Compass,
    description:
      "Browse through hand-picked experiences from hidden trails to cultural immersions. Every adventure is vetted for quality.",
  },
  {
    heading: "Plan Your Journey",
    icon: Map,
    description:
      "Get detailed insights about routes, guides, and conditions. Know exactly what to expect before you go.",
  },
  {
    heading: "Join the Community",
    icon: Users,
    description:
      "Connect with fellow travelers, share experiences, and embark on adventures together.",
  },
];

const resImageData = [
  "/images/adventures/jump.webp",
  "/images/adventures/mountain-climb.webp",
  "/images/adventures/snowboarding.webp",
  "/images/adventures/skydiving.webp",
];

export const HowItWorks = () => {
  return (
    <Box
      bg="surface"
      mb={{ base: 48, md: 32 }}
      borderRadius={{ base: "none", md: "4xl" }}
      py={10}
      px={{ base: 2, md: 10 }}
      pb={{ base: "150px", md: "200px" }}
      position="relative"
    >
      <Box maxW="container.xl" mx="auto" px={4}>
        <Stack
          textAlign="center"
          gap={4}
          align="center"
          mb={{ base: 12, md: 20 }}
        >
          <Center>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              px={4}
              py={1}
              borderWidth="1px"
              borderColor="secondary"
              borderRadius="full"
              letterSpacing="widest"
              bg="white"
              color="secondary"
              fontWeight="semibold"
            >
              YOUR JOURNEY, YOUR WAY
            </Text>
          </Center>

          <Heading
            size={{ base: "2xl", md: "4xl" }}
            color="primary"
            fontWeight="bolder"
          >
            Start Your Adventure in 3 Simple Steps
          </Heading>

          <Text
            fontSize={{ base: "md", md: "lg" }}
            opacity={0.9}
            maxW={{ base: "100%", md: "600px" }}
          >
            From discovery to departure - we make it easy to find and plan your
            next adventure
          </Text>
        </Stack>

        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 10, lg: 20 }}
          align="center"
          justify="center"
          width="full"
          maxW="1100px"
          mx="auto"
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} flex="1.2">
            {resImageData.map((img, i) => (
              <Box
                key={i}
                width="100%"
                display={{ base: i > 1 ? "none" : "block", md: "block" }}
                transform={{
                  base: "none",
                  md: i % 2 === 0 ? "translateY(-30px)" : "translateY(20px)",
                }}
              >
                <ResponsiveImage
                  src={img}
                  alt="how it work image"
                  width="100%"
                  borderRadius="xl"
                  objectFit="cover"
                  priority={i < 2}
                  containerProps={{
                    style: { aspectRatio: "4/3", minHeight: "220px" },
                  }}
                />
              </Box>
            ))}
          </SimpleGrid>

          <Stack gap={6} flex="1" textAlign="left" width="full">
            {cardData.map((card, idx) => (
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

      <Box
        width={{ base: "90%", md: "80%", lg: "70%" }}
        position="absolute"
        bottom="0"
        left="50%"
        transform="translate(-50%, 50%)"
        zIndex={10}
        bg="secondary"
        p={{ base: 6, md: 10 }}
        borderRadius="2xl"
        boxShadow="2xl"
        color="dark"
      >
        <Stack align="center" gap={6} textAlign="center">
          <AvatarGroup spaceX="-3">
            {travelers.map((traveler, idx) => (
              <Box
                as="span"
                key={idx}
                borderWidth="2px"
                borderColor="secondary"
                borderRadius="full"
              >
                <AvatarImage
                  src={traveler.src}
                  name={traveler.name}
                  id={traveler.id}
                />
              </Box>
            ))}
            <Avatar.Root id="traveler-more" bg="primary" color="white">
              <Avatar.Fallback fontSize="xs">2k+</Avatar.Fallback>
            </Avatar.Root>
          </AvatarGroup>
          <Text
            fontSize={{ base: "md", md: "xl", lg: "2xl" }}
            lineHeight="short"
            fontWeight="medium"
          >
            Join thousands of travelers discovering their next adventure with
            Roamify. Your journey starts here.
          </Text>
        </Stack>
      </Box>
    </Box>
  );
};
