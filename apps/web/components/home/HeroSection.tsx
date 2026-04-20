"use client";

import {
  AspectRatio,
  Box,
  Center,
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ResponsiveImage } from "../media/ResponsiveImage";
import Button from "../ui/button/Button";
import { ArrowRight } from "lucide-react";
import { useAuthSession } from "@/hooks";
import { AppLink } from "../ui/link/AppLink";

export const HeroSection = () => {
  const { isAuthenticated } = useAuthSession();

  return (
    <Box
      bg="primary"
      color="textPrimary"
      borderBottomRadius="3xl"
      borderTopRadius={{ base: "none", md: "3xl" }}
      p={{ base: 4, md: 10 }}
      pb={{ base: 5, md: "200px" }}
      mb={{ base: 5, md: "200px" }}
      position="relative"
    >
      <Stack
        textAlign="center"
        gap={5}
        align="center"
        pb={{ base: "20px", md: "30px" }}
      >
        <Center>
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            px={4}
            py={1}
            border="1px solid white"
            borderRadius="full"
            letterSpacing="widest"
          >
            ADVENTURE | DISCOVERY | FREEDOM
          </Text>
        </Center>

        <Heading
          size={{ base: "2xl", md: "4xl" }}
          lineHeight="1.2"
          maxW={{ base: "100%", md: "500px" }}
          overflowWrap="anywhere"
          wordBreak="break-word"
        >
          Every Journey Tells a Story. Start Yours Today.
        </Heading>

        <Text
          fontSize={{ base: "md", md: "lg" }}
          opacity={0.9}
          maxW={{ base: "100%", md: "500px" }}
          overflowWrap="anywhere"
          wordBreak="break-word"
        >
          Connect with travelers, discover hidden gems, and create memories that
          last forever.
        </Text>

        {!isAuthenticated && (
          <AppLink href="/register">
            <Button bg="secondary" color="dark" fontWeight="bold">
              Join the Community
              <Icon as={ArrowRight} ml={2} />
            </Button>
          </AppLink>
        )}
      </Stack>

      <Box
        width={{ base: "100%", md: "75%", lg: "65%" }}
        position={{ base: "relative", md: "absolute" }}
        bottom={{ base: 0, md: "-190px" }}
        left={{ base: 0, md: "50%" }}
        transform={{ base: "none", md: "translateX(-50%)" }}
        zIndex={10}
        mt={{ base: 5, md: 0 }}
      >
        <AspectRatio ratio={{ base: 21 / 9, md: 21 / 9 }}>
          <ResponsiveImage
            src="/images/home/home-hero.webp"
            alt="hero adventure image"
            width="100%"
            priority={true}
            loading="eager"
            height="100%"
            borderRadius="2xl"
            boxShadow="2xl"
          />
        </AspectRatio>
      </Box>
    </Box>
  );
};
