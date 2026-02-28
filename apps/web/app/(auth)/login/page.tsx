'use client';

import { LoginForm } from '@/components/auth/login/LoginForm';
import { Box } from '@chakra-ui/react';

export default function LoginPage() {
  return (
    <Box my={10} p={4}>
      <LoginForm />
    </Box>
  );
}
