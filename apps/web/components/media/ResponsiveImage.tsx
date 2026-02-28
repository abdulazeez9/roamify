'use client';
import Image from 'next/image';
import { Box, BoxProps, Text } from '@chakra-ui/react';
import React, { useState } from 'react';

interface ResponsiveImageProps {
  src?: string;
  alt: string;
  width?: BoxProps['width'];
  maxW?: BoxProps['maxW'];
  height?: BoxProps['height'];
  mx?: BoxProps['mx'];
  minH?: BoxProps['height'];
  maxH?: BoxProps['height'];
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  borderRadius?: BoxProps['borderRadius'];
  boxShadow?: BoxProps['boxShadow'];
  priority?: boolean;
  loading?: 'eager' | 'lazy';
  sizes?: string;
  containerProps?: BoxProps;
  fallbackBg?: string;
  objectPosition?: string;
}

export const ResponsiveImage = ({
  src,
  alt,
  width = '100%',
  maxW = '100%',
  mx,
  height = '100%',
  maxH,
  minH,
  objectFit = 'cover',
  borderRadius = '2xl',
  priority = false,
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, 50vw',
  containerProps,
  boxShadow,
  objectPosition = 'center',
  fallbackBg = 'gray.100',
}: ResponsiveImageProps) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <Box
        position='relative'
        width={width}
        height={height}
        maxH={maxH}
        minH={minH || '200px'}
        borderRadius={borderRadius}
        boxShadow={boxShadow}
        overflow='hidden'
        bg={fallbackBg}
        display='flex'
        alignItems='center'
        justifyContent='center'
        {...containerProps}
      >
        <Text color='gray.500' fontSize='sm' textAlign='center' px={4}>
          {hasError ? 'Image Load Error' : 'No Image Available'}
        </Text>
      </Box>
    );
  }

  return (
    <Box
      position='relative'
      width={width}
      height={height}
      maxH={maxH}
      maxW={maxW}
      minH={minH}
      mx={mx}
      borderRadius={borderRadius}
      boxShadow={boxShadow}
      overflow='hidden'
      style={{ minHeight: '1px', ...containerProps?.style }}
      {...containerProps}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : loading}
        sizes={sizes}
        style={{ objectFit, objectPosition }}
        fetchPriority={priority ? 'high' : 'auto'}
        onError={() => setHasError(true)}
      />
    </Box>
  );
};
