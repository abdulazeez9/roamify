'use client';

import { Box, Text, VStack } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import React from 'react';
import { MapPin } from 'lucide-react';
import { ResponsiveImage } from '../media/ResponsiveImage';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const DESTINATIONS = [
  { name: 'Chile', top: '75%', left: '25%' },
  { name: 'Peru', top: '25%', left: '72%' },
  { name: 'Nepal', top: '45%', left: '72%' },
  { name: 'Mexico', top: '35%', left: '15%' },
  { name: 'United States', top: '20%', left: '12%' },
  { name: 'Ecuador', top: '55%', left: '22%' },
  { name: 'Puerto Rico', top: '42%', left: '28%' },
  { name: 'Tibet', top: '30%', left: '78%' },
  { name: 'Bhutan', top: '30%', left: '48%' },
  { name: 'India', top: '48%', left: '70%' },
  { name: 'Tanzania', top: '60%', left: '55%' },
  { name: 'Uganda', top: '52%', left: '52%' },
  { name: 'Mauritius', top: '78%', left: '60%' },
  { name: 'Kenya', top: '45%', left: '55%' },
  { name: 'South Africa', top: '82%', left: '52%' },
  { name: 'Panama', top: '48%', left: '20%' },
  { name: 'Philippines', top: '55%', left: '85%' },
];

export const DestinationCountries = () => {
  return (
    <Box position='relative' width='100%' height='500px' overflow='hidden'>
      {/* Background Image */}
      <ResponsiveImage
        src='/images/map/map-bg.webp'
        alt='Zago Tours Global Map'
        width='100%'
        height='500px'
        borderRadius='none'
        objectFit='cover'
      />

      {/* Dark overlay - BEFORE pins so it doesn't cover them */}
      <Box
        position='absolute'
        inset={0}
        bg='blackAlpha.50'
        pointerEvents='none'
        zIndex={1}
      />

      {/* Map Pin Overlay Layer */}
      {DESTINATIONS.map((country, index) => (
        <Box
          key={index}
          position='absolute'
          top={country.top}
          left={country.left}
          transform='translate(-50%, -100%)'
          zIndex={10}
        >
          <VStack
            gap={0}
            animation={`${float} 3s ease-in-out infinite`}
            style={{ animationDelay: `${index * 0.5}s` }}
            _hover={{ cursor: 'pointer', transform: 'scale(1.1)' }}
            transition='transform 0.2s'
          >
            {/* Tooltip-style Label */}
            <Box
              bg='white'
              px={3}
              py={1}
              borderRadius='full'
              boxShadow='0px 4px 10px rgba(0,0,0,0.15)'
              border='1px solid'
              borderColor='gray.100'
              mb={1}
            >
              <Text
                fontSize='11px'
                fontWeight='700'
                color='brand.600'
                whiteSpace='nowrap'
                letterSpacing='tight'
              >
                {country.name}
              </Text>
            </Box>

            {/* The Map Pin Icon - Fixed! */}
            <MapPin
              size={24}
              fill='black'
              color='white'
              strokeWidth={2.5}
              style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' }}
            />
          </VStack>
        </Box>
      ))}
    </Box>
  );
};
