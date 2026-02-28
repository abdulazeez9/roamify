'use client';

import { StoryHero } from '@/components/our-story/StoryHero';
import TransformationSection from '@/components/our-story/TransformationSection';
import PurposeSection from '@/components/our-story/PurposeSection';
import { ScrollProgressSteps } from '@/components/ui/stepper/scroll-progress-step';

import { Box, Heading, Text, Stack, Center, Icon } from '@chakra-ui/react';
import React from 'react';
import Button from '@/components/ui/button/Button';
import { AppLink } from '@/components/ui/link/AppLink';
import { ArrowRight } from 'lucide-react';
import { useAuthSession } from '@/hooks';
import Image from 'next/image';

export const mySteps = [
  {
    content: (
      <Box>
        <Stack
          gap={4}
          border='1px solid'
          borderColor='gray.200'
          borderRadius='2xl'
          p={{ base: 4, md: 10 }}
          bg='white'
          shadow='sm'
          mb={10}
          textAlign='left'
        >
          <Heading
            size={{ base: 'xl', md: '2xl' }}
            color='primary'
            letterSpacing='tight'
          >
            Hi, I'm Esther 👋
          </Heading>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            Good to have you here.
          </Text>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            Welcome to the Zago side.
          </Text>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            Before Zago Tours, I ran Zippa Marketing, connecting thousands of
            travel professionals across 70+ countries.
          </Text>

          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            I was the person people called when things went wrong: a traveler in
            trouble, an operator panicking, a trip that suddenly felt unsafe.
          </Text>
        </Stack>
        <Box height='400px' width='100%' borderRadius='xl' overflow='hidden'>
          <Image
            src='/images/events/esther-picture.webp'
            alt='Esther'
            width={800}
            height={300}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: '50% 20%',
            }}
          />
        </Box>
      </Box>
    ),
  },
  {
    content: (
      <Box
        border='1px solid'
        borderColor='gray.200'
        borderRadius='2xl'
        p={{ base: 4, md: 10 }}
        bg='white'
        shadow='sm'
      >
        <Stack textAlign='left' gap={4}>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            I would help fix the situation quietly… but deep down, I knew these
            incidents weren't random.
          </Text>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            Then came the moment that changed me.
          </Text>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            Someone shared a story in our community — an adventure traveler
            whose trip ended in a tragedy.
          </Text>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            They asked for my thoughts, and I couldn't look away.
          </Text>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            I needed to understand "why."
          </Text>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            My research uncovered a truth the industry doesn't talk about enough
          </Text>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            Adventure travel is growing fast, but safety hasn't grown with it.
          </Text>
        </Stack>
      </Box>
    ),
  },
  {
    content: (
      <Box
        border='1px solid'
        borderColor='gray.200'
        borderRadius='2xl'
        p={{ base: 4, md: 10 }}
        bg='white'
        shadow='sm'
      >
        <Stack textAlign='left' gap={4}>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            Young explorers are stepping into the world with courage and
            curiosity, but too often, without protection or trust.
          </Text>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            That didn't sit right with me.
          </Text>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            And I could no longer pretend it wasn't happening.
          </Text>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            So I started Zago Tours.
          </Text>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            A place where freedom and safety can finally coexist.
          </Text>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            Where every adventure is verified.
          </Text>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            Where travelers feel excited, not anxious or a mix of both.
          </Text>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            Because the world deserves better adventures.
          </Text>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight='tall'
            letterSpacing='wide'
          >
            And young travelers deserve to come home safely, every single time.
          </Text>
        </Stack>
      </Box>
    ),
  },
];

export default function OurStory() {
  const { isAuthenticated } = useAuthSession();
  return (
    <Box my={{ base: 0, md: 10 }} mx={{ md: '10' }}>
      <Stack gap={{ base: 5, md: 20 }}>
        <StoryHero />
        {/* Story Section */}
        <Stack textAlign='center' gap={{ base: 4, md: 8 }}>
          <Center>
            <Text
              border='1px solid'
              borderColor='primary'
              fontWeight='semibold'
              px={4}
              py={1}
              borderRadius='full'
            >
              OUR STORY
            </Text>
          </Center>
          <Text
            fontSize={{ base: 'xl', md: '3xl' }}
            color='primary'
            fontWeight='bolder'
          >
            The Moment Everything Changed
          </Text>
          <Box
            w='100%'
            maxW={{ base: '100%', md: '800px' }}
            mx='auto'
            px={{ base: 4, md: 0 }}
          >
            <ScrollProgressSteps items={mySteps} />
          </Box>
        </Stack>
        <TransformationSection />
        <PurposeSection />
        {!isAuthenticated && (
          <Box textAlign='center' mb='9'>
            <AppLink href='/register'>
              <Button
                aria-label='join-us'
                alignItems='center'
                gap={3}
                fontWeight='bold'
                p={5}
                cursor='pointer'
                bg='secondary'
                color='dark'
              >
                Join us <Icon as={ArrowRight} size='sm' />
              </Button>
            </AppLink>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
