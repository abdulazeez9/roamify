'use client';

import { useState } from 'react';
import {
  Card,
  Badge,
  Text,
  Flex,
  Icon,
  HStack,
  Box,
  Button,
  RatingGroup,
} from '@chakra-ui/react';
import {
  BadgeCheck,
  Headset,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ResponsiveImage } from '../../media/ResponsiveImage';
import { AdventureDetailResponseDto } from '@zagotours/types';
import { LuStar } from 'react-icons/lu';

const ItineraryCard = ({
  adventure,
}: {
  adventure: AdventureDetailResponseDto;
}) => {
  const [expandedStates, setExpandedStates] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleReadMore = (id: string) => {
    setExpandedStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      {adventure.itineraries.map((itinerary) => {
        const isExpanded = expandedStates[itinerary.id] || false;

        return (
          <Card.Root
            w={{ base: 'full', md: '300px' }}
            h='fit-content'
            minH='400px'
            overflow='hidden'
            _hover={{ boxShadow: 'md' }}
            transition='all 0.3s ease-in-out'
            borderRadius='3xl'
            key={itinerary.id}
            my={5}
          >
            <Box position='relative' h='180px' p='3' flexShrink={0}>
              <ResponsiveImage
                src={itinerary.imageUrl || ''}
                alt={itinerary.title}
                width='100%'
                height='100%'
                borderRadius='3xl'
              />
            </Box>

            <Card.Body p='4' display='flex' flexDirection='column' gap={3}>
              <Card.Title fontWeight='bold' fontSize='xl'>
                Day {itinerary.dayNumber}
              </Card.Title>

              <HStack gap={2}>
                <Box bg='green.600' p={1} borderRadius='sm'>
                  <RatingGroup.Root
                    count={5}
                    value={adventure?.rating}
                    readOnly
                    allowHalf
                    size='xs'
                  >
                    <RatingGroup.HiddenInput />
                    <RatingGroup.Control
                      css={{
                        '& svg': {
                          color: 'white !important',
                          fill: 'white !important',
                          stroke: 'white !important',
                        },
                        '& [data-part="item"]': { padding: '1px' },
                      }}
                    />
                  </RatingGroup.Root>
                </Box>
                <Text fontWeight='bold' fontSize='xs' ml='1' color='gray.600'>
                  {' '}
                  {adventure.rating.toFixed(1)}
                </Text>
              </HStack>

              {/* Badges with wrap and gap fixed */}
              <Flex wrap='wrap' gap={2} w='full'>
                <Badge
                  variant='surface'
                  colorPalette='blue'
                  borderRadius='full'
                  px={2}
                  py={1}
                >
                  <HStack gap={1}>
                    <Icon as={BadgeCheck} size='sm' />
                    <Text fontSize='xs'>Certified</Text>
                  </HStack>
                </Badge>
                <Badge
                  variant='surface'
                  colorPalette='green'
                  borderRadius='full'
                  px={2}
                  py={1}
                >
                  <HStack gap={1}>
                    <Icon as={Headset} size='sm' />
                    <Text fontSize='xs'>Support</Text>
                  </HStack>
                </Badge>
                <Badge
                  variant='surface'
                  colorPalette='orange'
                  borderRadius='full'
                  px={2}
                  py={1}
                >
                  <HStack gap={1}>
                    <Icon as={ShieldCheck} size='sm' />
                    <Text fontSize='xs'>Safety</Text>
                  </HStack>
                </Badge>
              </Flex>

              {/* Expandable Description Area */}
              <Box mt={2}>
                <Text
                  color='gray.600'
                  fontSize='sm'
                  lineHeight='tall'
                  lineClamp={isExpanded ? undefined : 3}
                >
                  {itinerary.activityDetails}
                </Text>

                <Button
                  variant='ghost'
                  size='xs'
                  mt={1}
                  p={0}
                  color='blue.600'
                  _hover={{ bg: 'transparent', textDecoration: 'underline' }}
                  onClick={() => toggleReadMore(itinerary.id)}
                >
                  {isExpanded ? 'Show Less' : 'Read More'}
                  <Icon
                    as={isExpanded ? ChevronUp : ChevronDown}
                    ml={1}
                    size='sm'
                  />
                </Button>
              </Box>
            </Card.Body>
          </Card.Root>
        );
      })}
    </>
  );
};

export default ItineraryCard;
