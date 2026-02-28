'use client';
import { Box, Icon, Stack, Text } from '@chakra-ui/react';
import Button from '../ui/button/Button';
import { ResponsiveImage } from '../media/ResponsiveImage';
import { ArrowRight } from 'lucide-react';
import { AppLink } from '../ui/link/AppLink';

export default function CommunityFooter() {
  return (
    <Stack spaceY={6} align='center' textAlign='center' px={4} py={16}>
      <Text fontSize='lg' fontWeight='semibold'>
        Adventure is not just a vacation. It’s a mindset.
      </Text>

      <Text maxW='600px'>
        If you care about how you travel, who you travel with, and what happens
        after you arrive, you belong here.
      </Text>

      <Button asChild bg='primary' color='white'>
        <AppLink href='/posts'>
          Join the community
          <Icon as={ArrowRight} ml={2} />
        </AppLink>
      </Button>

      {/* Image container */}
      <Box
        w='full'
        h={{ base: '220px', md: '320px' }}
        position='relative'
        borderRadius='lg'
        overflow='hidden'
      >
        <ResponsiveImage
          src='/images/community/community-post-banner.webp'
          alt='community footer image'
          loading='eager'
          priority
        />
      </Box>
    </Stack>
  );
}
