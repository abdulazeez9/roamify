'use client';

import { Box, Flex, Text, RatingGroup, Stack } from '@chakra-ui/react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  avatarUrl?: string;
  rating: number;
}

export const TestimonialCard = ({
  quote,
  author,
  avatarUrl,
  rating,
}: TestimonialCardProps) => {
  return (
    <Box
      width='100%'
      minH={{ base: 'auto', md: '230px' }}
      maxH={{ base: 'auto', md: '230px' }}
      display='flex'
      flexDirection='column'
      bg='white'
      p={{ base: 6, md: 6 }}
      borderRadius='2xl'
      borderWidth='1px'
      boxShadow='sm'
      textAlign={{ base: 'center', md: 'left' }}
    >
      <Text
        fontStyle='italic'
        color='gray.600'
        fontSize='md'
        lineHeight='relaxed'
        lineClamp={4}
        flex='1'
        overflow='hidden'
      >
        "{quote}"
      </Text>

      <Flex
        direction={{ base: 'column', md: 'row' }}
        mt='auto'
        align='center'
        justify='space-between'
        gap={{ base: 4, md: 0 }}
        pt='4'
        flexShrink={0}
      >
        <Box order={{ base: 1, md: 2 }}>
          <RatingGroup.Root
            count={5}
            value={rating}
            readOnly
            size='xs'
            colorPalette='yellow'
          >
            <RatingGroup.HiddenInput />
            <RatingGroup.Control aria-hidden='true' />
          </RatingGroup.Root>
        </Box>

        <Flex direction='row' align='center' gap='3' order={{ base: 2, md: 1 }}>
          <Stack gap='0' textAlign='left'>
            <Text fontWeight='bold' fontSize='sm' color='gray.800'>
              {author}
            </Text>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};
