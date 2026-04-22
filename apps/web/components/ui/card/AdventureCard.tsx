"use client";

import {
  Card,
  Badge,
  Text,
  Flex,
  Icon,
  Box,
  IconButton,
  AspectRatio,
  RatingGroup,
} from "@chakra-ui/react";
import { CheckCircleIcon, Heart } from "lucide-react";
import { ResponsiveImage } from "../../media/ResponsiveImage";
import { AdventureDetailResponseDto } from "@roamify/types";
import Button from "../button/Button";
import { AppLink } from "../link/AppLink";
import { usePermissions, useToggleLikeAdventure } from "@/hooks";
import { useRouter } from "next/navigation";
import { launchConfetti } from "@/utils/confetti";
import { toaster } from "../toaster";

const AdventureCard = ({
  adventure,
}: {
  adventure: AdventureDetailResponseDto;
}) => {
  const nights = adventure.days > 1 ? adventure.days - 1 : 0;
  const router = useRouter();
  const { mutate: toggleLike } = useToggleLikeAdventure();
  const { isAuthenticated } = usePermissions();

  const handleWhatsAppBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    launchConfetti();

    toaster.create({
      title: "Booking Successful!",
      description: "Your adventure has been reserved.",
      type: "success",
      duration: 3000,
      closable: true,
    });
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    toggleLike(adventure.id);
  };

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
      {/* IMAGE SECTION */}
      <Box position="relative" overflow="hidden" p="2.5" pb="0">
        <AspectRatio ratio={4 / 3}>
          <ResponsiveImage
            src={adventure.mediaUrl || ""}
            alt={adventure.title}
            width="100%"
            height="100%"
            borderRadius="xl"
            objectFit="cover"
            objectPosition="top"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 280px"
            containerProps={{
              transition: "transform 0.5s ease",
              _groupHover: { transform: "scale(1.05)" },
            }}
          />
        </AspectRatio>

        {/* Gradient overlay for better badge readability */}
        <Box
          position="absolute"
          top="2.5"
          left="2.5"
          right="2.5"
          height="50%"
          borderTopRadius="xl"
          bgGradient="to-b"
          gradientFrom="blackAlpha.400"
          gradientTo="transparent"
          pointerEvents="none"
          zIndex="1"
        />

        {/* Badges & Heart */}
        <Flex
          position="absolute"
          top="5"
          left="5"
          right="5"
          justify="flex-end"
          gap="2"
          zIndex="2"
        >
          {adventure.isVerified && (
            <Badge
              px="2"
              py="0.5"
              borderRadius="full"
              variant="solid"
              bg="rgba(74,29,150,0.85)"
              color="white"
              display="flex"
              alignItems="center"
              fontSize="2xs"
              mr="auto"
              backdropFilter="blur(4px)"
            >
              Verified <Icon as={CheckCircleIcon} ml="1" boxSize="3" />
            </Badge>
          )}

          <IconButton
            aria-label="Like"
            size="xs"
            variant="ghost"
            onClick={handleLikeClick}
            bg="whiteAlpha.800"
            borderRadius="full"
            backdropFilter="blur(4px)"
            _hover={{ bg: "white", transform: "scale(1.1)" }}
          >
            <Icon
              as={Heart}
              boxSize="3.5"
              color={adventure?.isLiked ? "red.500" : "gray.400"}
              fill={adventure?.isLiked ? "red.500" : "none"}
            />
          </IconButton>
        </Flex>
      </Box>

      <AppLink href={`/adventures/${adventure.id}`}>
        <Card.Body px="3" pt="5" pb="2" gap="0.5" position="relative">
          {/* Rating pill */}
          <Flex
            position="absolute"
            top="0"
            left="4"
            transform="translateY(-50%)"
            bg="white"
            px="2"
            py="0.5"
            borderRadius="full"
            boxShadow="0 2px 8px rgba(74,29,150,0.18)"
            alignItems="center"
            zIndex="3"
            borderWidth="1px"
            borderColor="purple.100"
          >
            <RatingGroup.Root
              count={5}
              value={adventure.rating}
              readOnly
              allowHalf
              size="xs"
            >
              <RatingGroup.HiddenInput />
              <RatingGroup.Control
                aria-hidden="true"
                css={{
                  '& [data-part="item"]': { padding: "2px" },
                  '& [data-part="item"][data-highlighted]': {
                    color: "#F97316",
                  },
                }}
              />
            </RatingGroup.Root>

            <Text fontWeight="bold" fontSize="2xs" ml="1" color="purple.700">
              {adventure.rating.toFixed(1)}
            </Text>
          </Flex>

          <Text
            fontWeight="bold"
            fontSize={{ base: "xs", md: "sm" }}
            lineHeight="tight"
            mt="1"
            color="dark"
            css={{
              WebkitLineClamp: 2,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {adventure.title}
          </Text>
          <Card.Description
            color="purple.400"
            fontSize="2xs"
            fontWeight="medium"
          >
            {adventure.days} Days / {nights} {nights === 1 ? "Night" : "Nights"}
          </Card.Description>
        </Card.Body>
      </AppLink>

      <Card.Footer px="3" pt="0" pb="3">
        <Flex
          w="full"
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
          gap={{ base: "2", md: "0" }}
          borderTop="1px solid"
          borderColor="purple.50"
          pt="2.5"
        >
          {/* Price */}
          <Box>
            <Text
              as="span"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
              color="primary"
            >
              ${adventure.price}
            </Text>
            <Text as="span" color="gray.400" fontSize="2xs" ml="1">
              / person
            </Text>
          </Box>

          {/* Book Now button */}
          <Button
            onClick={handleWhatsAppBooking}
            bg="secondary"
            color="white"
            size="xs"
            px={{ base: "3", md: "4" }}
            py={{ base: "1.5", md: "2" }}
            borderRadius="lg"
            fontWeight="bold"
            fontSize="xs"
            w={{ base: "full", md: "auto" }}
            _hover={{ bg: "orange.500", transform: "scale(1.02)" }}
            transition="all 0.2s"
          >
            Book Now
          </Button>
        </Flex>
      </Card.Footer>
    </Card.Root>
  );
};

export default AdventureCard;
