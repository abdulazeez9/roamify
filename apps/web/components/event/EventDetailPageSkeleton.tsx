'use client';
import React from 'react';
import {
  Container,
  Box,
  Stack,
  HStack,
  Flex,
  Separator,
  Grid,
  GridItem,
  Skeleton,
  SkeletonCircle,
} from '@chakra-ui/react';

export default function EventDetailPageSkeleton() {
  return (
    <Box bg='gray.50' minH='100vh' pb={20}>
      {/* --- HEADER START --- */}
      <Box
        bg='primary'
        color='textPrimary'
        borderRadius={{ base: 'none', md: '3xl' }}
        p={{ base: 5, md: 10 }}
        mb={{ base: 0, md: '150px' }}
        position='relative'
      >
        <Stack
          textAlign='center'
          gap={5}
          align='center'
          pb={{ base: 5, md: '200px' }}
        >
          {/* Title Skeleton */}
          <Skeleton
            height='48px'
            width={{ base: '80%', md: '60%' }}
            borderRadius='md'
          />

          {/* Image Skeleton */}
          <Box
            width={{ base: '100%', md: '80%', lg: '70%' }}
            position={{ base: 'relative', md: 'absolute' }}
            bottom={{ base: '0', md: '-120px' }}
            left='50%'
            transform='translateX(-50%)'
            zIndex={10}
            mt={{ base: 6, md: 0 }}
          >
            <Skeleton
              width='100%'
              height={{ base: '250px', md: '450px' }}
              borderRadius='2xl'
            />
          </Box>
        </Stack>
      </Box>
      {/* --- HEADER END --- */}

      <Container maxW='container.xl' mt={{ base: 10, md: 24 }}>
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={10}>
          {/* Main Content Area */}
          <GridItem>
            <Stack
              spaceY={8}
              bg='white'
              p={{ base: 6, md: 10 }}
              borderRadius='2xl'
              shadow='sm'
            >
              <Stack spaceY={2}>
                {/* Badge Skeleton */}
                <Skeleton height='24px' width='140px' borderRadius='full' />
                {/* Heading Skeleton */}
                <Skeleton height='36px' width='200px' borderRadius='md' />
              </Stack>

              {/* Event Details Icons */}
              <Flex wrap='wrap' gap={8} py={2}>
                <HStack>
                  <SkeletonCircle size='20px' />
                  <Skeleton height='20px' width='120px' />
                </HStack>
                <HStack>
                  <SkeletonCircle size='20px' />
                  <Skeleton height='20px' width='120px' />
                </HStack>
                <HStack>
                  <SkeletonCircle size='20px' />
                  <Skeleton height='20px' width='120px' />
                </HStack>
              </Flex>

              <Separator />

              {/* Description Skeleton */}
              <Stack spaceY={3}>
                <Skeleton height='20px' width='100%' />
                <Skeleton height='20px' width='95%' />
                <Skeleton height='20px' width='98%' />
                <Skeleton height='20px' width='92%' />
                <Skeleton height='20px' width='85%' />
              </Stack>

              {/* Cancellation Policy Box */}
              <Stack
                spaceY={4}
                p={6}
                bg='orange.50'
                borderRadius='xl'
                borderLeft='4px solid'
                borderColor='orange.400'
              >
                <HStack>
                  <SkeletonCircle size='20px' />
                  <Skeleton height='20px' width='160px' />
                </HStack>
                <Stack spaceY={2}>
                  <Skeleton height='16px' width='100%' />
                  <Skeleton height='16px' width='90%' />
                </Stack>
              </Stack>
            </Stack>
          </GridItem>

          {/* Sidebar Action Card */}
          <GridItem>
            <Stack spaceY={6} position={{ lg: 'sticky' }} top='40px'>
              <Box
                bg='white'
                p={8}
                borderRadius='2xl'
                shadow='xl'
                borderWidth='1px'
              >
                <Stack spaceY={6}>
                  {/* Registration Status */}
                  <Box>
                    <Skeleton height='14px' width='140px' mb={2} />
                    <Skeleton height='24px' width='80px' borderRadius='full' />
                  </Box>

                  {/* Available Spots */}
                  <HStack justify='space-between'>
                    <Flex align='center' gap={2}>
                      <SkeletonCircle size='20px' />
                      <Skeleton height='20px' width='120px' />
                    </Flex>
                    <Skeleton height='28px' width='40px' />
                  </HStack>

                  {/* Button Skeleton */}
                  <Skeleton height='56px' width='100%' borderRadius='md' />

                  {/* Deadline Text */}
                  <Skeleton
                    height='14px'
                    width='150px'
                    mx='auto'
                    borderRadius='sm'
                  />

                  <Separator />

                  {/* Who's Coming Section */}
                  <Box>
                    <Skeleton height='16px' width='100px' mb={3} />
                    <Flex align='center' gap={4}>
                      <HStack gap={-2}>
                        <SkeletonCircle size='32px' />
                        <SkeletonCircle size='32px' />
                        <SkeletonCircle size='32px' />
                      </HStack>
                      <Skeleton height='14px' width='120px' />
                    </Flex>
                  </Box>
                </Stack>
              </Box>

              {/* Safety Banner */}
              <HStack p={5} bg='blue.50' borderRadius='xl'>
                <SkeletonCircle size='32px' />
                <Stack spaceY={2} flex={1}>
                  <Skeleton height='14px' width='100%' />
                  <Skeleton height='14px' width='90%' />
                </Stack>
              </HStack>
            </Stack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
