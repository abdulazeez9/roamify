"use client";
import { AvatarImage } from "@/components/media/AvatarImage";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import {
  Card,
  Text,
  Stack,
  HStack,
  Box,
  Flex,
  AvatarGroup,
  Avatar,
  AspectRatio,
  Badge,
} from "@chakra-ui/react";
import { EventResponseDto } from "@roamify/types";
import { Calendar, MapPin, Timer } from "lucide-react";
import { AppLink } from "../link/AppLink";
import { formatDate } from "@/utils/DateFormat";
import { formatTime } from "@/utils/TimeFormat";
import { optimizeCloudinaryImage } from "@/utils/CloudinaryImageOptimize";

interface EventCardProps {
  event: EventResponseDto;
}

export const EventCard = ({ event }: EventCardProps) => {
  const attendees =
    event.registrations?.map((reg) => ({
      name: reg.user.name,
      src: reg.user.image ? optimizeCloudinaryImage(reg.user.image) : undefined,
    })) || [];

  return (
    <Card.Root
      w="full"
      variant="elevated"
      overflow="hidden"
      borderRadius="2xl"
      role="group"
      transition="all 0.3s ease"
      bg="white"
      borderWidth="1px"
      borderColor="purple.100"
      _hover={{
        md: {
          boxShadow: "0 8px 30px rgba(74, 29, 150, 0.15)",
          transform: "translateY(-4px)",
          borderColor: "purple.300",
        },
      }}
    >
      {/* IMAGE */}
      <Box position="relative" overflow="hidden" p="2.5" pb="0">
        <AspectRatio ratio={4 / 3}>
          <ResponsiveImage
            src={event.mediaUrl as string}
            alt={event.title}
            width="100%"
            height="100%"
            borderRadius="xl"
            objectFit="cover"
            containerProps={{
              transition: "transform 0.5s ease",
              _groupHover: { transform: "scale(1.05)" },
            }}
          />
        </AspectRatio>

        {/* Gradient overlay */}
        <Box
          position="absolute"
          top="2.5"
          left="2.5"
          right="2.5"
          height="45%"
          borderTopRadius="xl"
          bgGradient="to-b"
          gradientFrom="blackAlpha.300"
          gradientTo="transparent"
          pointerEvents="none"
          zIndex="1"
        />
      </Box>

      {/* BODY */}
      <AppLink href={`/events/${event.id}`}>
        <Card.Body px="3" pt="3" pb="2" gap="1">
          <HStack
            justify="space-between"
            fontSize="2xs"
            fontWeight="bold"
            mb="1"
            color="purple.400"
          >
            <Flex align="center" gap={1}>
              <Calendar size={11} />
              <Text>{formatDate(event.date)}</Text>
            </Flex>
            <Flex align="center" gap={1}>
              <Timer size={11} />
              <Text>{formatTime(event.date)}</Text>
            </Flex>
          </HStack>

          <Card.Title
            fontWeight="bold"
            fontSize={{ base: "xs", md: "sm" }}
            lineHeight="tight"
            color="dark"
            css={{
              WebkitLineClamp: 2,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {event.title}
          </Card.Title>

          <Stack gap="1.5" pt="1">
            <Flex align="center" gap={2} width="full" color="gray.400">
              <MapPin size={12} style={{ flexShrink: 0 }} />
              <Text fontSize="2xs" truncate flex={1}>
                {event.location}
              </Text>
            </Flex>

            <Flex align="center" gap={1.5} wrap="wrap">
              <Badge
                bg="purple.50"
                px={2}
                py={0.5}
                borderRadius="md"
                fontSize="2xs"
                fontWeight="bold"
                color="primary"
                borderWidth="1px"
                borderColor="purple.100"
              >
                {event?.pricing}
              </Badge>
            </Flex>
          </Stack>
        </Card.Body>
      </AppLink>

      <Card.Footer px="3" pt="0" pb="3">
        <Flex
          w="full"
          borderTop="1px solid"
          borderColor="purple.50"
          pt={2.5}
          justify="space-between"
          align="center"
        >
          <AvatarGroup size="xs">
            {attendees.slice(0, 3).map((person, i) => (
              <AvatarImage key={i} name={person.name} src={person.src || ""} />
            ))}
            {attendees.length > 3 && (
              <Avatar.Root size="xs">
                <Avatar.Fallback fontSize="9px" bg="purple.100" color="primary">
                  +{attendees.length - 3}
                </Avatar.Fallback>
              </Avatar.Root>
            )}
          </AvatarGroup>

          {/* Attendee count label */}
          {attendees.length > 0 && (
            <Text fontSize="2xs" color="purple.400" fontWeight="medium">
              {attendees.length} going
            </Text>
          )}
        </Flex>
      </Card.Footer>
    </Card.Root>
  );
};
