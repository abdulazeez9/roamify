'use client';
import {
  Box,
  Center,
  Text,
  Stack,
  Heading,
  Flex,
  SimpleGrid,
} from '@chakra-ui/react';
import React from 'react';
import { Compass, Heart, Camera, Globe2 } from 'lucide-react';
import { FeatureHighlightCard } from '../ui/card/FeatureHighlightCard';

const cardData = [
  {
    title: 'DISCOVER',
    image: '/images/home/discover-section.webp',
    description:
      'Find hidden gems and off-the-beaten-path destinations that most travelers never get to experience.',
    rightIcon: Compass,
  },
  {
    title: 'CONNECT',
    image: '/images/home/connect-section.webp',
    description:
      'Meet like-minded adventurers, share stories, and build friendships that last a lifetime.',
    rightIcon: Heart,
  },
  {
    title: 'EXPLORE',
    image: '/images/home/explore-section.webp',
    description:
      'Go beyond the guidebook with authentic local experiences and unique cultural immersions.',
    rightIcon: Camera,
  },
  {
    title: 'SHARE',
    image: '/images/home/share-section.webp',
    description:
      'Document your journey, share tips, and inspire others to embark on their own adventures.',
    rightIcon: Globe2,
  },
];

export const WhyRoamify = () => {
  return (
    <Box py={{ base: 10, md: 20 }}>
      <Stack
        position='relative'
        textAlign='center'
        gap={16}
        align='center'
        maxW='container.xl'
        mx='auto'
        px={4}
      >
        <Stack gap={3} align='center'>
          <Center>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              px={4}
              py={1}
              border='1px solid'
              borderColor='secondary'
              borderRadius='full'
              letterSpacing='widest'
              textTransform='uppercase'
              fontWeight='medium'
              color='secondary'
            >
              Why Choose Us
            </Text>
          </Center>

          <Heading
            size={{ base: '2xl', md: '4xl' }}
            lineHeight='1.2'
            color='primary'
            fontWeight='bolder'
          >
            More Than Just Travel
          </Heading>

          <Text fontSize='lg' maxW='600px' color='gray.600'>
            We're building a community of explorers who believe that the best
            journeys are shared
          </Text>
        </Stack>

        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={10}
          align='center'
          justify='center'
          width='full'
        >
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            gap={6}
            width={{ base: 'full', lg: '1000px' }}
          >
            {cardData.map((card, index) => (
              <FeatureHighlightCard
                key={index}
                title={card.title}
                description={card.description}
                imageSrc={card.image}
                rightIcon={card.rightIcon}
              />
            ))}
          </SimpleGrid>
        </Flex>
      </Stack>
    </Box>
  );
};
