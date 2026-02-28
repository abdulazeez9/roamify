import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  Stack,
  Text,
  Separator,
} from '@chakra-ui/react';
import React from 'react';
import { AvatarImage } from '../media/AvatarImage';

const advisors = [
  {
    src: '/images/home/home-hero-advisor-1.webp',
    name: 'Belly',
    alt: 'Travel advisor Belly',
  },
  {
    src: '/images/home/home-hero-advisor-2.webp',
    name: 'Brand',
    alt: 'Travel advisor Brand',
  },
  {
    src: '/images/home/home-hero-advisor-3.webp',
    name: 'Brook',
    alt: 'Travel advisor Brook',
  },
];

const stats = [
  { label: 'Countries', value: 17 },
  { label: 'Adventures', value: 10 },
  { label: 'Verified Suppliers', value: 20 },
];

export const StatsHero = () => {
  return (
    <Stack
      direction={{ base: 'column', lg: 'row' }}
      justifyContent='center'
      align='center'
      gap={{ base: 8, lg: 12 }}
      mt={{ base: 4, md: 25 }}
      mb={{ base: 4, md: 20 }}
      py={6}
      px={4}
      width='100%'
    >
      {/* Advisor Section */}
      <Flex
        bg='primary'
        align='center'
        justify='center'
        gap={4}
        borderRadius='2xl'
        p={{ base: 4, md: 5 }}
        color='textPrimary'
        width={{ base: '100%', md: 'auto' }}
        boxShadow='sm'
      >
        <AvatarGroup spaceX='-3' stacking='last-on-top'>
          {advisors.map((adv, idx) => (
            <Box
              as='span'
              key={idx}
              borderWidth='2px'
              borderColor='primary'
              borderRadius='full'
            >
              <AvatarImage src={adv.src} name={adv.name} alt={adv.alt} />
            </Box>
          ))}
          <Avatar.Root bg='white' color='primary'>
            <Avatar.Fallback fontSize='xs'>+</Avatar.Fallback>
          </Avatar.Root>
        </AvatarGroup>

        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          fontWeight='medium'
          lineHeight='short'
          textAlign='left'
        >
          1,000+ professional travel advisors <br />
          connected to our network
        </Text>
      </Flex>

      {/* Stats Section */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align='center'
        justify='center'
        gap={{ base: 4, md: 10 }}
        flexWrap='wrap'
        width={{ base: '100%', md: 'auto' }}
      >
        {stats.map((stat, idx) => (
          <React.Fragment key={idx}>
            <Box textAlign='center' alignItems='center' minW='100px'>
              <Text fontWeight='bolder' fontSize={{ base: '2xl', md: '3xl' }}>
                {stat.value}+
              </Text>
              <Text
                color='gray.600'
                fontSize={{ base: 'xs', md: 'sm' }}
                textTransform='uppercase'
                letterSpacing='wider'
              >
                {stat.label}
              </Text>
            </Box>

            {idx < stats.length - 1 && (
              <Separator
                orientation='vertical'
                height='40px'
                display={{ base: 'none', md: 'block' }}
              />
            )}
          </React.Fragment>
        ))}
      </Flex>
    </Stack>
  );
};
