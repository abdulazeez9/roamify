'use client';

import {
  Box,
  Container,
  Stack,
  Flex,
  HStack,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  Separator,
} from '@chakra-ui/react';

export default function AdventureSkeleton() {
  return (
    <Container maxW='container.md' py={10}>
      {/* 1. TOP STATS CARD SKELETON */}
      <Box borderRadius='xl' p={6} bg='gray.50' borderWidth='1px' mb={8}>
        <Stack gap={4}>
          <Skeleton h='15px' w='120px' />
          <Skeleton h='25px' w='60px' />
          <HStack gap={3}>
            <Skeleton h='20px' w='80px' borderRadius='full' />
            <Skeleton h='20px' w='80px' borderRadius='full' />
            <Skeleton h='20px' w='80px' borderRadius='full' />
          </HStack>
        </Stack>
      </Box>

      {/* 2. TITLE & SHARE SKELETON */}
      <Flex justify='space-between' align='flex-start' mb={8} gap={4}>
        <Box flex='1'>
          <Skeleton h='40px' w='70%' mb={3} />
          <Skeleton h='20px' w='100px' />
        </Box>
        <Skeleton h='40px' w='100px' borderRadius='full' />
      </Flex>

      {/* 3. BOOKING CARD SKELETON */}
      <Box
        p={6}
        borderRadius='2xl'
        borderWidth='1px'
        borderColor='gray.100'
        bg='white'
        boxShadow='md'
        mb={10}
      >
        <Flex justify='space-between' align='center' wrap='wrap' gap={6}>
          <Stack gap={2}>
            <Skeleton h='20px' w='150px' />
            <Skeleton h='35px' w='100px' />
          </Stack>
          <HStack gap={3}>
            <SkeletonCircle size='12' />
            <Skeleton h='48px' w='140px' borderRadius='full' />
          </HStack>
        </Flex>
      </Box>

      {/* 4. DESCRIPTION & DETAILS SKELETON */}
      <Box mb={12}>
        <Skeleton h='25px' w='200px' mb={4} />
        <SkeletonText noOfLines={4} gap={4} />
        <Separator my={8} />
        <Flex wrap='wrap' gap={10}>
          {[1, 2, 3].map((i) => (
            <HStack key={i} gap={4}>
              <SkeletonCircle size='10' />
              <Stack gap={2}>
                <Skeleton h='10px' w='60px' />
                <Skeleton h='15px' w='80px' />
              </Stack>
            </HStack>
          ))}
        </Flex>
      </Box>
    </Container>
  );
}
