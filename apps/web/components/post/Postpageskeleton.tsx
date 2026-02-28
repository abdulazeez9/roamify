'use client';
import {
  Box,
  Flex,
  Stack,
  Skeleton,
  SkeletonText,
  HStack,
  VStack,
  Card,
} from '@chakra-ui/react';

// ============ POST HERO SKELETON ============
const PostHeroSkeleton = () => (
  <Box position='relative' w='full'>
    {/* Cover Image Skeleton */}
    <Box
      w='full'
      h={{ base: '220px', md: '320px' }}
      overflow='hidden'
      position='relative'
    >
      <Skeleton height='100%' width='100%' borderRadius='none' />
    </Box>

    <Flex
      direction={{ base: 'column', md: 'row' }}
      justify='center'
      align='flex-end'
      px={{ base: 4, md: 8 }}
      position='relative'
      gap={6}
    >
      {/* Avatar Skeleton */}
      <Box
        border='4px solid white'
        borderRadius='full'
        alignSelf='flex-start'
        mt='-50px'
      >
        <Skeleton height='96px' width='96px' borderRadius='full' />
      </Box>

      {/* Text Content Skeleton */}
      <VStack align='flex-start' spaceY={2} pb={2} flex={1}>
        <Skeleton
          height={{ base: '24px', md: '32px' }}
          width={{ base: '80%', md: '400px' }}
          borderRadius='md'
        />
        <Skeleton
          height={{ base: '16px', md: '20px' }}
          width={{ base: '100%', md: '500px' }}
          borderRadius='md'
        />
      </VStack>
    </Flex>
  </Box>
);

// ============ POST FILTER BAR SKELETON ============
const PostFilterBarSkeleton = () => (
  <Box
    w='full'
    p={4}
    bg='white'
    borderRadius='xl'
    borderWidth='1px'
    borderColor='gray.100'
    my={6}
  >
    <Flex gap={6} align='flex-end' wrap={{ base: 'wrap', md: 'nowrap' }}>
      {/* Username Field */}
      <Box flex={1}>
        <Skeleton height='12px' width='60px' mb={2} />
        <Skeleton height='20px' width='100px' />
      </Box>

      {/* Location Field */}
      <Box flex={1}>
        <Skeleton height='12px' width='60px' mb={2} />
        <Skeleton height='40px' width='100%' borderRadius='md' />
      </Box>

      {/* Interest Field */}
      <Box flex={1}>
        <Skeleton height='12px' width='60px' mb={2} />
        <Skeleton height='40px' width='100%' borderRadius='md' />
      </Box>

      {/* Search Field */}
      <Box flex={2}>
        <Skeleton height='40px' width='100%' borderRadius='md' />
      </Box>
    </Flex>
  </Box>
);

// ============ POST CREATOR SKELETON ============
const PostCreatorSkeleton = () => (
  <Box
    my={6}
    bg='white'
    borderRadius='lg'
    borderWidth='1px'
    borderColor='gray.100'
    p={4}
    boxShadow='sm'
  >
    <Flex gap={3} align='center'>
      {/* Avatar */}
      <Skeleton height='48px' width='48px' borderRadius='full' flexShrink={0} />

      {/* Input Box */}
      <Skeleton flex={1} height='40px' borderRadius='full' />

      {/* Action Buttons */}
      <HStack gap={4}>
        <Skeleton
          height='32px'
          width='70px'
          borderRadius='md'
          display={{ base: 'none', sm: 'block' }}
        />
        <Skeleton
          height='32px'
          width='70px'
          borderRadius='md'
          display={{ base: 'none', sm: 'block' }}
        />
        <Skeleton height='36px' width='80px' borderRadius='full' />
      </HStack>
    </Flex>
  </Box>
);

// ============ POST CARD SKELETON ============
const PostCardSkeleton = () => (
  <Card.Root
    width='100%'
    maxW='600px'
    variant='elevated'
    mx='auto'
    mb={6}
    bg='white'
    overflow='hidden'
    borderWidth='1px'
    borderColor='gray.100'
    boxShadow='0 2px 12px rgba(0, 0, 0, 0.05)'
  >
    {/* Header */}
    <Box p={4}>
      <Flex justify='space-between' align='start'>
        <Flex align='center' gap={3}>
          <Skeleton height='48px' width='48px' borderRadius='full' />
          <Box>
            <Skeleton height='16px' width='120px' mb={2} />
            <Skeleton height='12px' width='150px' mb={1} />
            <Skeleton height='12px' width='100px' />
          </Box>
        </Flex>
        <Skeleton height='32px' width='32px' borderRadius='full' />
      </Flex>
      <Skeleton height='24px' width='70%' mt={4} mb={1} />
    </Box>

    {/* Media */}
    <Skeleton height='400px' width='100%' />

    {/* Body */}
    <Box px={4} py={3}>
      <SkeletonText noOfLines={3} gap={2} />
    </Box>

    {/* Footer Actions */}
    <Box px={2} py={2} borderTop='1px solid' borderColor='gray.50'>
      <HStack gap={1} width='100%'>
        <Flex flex={1} justify='center' align='center' gap={2} py={2}>
          <Skeleton height='18px' width='18px' borderRadius='sm' />
          <Skeleton height='14px' width='30px' />
        </Flex>
        <Flex flex={1} justify='center' align='center' gap={2} py={2}>
          <Skeleton height='18px' width='18px' borderRadius='sm' />
          <Skeleton height='14px' width='30px' />
        </Flex>
        <Flex flex={1} justify='center' align='center' gap={2} py={2}>
          <Skeleton height='18px' width='18px' borderRadius='sm' />
          <Skeleton height='14px' width='30px' />
        </Flex>
      </HStack>
    </Box>
  </Card.Root>
);

// ============ POST SECTION SKELETON ============
const PostSectionSkeleton = ({ postsCount = 3 }: { postsCount?: number }) => (
  <Box display={{ base: 'block', md: 'flex' }} gap='50px'>
    {/* Sidebar */}
    <Stack
      bg='white'
      maxW={{ base: '100%', md: '600px' }}
      height='fit-content'
      p={5}
      overflow='hidden'
      borderWidth='1px'
      borderColor='gray.100'
      borderRadius='xl'
      boxShadow='0 2px 12px rgba(0, 0, 0, 0.05)'
      spaceY={5}
    >
      <Flex align='center' gap={5}>
        <Skeleton height='24px' width='24px' borderRadius='sm' />
        <Skeleton height='20px' width='150px' />
      </Flex>
      <Skeleton height='40px' width='100%' borderRadius='md' />
    </Stack>

    {/* Posts List */}
    <Stack flex={1}>
      {Array.from({ length: postsCount }).map((_, idx) => (
        <PostCardSkeleton key={idx} />
      ))}
    </Stack>
  </Box>
);

// ============ MAIN POST PAGE SKELETON ============
export const PostPageSkeleton = () => {
  return (
    <Box>
      <PostHeroSkeleton />
      <Flex direction='column' align='center' width='100%'>
        <Box width='100%' maxW='900px' px={4}>
          <PostFilterBarSkeleton />
          <PostCreatorSkeleton />
          <PostSectionSkeleton postsCount={3} />
        </Box>
      </Flex>
    </Box>
  );
};
