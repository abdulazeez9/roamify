'use client';
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Icon,
  VStack,
  Flex,
} from '@chakra-ui/react';
import React from 'react';
import { Calendar, Users, Sparkles, Globe, Clock, Award } from 'lucide-react';

const benefitsData = [
  {
    icon: Calendar,
    title: 'Discover Events',
    description:
      'Find events tailored to your interests and professional goals',
    color: 'blue.500',
  },
  {
    icon: Users,
    title: 'Connect & Network',
    description: 'Meet like-minded professionals and expand your network',
    color: 'green.500',
  },
  {
    icon: Sparkles,
    title: 'Learn & Grow',
    description: 'Gain insights from industry experts and thought leaders',
    color: 'purple.500',
  },
  {
    icon: Globe,
    title: 'Global Community',
    description: 'Join a diverse community of professionals worldwide',
    color: 'orange.500',
  },
  {
    icon: Clock,
    title: 'Flexible Schedule',
    description: 'Access recordings and materials at your own pace',
    color: 'red.500',
  },
  {
    icon: Award,
    title: 'Earn Recognition',
    description: 'Get certificates and badges for your participation',
    color: 'teal.500',
  },
];

export default function Benefits() {
  return (
    <Box py={16} bg='gray.50'>
      <Box maxW='1200px' mx='auto' px={{ base: 4, md: 8 }}>
        <VStack spaceY={4} mb={12}>
          <Heading
            size='2xl'
            color='gray.800'
            textAlign='center'
            fontWeight='bold'
          >
            Why Join Our Events
          </Heading>
          <Text fontSize='lg' color='gray.600' textAlign='center' maxW='600px'>
            Experience the benefits of being part of an active learning
            community
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
          {benefitsData.map((benefit, idx) => (
            <Box
              key={idx}
              bg='white'
              p={6}
              borderRadius='xl'
              boxShadow='md'
              transition='all 0.3s'
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: 'xl',
              }}
            >
              <Flex align='center' mb={4}>
                <Box
                  p={3}
                  bg={`${benefit.color}10`}
                  borderRadius='lg'
                  color={benefit.color}
                >
                  <Icon as={benefit.icon} boxSize={6} />
                </Box>
                <Heading size='md' ml={3} color='gray.700'>
                  {benefit.title}
                </Heading>
              </Flex>
              <Text color='gray.600' lineHeight='tall'>
                {benefit.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
