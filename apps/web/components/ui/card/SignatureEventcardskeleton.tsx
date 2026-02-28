'use client';
import { Stack, Card, Box, Skeleton, SkeletonText } from '@chakra-ui/react';

export const SignatureEventCardSkeleton = () => {
  return (
    <Card.Root
      overflow='hidden'
      variant='subtle'
      borderStart='4px solid'
      borderStartColor='yellow.400'
      flexDirection={{ base: 'column', sm: 'row' }}
      width='full'
      height={{ sm: '200px' }}
    >
      {/* Image Skeleton on the Left */}
      <Box
        minW={{ base: 'full', sm: '200px' }}
        maxW={{ base: 'full', sm: '250px' }}
        height={{ base: '200px', sm: 'full' }}
      >
        <Skeleton height='100%' width='100%' borderRadius='none' />
      </Box>

      {/* Title and Description Skeleton on the Right */}
      <Stack flex='1' justify='center'>
        <Card.Body p={4}>
          {/* Title Skeleton */}
          <Skeleton height='28px' width='70%' mb='3' borderRadius='md' />

          {/* Description Skeleton (3 lines) */}
          <SkeletonText noOfLines={3} gap='2' fontSize='sm' />
        </Card.Body>
      </Stack>
    </Card.Root>
  );
};
