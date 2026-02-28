'use client';

import { Flex, Heading, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { DynamicImageCard } from '../ui/card/DynamicImageCard';

const cardInfo = [
  {
    url: '/images/community/community-getting-started-1.webp',
    title: (
      <Text
        fontSize={{ base: 'md', md: 'xl' }}
        fontWeight='bold'
        color='primary'
        textAlign='center'
      >
        Sign up & <br /> introduce yourself
      </Text>
    ),
    content:
      'Share who you are and the kinds of adventures you care about. Profiles help others understand your travel style before they reach out.',
  },
  {
    url: '/images/community/community-getting-started-2.webp',
    title: (
      <Text
        fontSize={{ base: 'md', md: 'xl' }}
        fontWeight='bold'
        color='primary'
        textAlign='center'
      >
        Explore by your <br /> adventure type
      </Text>
    ),
    content:
      'Find people interested in safaris, hiking, climbing, or other experiences you care about Discover others who match your pace and mindset',
  },
];

export default function GettingStartedSection() {
  return (
    <Stack
      mx={{ base: 0, md: 4 }}
      my={24}
      bg={{ base: 'primary', md: 'white' }}
      px={{ base: 2, md: 6 }}
      py={{ base: 6, md: 15 }}
      gap={10}
      borderRadius={{ base: '3xl', md: '3xl' }}
      borderWidth='1px'
      borderColor='gray.200'
    >
      <Heading
        size={{ base: '2xl', md: '4xl' }}
        color={{ base: 'gray.200', md: 'primary' }}
        fontWeight='bold'
        textAlign='center'
      >
        Getting Started
      </Heading>

      <Flex
        gap={{ base: 6, md: 7 }}
        direction={{ base: 'column', md: 'row' }}
        maxW={{ lg: '1000px', xl: '1200px' }}
        w='100%'
        mx='auto'
        justify='center'
        align='center'
        px={4}
      >
        {cardInfo.map((card, idx) => (
          <DynamicImageCard
            key={idx}
            image={card.url}
            title={card.title}
            description={card.content}
            maxWidth={{ base: '100%', md: '350px' }}
          />
        ))}
      </Flex>
    </Stack>
  );
}
