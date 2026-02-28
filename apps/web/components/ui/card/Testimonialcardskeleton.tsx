import { Box, Flex, Skeleton, SkeletonText, Stack } from '@chakra-ui/react';

export const TestimonialCardSkeleton = () => {
  return (
    <Box
      maxW='sm'
      h={{ base: 'auto', md: '230px' }}
      display='flex'
      flexDirection='column'
      bg='white'
      p={{ base: 6, md: 6 }}
      borderRadius='2xl'
      borderWidth='1px'
      boxShadow='sm'
    >
      {/* Quote Skeleton */}
      <SkeletonText noOfLines={4} gap={2} mb={4} />

      {/* Footer Section */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        mt='auto'
        align='center'
        justify='space-between'
        gap={{ base: 4, md: 0 }}
        pt='4'
      >
        {/* Rating Skeleton */}
        <Box order={{ base: 1, md: 2 }}>
          <Skeleton height='16px' width='100px' />
        </Box>

        {/* Avatar & Name Section */}
        <Flex direction='row' align='center' gap='3' order={{ base: 2, md: 1 }}>
          {/* Avatar Skeleton */}
          <Skeleton height='40px' width='40px' borderRadius='full' />
          <Stack gap='1' textAlign='left'>
            {/* Name Skeleton */}
            <Skeleton height='14px' width='100px' />
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};
