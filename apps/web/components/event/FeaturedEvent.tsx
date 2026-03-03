'use client';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';

export default function FeaturedEvent() {
  return (
    <Box maxW='1200px' mx='auto' py={16} px={{ base: 4, md: 8 }}>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        bg='gradient-to-r from-purple.50 to-blue.50'
        borderRadius='3xl'
        overflow='hidden'
        boxShadow='xl'
      >
        <Box flex={1} p={{ base: 8, md: 12 }}>
          <Badge colorScheme='purple' mb={4} p={2} borderRadius='full'>
            Featured Event
          </Badge>

          <VStack align='start' spaceY={4}>
            <Heading size='2xl' color='gray.800'>
              Annual Tech Summit 2024
            </Heading>

            <Text fontSize='lg' color='gray.600'>
              Join industry leaders for a day of insights, networking, and
              innovation. Learn about the latest trends in technology and
              connect with peers.
            </Text>

            <HStack spaceX={4} color='gray.600'>
              <Flex align='center' gap={1}>
                <Calendar size={18} />
                <Text>May 15-16, 2024</Text>
              </Flex>
              <Flex align='center' gap={1}>
                <MapPin size={18} />
                <Text>San Francisco, CA</Text>
              </Flex>
              <Flex align='center' gap={1}>
                <Users size={18} />
                <Text>500+ attendees</Text>
              </Flex>
            </HStack>

            <Button
              size='lg'
              colorScheme='purple'
              mt={4}
              _hover={{ transform: 'translateY(-2px)' }}
              transition='all 0.2s'
            >
              Register Now
            </Button>
          </VStack>
        </Box>

        <Box
          flex={1}
          bg='purple.600'
          p={12}
          display={{ base: 'none', lg: 'block' }}
        >
          <Image
            src='/images/summit-illustration.svg'
            alt='Summit illustration'
          />
        </Box>
      </Flex>
    </Box>
  );
}
