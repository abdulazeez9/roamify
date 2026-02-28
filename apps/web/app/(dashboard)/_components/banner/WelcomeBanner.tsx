'use client';

import { useUserProfile } from '@/hooks';
import { Box, Text } from '@chakra-ui/react';

export const WelcomeBanner = () => {
  const { data: userProfile, isLoading } = useUserProfile();

  const userName = userProfile?.data?.name || 'User';

  if (isLoading) {
    return null;
  }

  return (
    <Box mb={6}>
      <Text
        fontSize={{ base: 'xl', md: '2xl' }}
        color='fg.default'
        fontWeight='bold'
      >
        Welcome back, {userName}! 👋
      </Text>
    </Box>
  );
};
