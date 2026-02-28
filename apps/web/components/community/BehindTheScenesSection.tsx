'use client';

import { Box, Flex, Heading, Stack } from '@chakra-ui/react';
import { LifeBuoy, TreePalm, Wifi } from 'lucide-react';
import React from 'react';
import { FeatureCard } from '../ui/card/FeatureCard';
import { ResponsiveImage } from '../media/ResponsiveImage';

const cardInfo = [
  {
    heading: 'Real Experiences',
    icon: LifeBuoy,
    description:
      'Stories from travelers and professionals with lived experience.',
  },
  {
    heading: 'Shared Knowledge',
    icon: TreePalm,
    description:
      'Live sessions, discussions, and insights that help you make better travel decisions.',
  },
  {
    heading: 'Meaningful Connections',
    icon: Wifi,
    description:
      'Meet people building adventure into their lives, not just their feed.',
  },
];

export default function BehindTheScenesSection() {
  return (
    <Box
      bg='textPrimary'
      px={{ base: 4, md: 6 }}
      py={20}
      mx={5}
      my={9}
      borderRadius='xl'
    >
      <Heading
        size={{ base: '2xl', md: '4xl' }}
        color='primary'
        fontWeight='bold'
        textAlign='center'
        mb={{ base: 5, md: 16 }}
      >
        What Happens Inside
      </Heading>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify='center'
        align={{ base: 'stretch', md: 'stretch' }}
        gap={5}
      >
        <Box
          w={{ base: 'full', md: '300px' }}
          h={{ base: '200px', md: 'auto' }}
          position='relative'
        >
          <ResponsiveImage
            src='/images/community/community-what-to-expect-1.webp'
            alt='community image'
          />
        </Box>
        <Stack gap={6} flex='1' textAlign='left' maxW={{ lg: '500px' }}>
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
