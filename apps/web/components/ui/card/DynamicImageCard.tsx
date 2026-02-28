'use client';

import { ResponsiveImage } from '@/components/media/ResponsiveImage';
import { Box, Stack, Heading, Card, CardBody } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface ImageCardProps {
  image: string;
  title?: string | ReactNode;
  description: string | ReactNode;
  maxWidth?: string | object;
}

export const DynamicImageCard = ({
  image,
  title,
  description,
  maxWidth = '100%',
}: ImageCardProps) => {
  return (
    <Card.Root
      width='100%'
      maxW={maxWidth}
      overflow='hidden'
      variant='elevated'
      bg='white'
      borderWidth='1px'
      borderRadius='xl'
      borderColor='gray.100'
      transition='transform 0.2s'
      _hover={{ transform: 'translateY(-4px)' }}
      p={2}
    >
      {/* 1. Image at the top */}
      <Box height='200px' width='100%' overflow='hidden'>
        <ResponsiveImage
          src={image}
          alt={(title as string) || 'Card media'}
          width='100%'
          height='100%'
          objectFit='cover'
        />
      </Box>

      {/* 2. Content below */}
      <CardBody p={4}>
        <Stack gap={2}>
          {title && (
            <Heading size='md' color='gray.800'>
              {title}
            </Heading>
          )}
          <Box color='gray.600' fontSize='sm' lineHeight='tall'>
            {description}
          </Box>
        </Stack>
      </CardBody>
    </Card.Root>
  );
};
