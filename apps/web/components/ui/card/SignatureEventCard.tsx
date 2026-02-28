'use client';
import { ResponsiveImage } from '@/components/media/ResponsiveImage';
import { Text, Stack, Card, Box } from '@chakra-ui/react';

interface SignatureEventProps {
  url: string;
  title: string;
  description: string;
}

export const SignatureEventCard = ({
  title,
  url,
  description,
}: SignatureEventProps) => {
  return (
    <Card.Root
      overflow='hidden'
      variant='subtle'
      bg='white'
      flexDirection={{ base: 'column', sm: 'row' }}
      width='full'
      height={{ sm: '200px' }}
      border='1px solid'
      borderColor='gray.200'
      borderRadius='xl'
    >
      {/* Media on the Left */}
      <Box
        minW={{ base: 'full', sm: '200px' }}
        maxW={{ base: 'full', sm: '250px' }}
        height={{ base: '200px', sm: 'full' }}
      >
        <ResponsiveImage
          src={url}
          alt={title}
          height='100%'
          width='100%'
          objectFit='cover'
          borderRadius='none'
          priority={true}
        />
      </Box>

      {/* Title and Description on the Right */}
      <Stack flex='1' justify='center'>
        <Card.Body p={4}>
          <Card.Title mb='2' fontSize='xl' color='primary'>
            {title}
          </Card.Title>
          <Text color='gray.600' lineClamp={3} fontSize='sm'>
            {description}
          </Text>
        </Card.Body>
      </Stack>
    </Card.Root>
  );
};
