'use client';
import { Icon, Stack, Text, Box } from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons';

interface Prop {
  icon: IconType;
  heading: string;
  description: string;
  bg?: string;
  rotateIcon?: boolean;
}

export const FeatureTileCard = ({
  icon,
  heading,
  description,
  bg = 'white',
  rotateIcon = false,
}: Prop) => {
  const isColored = bg === 'primary';

  return (
    <Stack
      direction='column'
      align='center'
      justify='center'
      textAlign='center'
      gap={4}
      p={6}
      borderRadius='xl'
      border='2px solid gray'
      bg={bg}
      _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
      transition='all 0.2s'
      width='full'
      maxW='300px'
    >
      <Box
        p={3}
        bg={isColored ? 'white' : 'red.500'}
        borderRadius='full'
        display='flex'
        alignItems='center'
        justifyContent='center'
        flexShrink={0}
      >
        <Icon
          as={icon}
          boxSize={6}
          color={isColored ? 'primary' : 'whiteAlpha.700'}
          transform={rotateIcon ? 'rotate(-90deg)' : 'none'}
        />
      </Box>

      <Stack gap={2} align='center'>
        <Text
          as='h3'
          fontWeight='bold'
          fontSize='lg'
          lineHeight='shorter'
          color={isColored ? 'textPrimary' : 'primary'}
        >
          {heading}
        </Text>
        <Text
          fontSize='sm'
          color={isColored ? 'textPrimary' : 'primary'}
          lineHeight='tall'
        >
          {description}
        </Text>
      </Stack>
    </Stack>
  );
};
