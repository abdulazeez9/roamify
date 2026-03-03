'use client';
import { Box, Text, Icon } from '@chakra-ui/react';
import { FiMapPin } from 'react-icons/fi';
import { AppLink } from '../link/AppLink';

export const Logo = () => {
  return (
    <AppLink
      href='/'
      tabIndex={-1}
      textDecor='none'
      _hover={{ textDecor: 'none' }}
      _focus={{ outline: 'none' }}
      _focusVisible={{ outline: 'none' }}
    >
      <Box display='flex' alignItems='center' gap={2}>
        <Icon
          as={FiMapPin}
          color='secondary'
          boxSize='clamp(20px, 4vw, 28px)'
          strokeWidth={2.5}
        />
        <Box
          display='flex'
          fontSize='clamp(20px, 4vw, 28px)'
          fontWeight='bold'
          letterSpacing='-0.02em'
        >
          <Text as='span' color='secondary' fontSize='1.2em' lineHeight='1'>
            R
          </Text>
          <Text as='span' color='textPrimary'>
            oam
          </Text>
          <Text as='span' color='secondary'>
            ify
          </Text>
        </Box>
      </Box>
    </AppLink>
  );
};
