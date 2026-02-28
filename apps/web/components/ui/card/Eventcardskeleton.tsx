import {
  Card,
  Skeleton,
  SkeletonText,
  Box,
  Flex,
  HStack,
  Stack,
} from '@chakra-ui/react';

export const EventCardSkeleton = () => {
  return (
    <Card.Root
      maxW={{ base: '100%', md: '650px' }}
      variant='elevated'
      px={3}
      pt={3}
      bg='white'
      overflow='hidden'
      borderWidth='1px'
      borderColor='gray.100'
      borderRadius='xl'
      boxShadow='0 2px 12px rgba(0, 0, 0, 0.05)'
    >
      {/* Image Skeleton */}
      <Skeleton height='200px' width='100%' borderRadius='md' />

      <Card.Body gap='3'>
        {/* Date & Time Row */}
        <HStack justify='space-between' fontSize='xs'>
          <Flex align='center' gap={2}>
            <Skeleton height='12px' width='12px' borderRadius='sm' />
            <Skeleton height='12px' width='100px' />
          </Flex>
          <Flex align='center' gap={2}>
            <Skeleton height='12px' width='12px' borderRadius='sm' />
            <Skeleton height='12px' width='80px' />
          </Flex>
        </HStack>

        {/* Title Skeleton */}
        <Skeleton height='24px' width='80%' mt='1' />

        {/* Description Skeleton */}
        <SkeletonText noOfLines={2} gap={2} />

        {/* Metadata (Spots & Location) */}
        <Stack gap='1' pt='2'>
          <Skeleton height='14px' width='150px' />
          <Skeleton height='14px' width='120px' />
        </Stack>
      </Card.Body>

      <Card.Footer gap='2'>
        {/* Status Badges Skeleton */}
        <Skeleton height='20px' width='60px' borderRadius='md' />
        <Skeleton height='20px' width='50px' borderRadius='md' />

        {/* Avatar Group Skeleton */}
        <HStack ml='auto'>
          <Skeleton height='24px' width='24px' borderRadius='full' />
          <Skeleton height='24px' width='24px' borderRadius='full' />
          <Skeleton height='24px' width='24px' borderRadius='full' />
        </HStack>
      </Card.Footer>
    </Card.Root>
  );
};
