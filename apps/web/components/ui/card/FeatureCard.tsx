'use client';
import { Flex, Icon, Stack, Text, Box } from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons';

interface Prop {
  icon: IconType;
  heading: string;
  description: string;
}

export const FeatureCard = ({ icon, heading, description }: Prop) => {
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      align={{ base: 'center', md: 'start' }}
      gap={4}
      p={5}
      borderRadius='xl'
      bg='white'
      _hover={{ shadow: 'md' }}
      transition='all 0.2s'
      width='full'
      maxW={{ md: '450px' }}
    >
      <Box
        p={3}
        bg='textPrimary'
        borderRadius='lg'
        display='flex'
        alignItems='center'
        justifyContent='center'
        flexShrink={0}
      >
        <Icon as={icon} boxSize={6} color='primary' />
      </Box>

      <Stack
        gap={1}
        flex='1'
        textAlign={{ base: 'center', md: 'left' }}
        align={{ base: 'center', md: 'start' }}
      >
        <Text
          as='h3'
          fontWeight='bold'
          fontSize='lg'
          lineHeight='shorter'
          color='gray.800'
        >
          {heading}
        </Text>
        <Text fontSize='sm' color='gray.600' lineHeight='tall'>
          {description}
        </Text>
      </Stack>
    </Flex>
  );
};
