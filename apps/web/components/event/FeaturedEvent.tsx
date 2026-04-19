"use client";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import Button from "../ui/button/Button"; // use your existing Button
import React from "react";
import { Calendar, MapPin, Users } from "lucide-react";

export default function FeaturedEvent() {
  return (
    <Box maxW="1200px" mx="auto" py={16} px={{ base: 4, md: 8 }}>
      <Flex
        direction={{ base: "column", lg: "row" }}
        bg="surface" // #F5F3FF — your brand surface
        borderRadius="3xl"
        overflow="hidden"
        boxShadow="0 8px 40px rgba(74,29,150,0.12)"
        borderWidth="1px"
        borderColor="purple.100"
      >
        {/* Left content */}
        <Box flex={1} p={{ base: 8, md: 12 }}>
          <Badge
            bg="secondary" // orange #F97316
            color="white"
            mb={4}
            px={3}
            py={1.5}
            borderRadius="full"
            fontSize="xs"
            fontWeight="bold"
          >
            Featured Event
          </Badge>

          <VStack align="start" gap={4}>
            <Heading size="2xl" color="dark">
              Annual Tech Summit 2024
            </Heading>

            <Text fontSize="md" color="gray.600" lineHeight="tall">
              Join industry leaders for a day of insights, networking, and
              innovation. Learn about the latest trends in technology and
              connect with peers.
            </Text>

            <HStack gap={4} color="purple.500" flexWrap="wrap">
              <Flex align="center" gap={1.5}>
                <Calendar size={15} />
                <Text fontSize="sm">May 15-16, 2024</Text>
              </Flex>
              <Flex align="center" gap={1.5}>
                <MapPin size={15} />
                <Text fontSize="sm">San Francisco, CA</Text>
              </Flex>
              <Flex align="center" gap={1.5}>
                <Users size={15} />
                <Text fontSize="sm">500+ attendees</Text>
              </Flex>
            </HStack>

            <Button
              bg="primary" // deep purple #4A1D96
              color="white"
              size="lg"
              mt={2}
              px={8}
              borderRadius="xl"
              fontWeight="bold"
              _hover={{ opacity: 0.9, transform: "translateY(-2px)" }}
              transition="all 0.2s"
            >
              Register Now
            </Button>
          </VStack>
        </Box>

        {/* Right decorative panel */}
        <Box
          flex={1}
          bg="primary" // deep purple
          p={12}
          display={{ base: "none", lg: "flex" }}
          alignItems="center"
          justifyContent="center"
          position="relative"
          overflow="hidden"
        >
          {/* Decorative circles */}
          <Box
            position="absolute"
            top="-60px"
            right="-60px"
            w="200px"
            h="200px"
            borderRadius="full"
            bg="whiteAlpha.100"
          />
          <Box
            position="absolute"
            bottom="-40px"
            left="-40px"
            w="160px"
            h="160px"
            borderRadius="full"
            bg="whiteAlpha.100"
          />
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="120px"
            h="120px"
            borderRadius="full"
            bg="secondary" // orange accent circle
            opacity={0.3}
          />
          <Text
            fontSize="7xl"
            textAlign="center"
            position="relative"
            zIndex={1}
          >
            🗓️
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
