'use client';
import { Box, Text, Stack, Heading, Icon, Flex, Image } from '@chakra-ui/react';
import React from 'react';
import { Calendar, Users, Sparkles } from 'lucide-react';
import Button from '../ui/button/Button';
import { AppLink } from '../ui/link/AppLink';

export const EventHero = () => {
  return (
    <Box
      bg='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      color='white'
      p={{ base: 4, md: 16 }}
      borderRadius={{ base: 'none', md: '2xl' }}
      borderBottomRadius={{ base: '2xl', md: '2xl' }}
      boxShadow='xl'
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align='center'
        justify='space-between'
        maxW='1200px'
        mx='auto'
        gap={8}
      >
        <Stack textAlign={{ base: 'center', md: 'left' }} gap={6} flex={1}>
          <Heading
            size={{ base: '2xl', md: '4xl' }}
            lineHeight='1.2'
            maxW={{ base: 'full', md: '600px' }}
            fontWeight='extrabold'
          >
            Connect Through Live Events
          </Heading>

          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            opacity={0.95}
            maxW={{ base: 'full', md: '500px' }}
            mx={{ base: 'auto', md: '0' }}
          >
            Discover and join events that matter to you - from workshops and
            networking sessions to expert panels and community gatherings.
          </Text>

          <Flex
            direction={{ base: 'column', md: 'row' }}
            align='center'
            gap={4}
            justify={{ base: 'center', md: 'flex-start' }}
          >
            <Button
              onClick={() => {
                document.getElementById('events-section')?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
              bg='white'
              color='purple.600'
              fontWeight='bold'
              size='lg'
              _hover={{ bg: 'gray.100', transform: 'translateY(-2px)' }}
              transition='all 0.2s'
            >
              Browse Events
              <Icon as={Calendar} ml={2} />
            </Button>

            <Button
              bg='transparent'
              color='white'
              fontWeight='bold'
              border='2px solid white'
              size='lg'
              _hover={{
                bg: 'white',
                color: 'purple.600',
                transform: 'translateY(-2px)',
              }}
              transition='all 0.2s'
            >
              Host an Event
              <Icon as={Sparkles} ml={2} />
            </Button>
          </Flex>

          {/* Stats */}
          <Flex gap={8} mt={8} justify={{ base: 'center', md: 'flex-start' }}>
            <Box textAlign='center'>
              <Text fontSize='2xl' fontWeight='bold'>
                50+
              </Text>
              <Text fontSize='sm' opacity={0.8}>
                Monthly Events
              </Text>
            </Box>
            <Box textAlign='center'>
              <Text fontSize='2xl' fontWeight='bold'>
                2k+
              </Text>
              <Text fontSize='sm' opacity={0.8}>
                Active Members
              </Text>
            </Box>
            <Box textAlign='center'>
              <Text fontSize='2xl' fontWeight='bold'>
                15+
              </Text>
              <Text fontSize='sm' opacity={0.8}>
                Categories
              </Text>
            </Box>
          </Flex>
        </Stack>

        <Box flex={1} display={{ base: 'none', md: 'block' }}>
          <Image
            src='/images/events-illustration.svg'
            alt='Events illustration'
          />
        </Box>
      </Flex>
    </Box>
  );
};
