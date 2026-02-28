'use client';
import { Icon, Stack, Text, Box } from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons';

interface Prop {
  icon: IconType;
  heading: string;
  description: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const SelectableCard = ({
  icon,
  heading,
  description,
  isActive,
  onClick,
}: Prop) => {
  return (
    <Stack
      onClick={onClick}
      cursor='pointer'
      direction='column'
      align='flex-start'
      textAlign='left'
      gap={4}
      p={6}
      borderRadius='xl'
      bg={isActive ? 'primary' : 'white'}
      border='1px solid'
      borderColor={isActive ? 'transparent' : 'gray.200'}
      transition='all 0.2s cubic-bezier(.4,0,.2,1)'
      width='full'
      maxW='300px'
      role='group'
    >
      <Box
        p={3}
        bg={isActive ? 'whiteAlpha.300' : 'textPrimary'}
        borderRadius='lg'
        display='flex'
        alignItems='center'
        justifyContent='center'
        flexShrink={0}
        transition='background 0.2s'
      >
        <Icon as={icon} boxSize={6} color={isActive ? 'white' : 'primary'} />
      </Box>

      <Stack gap={1} align='flex-start'>
        <Text
          as='h3'
          fontWeight='bold'
          fontSize='lg'
          lineHeight='shorter'
          color={isActive ? 'white' : 'gray.800'}
        >
          {heading}
        </Text>
        <Text
          fontSize='sm'
          lineHeight='tall'
          color={isActive ? 'whiteAlpha.900' : 'gray.600'}
        >
          {description}
        </Text>
      </Stack>
    </Stack>
  );
};
