'use client';
import { Icon, Text, Box, VStack } from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons';

interface Prop {
  icon: IconType;
  description: string;
}

export const HighlightCard = ({ icon, description }: Prop) => {
  return (
    <VStack
      spaceY={4}
      p={8}
      borderRadius='2xl'
      bg='white'
      _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}
      transition='all 0.3s ease-in-out'
      width='full'
      maxW='320px'
      textAlign='center'
      border='1px solid'
      borderColor='gray.100'
    >
      {/* Icon Container with Primary Background */}
      <Box
        p={4}
        bg='primary'
        borderRadius='full'
        display='flex'
        alignItems='center'
        justifyContent='center'
        boxShadow='0 4px 14px 0 rgba(0,0,0,0.1)'
      >
        <Icon as={icon} boxSize={8} color='white' />
      </Box>

      {/* Description */}
      <Text
        fontSize='md'
        color='gray.700'
        lineHeight='tall'
        fontWeight='medium'
      >
        {description}
      </Text>
    </VStack>
  );
};
