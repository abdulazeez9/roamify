'use client';
import Image from 'next/image';
import { Box } from '@chakra-ui/react';

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
      <Box display='inline-block'>
        <Image
          src='/images/logo/zago logo png-03.webp'
          alt='ZagoTours Logo'
          width={90}
          height={90}
          quality={80}
          priority
          style={{
            width: 'clamp(35px, 4vw, 45px)',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </Box>
    </AppLink>
  );
};
