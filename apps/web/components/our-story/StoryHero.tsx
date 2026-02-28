'use client';

import {
  AspectRatio,
  Box,
  Center,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import { ResponsiveImage } from '../media/ResponsiveImage';

export const StoryHero = () => {
  return (
    <Box
      bg='primary'
      color='textPrimary'
      borderRadius={{ base: 'none', md: '3xl' }}
      borderBottomRadius={{ base: '3xl', md: '3xl' }}
      p={{ base: 4, md: 16 }}
    >
      <Stack textAlign='center' gap={6} align='center'>
        <Center>
          <Text
            fontSize={{ base: 'xs', md: 'sm' }}
            px={4}
            py={1}
            border='1px solid white'
            borderRadius='full'
            letterSpacing='widest'
            fontWeight='medium'
          >
            SAFE | SPONTANEOUS | SUSTAINABLE
          </Text>
        </Center>

        <Heading
          size={{ base: '2xl', md: '4xl' }}
          lineHeight='1.2'
          maxW={{ base: 'full', md: '500px' }}
          wordBreak='break-word'
        >
          Extreme adrenaline without the “what-ifs”
        </Heading>

        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          opacity={0.9}
          maxW={{ base: 'full', md: '500px' }}
          wordBreak='break-word'
          mx='auto'
          mb='10px'
        >
          Adventure travel is meant to feel exciting, not uncertain. We’re
          building a network where every trip is trusted, transparent, and
          transformative.
        </Text>
      </Stack>

      <Box display={{ base: 'block', md: 'none' }}>
        <AspectRatio ratio={{ base: 21 / 9, md: 21 / 9 }}>
          <ResponsiveImage
            src='/images/adventures/tripType/skiing.webp'
            alt='home page banner image'
            width='100%'
            priority={true}
            loading='eager'
            height='100%'
            borderRadius='2xl'
            boxShadow='2xl'
          />
        </AspectRatio>
      </Box>
    </Box>
  );
};
