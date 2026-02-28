'use client';
import { Box, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { FeatureCard } from '../ui/card/FeatureCard';
import { Check, HandHeart, Smile } from 'lucide-react';
import { FiPocket } from 'react-icons/fi';
import { HighlightCard } from '../ui/card/HighlightCard';

const cardData = [
  {
    icon: FiPocket,
    description: 'Being prepared is a superpower ',
  },
  {
    icon: HandHeart,
    description: 'You love adventure. ',
  },
  {
    icon: Smile,
    description: 'We give you the knowledge to enjoy it with confidence',
  },
];

export default function Benefits() {
  return (
    <Box my={5}>
      <Heading
        size={{ base: '2xl', md: '4xl' }}
        lineHeight='1.2'
        color='primary'
        textAlign='center'
        fontWeight='bold'
        my={10}
      >
        Why Join
      </Heading>

      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        gap={{ base: 6, md: 3 }}
        width={{ base: 'full', md: '900px' }}
        justifyItems='center'
        mx='auto'
      >
        {cardData.map((data, idx) => (
          <HighlightCard
            key={idx}
            icon={data.icon}
            description={data.description}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
