'use client';
import { Box, Text, Stack, Heading, Icon, Flex } from '@chakra-ui/react';
import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/button/Button';
import { AppLink } from '../ui/link/AppLink';

export const EventHero = () => {
  return (
    <Box
      bg='primary'
      color='textPrimary'
      p={{ base: 4, md: 16 }}
      borderRadius={{ base: 'none', md: '3xl' }}
      borderBottomRadius={{ base: '3xl', md: '3xl' }}
    >
      <Stack textAlign='center' gap={6} align='center'>
        <Heading
          size={{ base: '2xl', md: '4xl' }}
          lineHeight='1.2'
          maxW={{ base: 'full', md: '700px' }}
          wordBreak='break-word'
        >
          Adventure Starts With Knowledge
        </Heading>

        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          opacity={0.9}
          maxW={{ base: 'full', md: '600px' }}
          wordBreak='break-word'
          mx='auto'
        >
          Join live sessions designed to make every future trip smarter, safer,
          and more connected.
        </Text>

        <Flex
          direction={{ base: 'column', md: 'row' }}
          align='center'
          justify='center'
          gap={4}
          w='full'
        >
          <Button
            onClick={() => {
              document.getElementById('join-event-section')?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
            bg='secondary'
            color='dark'
            fontWeight='bold'
            w='auto'
          >
            Join an event
            <Icon as={ArrowRight} ml={2} />
          </Button>

          <AppLink href='https://forms.gle/bpFRxCweT8ygcCW8A'>
            <Button
              bg='primary'
              color='white'
              fontWeight='bold'
              border='2px solid white'
              w='auto'
            >
              Host an event
              <Icon as={ArrowRight} ml={2} />
            </Button>
          </AppLink>
        </Flex>
      </Stack>
    </Box>
  );
};
