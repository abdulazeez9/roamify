import { Card, Skeleton, SkeletonText, Box, Flex } from '@chakra-ui/react';

export const AdventureCardSkeleton = () => {
  return (
    <Card.Root
      w={{ base: 'full', md: '280px' }}
      h='350px'
      overflow='hidden'
      borderRadius='3xl'
    >
      {/* TOP LAYER: IMAGE SECTION - 50% height */}
      <Box position='relative' h='50%' flexShrink={0}>
        <Skeleton height='100%' width='100%' />

        {/* Verified Badge Skeleton */}
        <Skeleton
          position='absolute'
          top='3'
          left='3'
          height='24px'
          width='80px'
          borderRadius='full'
        />

        {/* Rating Bridge Skeleton */}
        <Flex
          position='absolute'
          bottom='0'
          left='4'
          transform='translateY(50%)'
          bg='white'
          px='2'
          py='1'
          borderRadius='full'
          boxShadow='md'
          alignItems='center'
          zIndex='2'
          gap={2}
        >
          <Skeleton height='16px' width='80px' />
          <Skeleton height='16px' width='24px' />
        </Flex>
      </Box>

      {/* BOTTOM LAYER: DETAILS SECTION - 50% height */}
      <Card.Body p='4' pt='6' h='50%' display='flex' flexDirection='column'>
        {/* Title Skeleton */}
        <SkeletonText noOfLines={2} gap={2} mb={2} />

        {/* Days / Nights Skeleton */}
        <Skeleton height='14px' width='120px' mb={3} />

        {/* Footer Section */}
        <Flex
          justifyContent='space-between'
          alignItems='center'
          pt='3'
          mt='auto'
          borderTop='1px solid'
          borderColor='gray.100'
        >
          <Skeleton height='24px' width='100px' />
          <Skeleton height='28px' width='80px' borderRadius='md' />
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};
