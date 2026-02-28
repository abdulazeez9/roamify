'use client';
import { AppLink } from '@/components/ui/link/AppLink';
import { Box, Heading, Text } from '@chakra-ui/react';

export function RegistrationHeader() {
  return (
    <Box textAlign='center'>
      <Heading
        mb={2}
        size={{ base: 'lg', md: '2xl' }}
        color='primary'
        fontWeight='bold'
      >
        Zago Tours
      </Heading>
      <Heading>Create an account</Heading>
      <Text>
        Already have an account?{' '}
        <AppLink href='/login' textDecor='underline'>
          Log in
        </AppLink>{' '}
      </Text>
    </Box>
  );
}
