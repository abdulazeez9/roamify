import { Box, Center, Flex, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { DynamicImageCard } from '../ui/card/DynamicImageCard';

const cardInfo = [
  {
    url: '/images/community/community-what-to-expect-1.webp',
    content: (
      <Text textAlign='center'>
        <Text as='span' fontWeight='bold' color='primary'>
          Travelers
        </Text>{' '}
        who value preparation as much as excitement
      </Text>
    ),
  },
  {
    url: '/images/community/community-what-to-expect-2.webp',
    content: (
      <Text textAlign='center'>
        <Text as='span' fontWeight='bold' color='primary'>
          Operators
        </Text>{' '}
        and
        <Text as='span' ml={2} fontWeight='bold' color='primary'>
          Advisors
        </Text>{' '}
        who understand what really happens on the ground
      </Text>
    ),
  },
  {
    url: '/images/community/community-what-to-expect-3.webp',
    content: (
      <Text textAlign='center'>
        <Text as='span' fontWeight='bold' color='primary'>
          Conversations
        </Text>{' '}
        that make future trips safer, smoother, and more meaningful
      </Text>
    ),
  },
];

export default function WhatToExpectSection() {
  return (
    <Box py={10}>
      {' '}
      <VStack mb={10} gap={5}>
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          fontWeight='semibold'
          textAlign='center'
        >
          This isn’t about photos or hype. <br /> It’s a space for people who{' '}
          <br /> want more from their travels
        </Text>

        <Center>
          <Text
            fontSize={{ base: 'xs', md: 'sm' }}
            px={4}
            py={1}
            border='1px solid gray'
            borderRadius='full'
            letterSpacing='widest'
            color='primary'
            fontWeight='bold'
          >
            What You’ll Find
          </Text>
        </Center>
      </VStack>
      <Flex
        gap={6}
        direction={{ base: 'column', md: 'row' }}
        mx='auto'
        justify='center'
        align='center'
        px={4}
        width='100%'
      >
        {cardInfo.map((card, idx) => (
          <DynamicImageCard
            key={idx}
            image={card.url}
            description={card.content}
            maxWidth={{ base: '100%', md: '250px' }}
          />
        ))}
      </Flex>
    </Box>
  );
}
