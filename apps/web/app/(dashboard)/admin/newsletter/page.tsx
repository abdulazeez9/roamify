'use client';

import React from 'react';
import { Box, Heading, Skeleton, Text, Stack } from '@chakra-ui/react';
import { Column, DataTable } from '../../_components/table/DataTable';
import { useNewsletterSubscribers } from '@/hooks/api/use-newsletter';

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export default function NewsletterAdminView() {
  const { data, isLoading, isError } = useNewsletterSubscribers();

  const columns: Column<Subscriber>[] = [
    {
      label: 'Email Address',
      key: 'email',
      render: (value) => (
        <Text fontWeight='medium' color='blue.600'>
          {value}
        </Text>
      ),
    },
    {
      label: 'Subscription Date',
      key: 'createdAt',
      render: (value) =>
        new Date(value).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      label: 'ID',
      key: 'id',
      render: (value) => (
        <Text fontSize='xs' color='gray.500'>
          {value}
        </Text>
      ),
    },
  ];

  if (isError) return <Text color='red.500'>Failed to load subscribers.</Text>;

  return (
    <Box p={6} bg='white' borderRadius='lg' shadow='sm'>
      <Stack mb={6} direction='row' justify='space-between' align='center'>
        <Box>
          <Heading size='lg'>Newsletter Movement</Heading>
          <Text color='gray.600' fontSize='sm'>
            Total joined: {data?.data?.length || 0}
          </Text>
        </Box>
      </Stack>

      <Skeleton loading={isLoading}>
        <DataTable columns={columns} data={data?.data || []} />
      </Skeleton>

      {!isLoading && data?.data?.length === 0 && (
        <Text textAlign='center' py={10} color='gray.500'>
          No one has joined the movement yet.
        </Text>
      )}
    </Box>
  );
}
