"use client";

import {
  SimpleGrid,
  Container,
  Box,
  Center,
  Icon,
  Heading,
  Text,
} from "@chakra-ui/react";
import AdventureCard from "../ui/card/AdventureCard";
import Button from "../ui/button/Button";
import { Compass } from "lucide-react";
import { useAdventures } from "@/hooks";
import { AppLink } from "../ui/link/AppLink";
import { AdventureCardSkeleton } from "../ui/card/Adventurecardskeleton";

export const FeaturedAdventures = () => {
  const { data: response, isLoading } = useAdventures({ limit: 3 });

  const adventures = response?.data || [];

  return (
    <Container maxW="container.xl" my={8} px={{ base: 4, md: 6 }}>
      <Box textAlign="center" mb={8}>
        <Heading color="primary" size="2xl" mb={2}>
          Featured Adventures
        </Heading>
        <Text color="gray.600">
          Hand-picked experiences for your next journey
        </Text>
      </Box>

      {isLoading && (
        <SimpleGrid
          columns={{ base: 2, md: 3 }}
          rowGap={{ base: 6, md: 5 }}
          columnGap={{ base: 6, md: 8 }}
          width={{ base: "full", lg: "900px" }}
          mx="auto"
        >
          {Array.from({ length: 3 }).map((_, idx) => (
            <AdventureCardSkeleton key={idx} />
          ))}
        </SimpleGrid>
      )}

      {!isLoading && adventures.length === 0 && (
        <Box textAlign="center">No adventures found yet!</Box>
      )}

      <SimpleGrid
        columns={{ base: 2, md: 3 }}
        rowGap={{ base: 6, md: 5 }}
        columnGap={{ base: 6, md: 8 }}
        width={{ base: "full", lg: "900px" }}
        mx="auto"
      >
        {adventures.slice(0, 3).map((adventure) => (
          <AdventureCard key={adventure.id} adventure={adventure} />
        ))}
      </SimpleGrid>

      <Center mt={8}>
        <AppLink href="/adventures">
          <Button
            bg="secondary"
            color="dark"
            py="1"
            pr="4"
            _hover={{ bg: "secondary", opacity: 0.9 }}
          >
            <Icon as={Compass} mr="4" boxSize="3" />
            Explore All Adventures
          </Button>
        </AppLink>
      </Center>
    </Container>
  );
};
