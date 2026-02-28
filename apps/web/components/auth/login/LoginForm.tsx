'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Stack, Heading, Text, VStack } from '@chakra-ui/react';
import Button from '@/components/ui/button/Button';
import { FormInput } from '@/components/ui/input/FormInput';
import { PasswordInput } from '@/components/ui/input/password-input';
import { LoginFormData, loginSchema } from '@/app/validations/auth-validation';
import { useAuth } from '@/hooks';
import { AppLink } from '@/components/ui/link/AppLink';

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <Box
      w='full'
      maxW='md'
      p={8}
      borderWidth={1}
      borderRadius='lg'
      bg='white'
      mx='auto'
      boxShadow='sm'
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={6} align='stretch'>
          <Stack gap={1} textAlign='center'>
            <Heading size='xl' color='primary'>
              Welcome Back
            </Heading>
            <Text fontSize='sm' color='fg.muted'>
              Enter details to sign in
            </Text>
          </Stack>

          <Stack gap={4}>
            {/* SERVER-SIDE ERROR DISPLAY */}
            {/* {loginError && (
              <Box
                p={3}
                bg='red.50'
                borderWidth={1}
                borderColor='red.200'
                borderRadius='md'
              >
                <Text color='red.700' fontSize='sm'>
                  {loginError instanceof Error &&
                  loginError.message === 'CredentialsSignin'
                    ? 'Invalid email or password. Please try again.'
                    : loginError.message}
                </Text>
              </Box>
            )} */}

            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label='Email'
                  type='email'
                  placeholder='email@example.com'
                  errorText={errors.email?.message}
                  disabled={isLoggingIn}
                />
              )}
            />

            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <Stack gap={1}>
                  <Text fontWeight='bold' fontSize='sm'>
                    Password
                  </Text>
                  <PasswordInput
                    {...field}
                    placeholder='********'
                    disabled={isLoggingIn}
                  />
                  {errors.password && (
                    <Text color='red.500' fontSize='xs'>
                      {errors.password.message}
                    </Text>
                  )}
                </Stack>
              )}
            />

            <Button
              type='submit'
              loading={isLoggingIn}
              width='full'
              bg='primary'
              color='white'
              mt={2}
            >
              Sign In
            </Button>
          </Stack>
          <Text textAlign='center' color='primary'>
            <AppLink href='/forgot-password' textDecor='underline'>
              Forgot password?
            </AppLink>
          </Text>
        </VStack>
      </form>
    </Box>
  );
}
