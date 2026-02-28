'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Field, Stack, Heading, Text } from '@chakra-ui/react';
import Button from '@/components/ui/button/Button';
import { PasswordInput } from '@/components/ui/input/password-input';
import { usePassword } from '@/hooks';
import { toaster } from '@/components/ui/toaster';

export function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const { resetPassword, isResetting } = usePassword();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toaster.create({
        title: 'Invalid Reset Link',
        description:
          'No token found in URL. Please use the link from your email.',
        type: 'error',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toaster.create({
        title: 'Passwords Do Not Match',
        description: 'Please ensure both passwords are the same',
        type: 'error',
      });
      return;
    }

    resetPassword({ token, newPassword });
  };

  return (
    <Box
      w='full'
      maxW='md'
      p={8}
      borderWidth={1}
      borderRadius='lg'
      bg='textInverse'
      my={10}
      mx={{ md: 'auto' }}
    >
      <Stack gap={6}>
        <Stack gap={1} textAlign='center'>
          <Heading
            size={{ base: 'lg', md: '2xl' }}
            color='primary'
            fontWeight='bold'
          >
            Set New Password
          </Heading>
          <Text fontSize='sm' color='fg.muted'>
            Ensure your new password is strong
          </Text>
        </Stack>

        <form onSubmit={handleFormSubmit}>
          <Stack gap={4}>
            <Field.Root>
              <Field.Label>New Password</Field.Label>
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder='Enter new password'
                required
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Confirm New Password</Field.Label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='Confirm new password'
                required
              />
            </Field.Root>

            <Button
              type='submit'
              loading={isResetting}
              bg='primary'
              width='full'
            >
              Update Password
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}
