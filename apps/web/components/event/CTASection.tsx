'use client';
import { Box, Heading, Text, Button, VStack, HStack } from '@chakra-ui/react';
import React from 'react';
import { Calendar, Heart } from 'lucide-react';

export default function CTASection() {
  return (
    <Box bg='gray.900' color='white' py={20} px={4} textAlign='center'>
      <VStack spaceY={6} maxW='600px' mx='auto'>
        <Heading size='2xl'>Ready to Get Started?</Heading>

        <Text fontSize='lg' opacity={0.9}>
          Join thousands of professionals who are already connecting, learning,
          and growing through our events.
        </Text>

        <HStack spaceY={4} pt={4}>
          <Button
            size='lg'
            colorScheme='purple'
            _hover={{ transform: 'translateY(-2px)' }}
            transition='all 0.2s'
          >
            <Calendar /> Browse Events
          </Button>

          <Button
            size='lg'
            variant='outline'
            colorScheme='white'
            _hover={{ bg: 'white', color: 'gray.900' }}
            transition='all 0.2s'
          >
            <Heart /> Host an Event
          </Button>
        </HStack>

        <Text fontSize='sm' opacity={0.6} pt={8}>
          No credit card required • Free for attendees • Community supported
        </Text>
      </VStack>
    </Box>
  );
}
