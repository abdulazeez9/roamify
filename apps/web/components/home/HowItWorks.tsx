'use client';
import {
  Box,
  Center,
  Text,
  Stack,
  Heading,
  AvatarGroup,
  Avatar,
  Flex,
  SimpleGrid,
} from '@chakra-ui/react';
import React from 'react';
import { AvatarImage } from '../media/AvatarImage';
import { BookAIcon, FileExclamationPointIcon, Rocket } from 'lucide-react';

import { ResponsiveImage } from '../media/ResponsiveImage';
import { FeatureCard } from '../ui/card/FeatureCard';

//advisor-images
const advisors = [
  {
    id: 'hero-advisor-1',
    src: '/images/home/home-hero-advisor-1.webp',
    name: 'Belly',
  },
  {
    id: 'hero-advisor-2',
    src: '/images/home/home-hero-advisor-2.webp',
    name: 'Brand',
  },
  {
    id: 'hero-advisor-3',
    src: '/images/home/home-hero-advisor-3.webp',
    name: 'Brook',
  },
];

//Card-data
const cardData = [
  {
    heading: 'Select Your Adventure',
    icon: BookAIcon,
    description:
      'Every trip on Zago is approved through our Quality and Safety Standard. If it is here, it has earned its place.',
  },
  {
    heading: 'Know What to Expect',
    icon: FileExclamationPointIcon,
    description:
      'From the guides to the routes to the conditions on the ground. Clear information, no guesswork, no surprises.',
  },
  {
    heading: 'Go',
    icon: Rocket,
    description:
      'You bring the courage. We bring protection. It is that simple.',
  },
];

//ResponsiveImage-Data
const resImageData = [
  '/images/adventures/tripType/skiing.webp',
  '/images/adventures/tripType/hiking.webp',
  '/images/adventures/tripType/mountain-climbing.webp',
  '/images/adventures/tripType/safari.webp',
];

export const HowItWorks = () => {
  return (
    <Box
      bg='surface'
      mb={{ base: 48, md: 32 }}
      borderRadius={{ base: 'none', md: '4xl' }}
      py={10}
      px={{ base: 2, md: 10 }}
      pb={{ base: '150px', md: '200px' }}
      position='relative'
    >
      <Box maxW='container.xl' mx='auto' px={4}>
        <Stack
          textAlign='center'
          gap={4}
          align='center'
          mb={{ base: 12, md: 20 }}
        >
          <Center>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              px={4}
              py={1}
              borderWidth='1px'
              borderColor='primary'
              borderRadius='full'
              letterSpacing='widest'
              bg='white'
              color='primary'
              fontWeight='semibold'
            >
              JUST BREAKS, NO PLANS
            </Text>
          </Center>

          <Heading
            size={{ base: '2xl', md: '4xl' }}
            color='primary'
            fontWeight='bolder'
          >
            How It Works
          </Heading>

          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            opacity={0.9}
            maxW={{ base: '100%', md: '600px' }}
          >
            Wherever you are in the world, pick your adventure, it's that SIMPLE
          </Text>
        </Stack>

        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: 10, lg: 20 }}
          align='center'
          justify='center'
          width='full'
          maxW='1100px'
          mx='auto'
        >
          {/* Images Grid */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} flex='1.2'>
            {resImageData.map((img, i) => (
              <Box
                key={i}
                width='100%'
                display={{ base: i > 1 ? 'none' : 'block', md: 'block' }}
                transform={{
                  base: 'none',
                  md: i % 2 === 0 ? 'translateY(-30px)' : 'translateY(20px)',
                }}
              >
                <ResponsiveImage
                  src={img}
                  alt='how it work image'
                  height={{ base: '220px', md: '280px' }}
                  width='100%'
                  borderRadius='xl'
                  objectFit='cover'
                  priority={i < 2}
                  containerProps={{ style: { aspectRatio: '4/3' } }}
                />
              </Box>
            ))}
          </SimpleGrid>

          {/* Feature Cards List */}
          <Stack gap={6} flex='1' textAlign='left' width='full'>
            {cardData.map((card, idx) => (
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

      <Box
        width={{ base: '90%', md: '80%', lg: '70%' }}
        position='absolute'
        bottom='0'
        left='50%'
        transform='translate(-50%, 50%)'
        zIndex={10}
        bg='primary'
        p={{ base: 6, md: 10 }}
        borderRadius='2xl'
        boxShadow='2xl'
        color='white'
      >
        <Stack align='center' gap={6} textAlign='center'>
          <AvatarGroup spaceX='-3'>
            {advisors.map((adv, idx) => (
              <Box
                as='span'
                key={idx}
                borderWidth='2px'
                borderColor='primary'
                borderRadius='full'
              >
                <AvatarImage src={adv.src} name={adv.name} id={adv.id} />
              </Box>
            ))}
            <Avatar.Root id='hero-advisor-more' bg='white' color='primary'>
              <Avatar.Fallback fontSize='xs'>+</Avatar.Fallback>
            </Avatar.Root>
          </AvatarGroup>
          <Text
            fontSize={{ base: 'md', md: 'xl', lg: '2xl' }}
            lineHeight='short'
          >
            Our team and partners aren’t new to this, we’ve spent decades
            leading travelers up mountains, across oceans, and into the kind of
            stories you never forget. Together, that’s over 100 years of
            experience fueling your next adventure.
          </Text>
        </Stack>
      </Box>
    </Box>
  );
};
