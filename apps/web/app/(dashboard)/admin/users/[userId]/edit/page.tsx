'use client';

import React from 'react';
import {
  Box,
  Heading,
  HStack,
  Text,
  Stack,
  Grid,
  GridItem,
  Button,
  Card,
  Input,
  Field,
  NativeSelect,
} from '@chakra-ui/react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useUser, useUpdateUserStatus, useUpdateUserById } from '@/hooks';
import { LoadingState } from '@/components/ui/LoadingState';
import { ArrowLeft, Save } from 'lucide-react';

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  role: string;
  status: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;

  const { data: response, isLoading, isError } = useUser(userId);
  const updateProfileMutation = useUpdateUserById();
  const updateStatusMutation = useUpdateUserStatus();
  const user = response?.data;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UserFormData>();

  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        country: user.country || '',
        role: user.role,
        status: user.status,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      // ✅ Use the new hook with userId and data
      await updateProfileMutation.mutateAsync({
        id: userId,
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          country: data.country,
        },
      });

      // Update status if changed
      if (data.status !== user?.status) {
        await updateStatusMutation.mutateAsync({
          id: userId,
          status: data.status,
        });
      }

      router.push(`/admin/users/${userId}`);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  if (isLoading) return <LoadingState message='Loading user data...' />;
  if (isError || !user)
    return (
      <Box p={8}>
        <Text color='red.500'>Failed to load user data.</Text>
      </Box>
    );

  const isSuperAdmin = user.role === 'SUPER_ADMIN';

  return (
    <Box p={8} bg='bg.canvas' minH='100vh'>
      <HStack justify='space-between' mb={6}>
        <HStack gap={4}>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => router.push(`/admin/users/${userId}`)}
          >
            <ArrowLeft size={16} /> Back
          </Button>
          <Heading size='lg'>Edit User</Heading>
        </HStack>
      </HStack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid templateColumns='repeat(2, 1fr)' gap={6}>
          {/* Basic Information */}
          <GridItem colSpan={{ base: 2, md: 1 }}>
            <Card.Root>
              <Card.Header>
                <Heading size='md'>Basic Information</Heading>
              </Card.Header>
              <Card.Body>
                <Stack gap={4}>
                  <Field.Root invalid={!!errors.name}>
                    <Field.Label>Full Name</Field.Label>
                    <Input
                      {...register('name', { required: 'Name is required' })}
                      placeholder='Enter full name'
                    />
                    {errors.name && (
                      <Field.ErrorText>{errors.name.message}</Field.ErrorText>
                    )}
                  </Field.Root>

                  <Field.Root invalid={!!errors.email}>
                    <Field.Label>Email</Field.Label>
                    <Input
                      type='email'
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email',
                        },
                      })}
                      placeholder='Enter email'
                    />
                    {errors.email && (
                      <Field.ErrorText>{errors.email.message}</Field.ErrorText>
                    )}
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Phone</Field.Label>
                    <Input
                      {...register('phone')}
                      placeholder='Enter phone number'
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Country</Field.Label>
                    <Input
                      {...register('country')}
                      placeholder='Enter country'
                    />
                  </Field.Root>
                </Stack>
              </Card.Body>
            </Card.Root>
          </GridItem>

          {/* Account Settings */}
          <GridItem colSpan={{ base: 2, md: 1 }}>
            <Card.Root>
              <Card.Header>
                <Heading size='md'>Account Settings</Heading>
              </Card.Header>
              <Card.Body>
                <Stack gap={4}>
                  <Field.Root disabled={isSuperAdmin}>
                    <Field.Label>Role</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        {...register('role')}
                        placeholder='Select role'
                      >
                        <option value='SUPER_ADMIN'>Super Admin</option>
                        <option value='ADMIN'>Admin</option>
                        <option value='AFFILIATE'>Affiliate</option>
                        <option value='ADVENTURER'>Adventurer</option>
                        <option value='INDEPENDENT_AGENT'>
                          Independent Agent
                        </option>
                        <option value='COOPERATE_AGENT'>Corporate Agent</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                    <Field.HelperText>
                      {isSuperAdmin
                        ? 'Super Admin role cannot be changed'
                        : 'Select user role'}
                    </Field.HelperText>
                  </Field.Root>

                  <Field.Root disabled={isSuperAdmin}>
                    <Field.Label>Status</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        {...register('status')}
                        placeholder='Select status'
                      >
                        <option value='ACTIVE'>Active</option>
                        <option value='SUSPENDED'>Suspended</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Referral Code</Field.Label>
                    <Input
                      value={user.referralCode}
                      readOnly
                      variant='subtle'
                    />
                    <Field.HelperText>Read-only</Field.HelperText>
                  </Field.Root>
                </Stack>
              </Card.Body>
            </Card.Root>
          </GridItem>
        </Grid>

        <HStack justify='end' mt={6} gap={3}>
          <Button
            variant='outline'
            onClick={() => router.push(`/admin/users/${userId}`)}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            colorPalette='blue'
            disabled={!isDirty}
            loading={
              updateProfileMutation.isPending || updateStatusMutation.isPending
            }
          >
            <Save size={16} /> Save Changes
          </Button>
        </HStack>
      </form>
    </Box>
  );
}
