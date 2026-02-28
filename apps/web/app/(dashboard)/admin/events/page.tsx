'use client';

import {
  Container,
  Heading,
  Button,
  HStack,
  Badge,
  IconButton,
  Box,
  Text,
  Center,
  Icon,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { useRouter, useSearchParams } from 'next/navigation';
import { EventResponseDto } from '@zagotours/types';
import { useDeleteEvent, useEvents } from '@/hooks';
import { formatDate } from '@/utils/DateFormat';
import { DataTable } from '../../_components/table/DataTable';
import { PaginationControl } from '@/components/ui/pagination/PaginationControl';
import { useState, Suspense } from 'react';
import { Grip } from 'lucide-react';
import { formatTime } from '@/utils/TimeFormat';
import { DataTableSkeleton } from '../../_components/table/Datatableskeleton';

function AdminEventsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 10;
  const [showPagination, setShowPagination] = useState(false);

  const { data: response, isLoading } = useEvents({ page, limit });
  const { mutate: deleteEvent } = useDeleteEvent();

  const events = response?.data || [];
  const pagination = response?.pagination;

  const columns = [
    {
      label: 'Title',
      key: 'title' as keyof EventResponseDto,
      render: (val: any, row: EventResponseDto) => (
        <Box>
          <Text fontWeight='bold'>{row.title}</Text>
          {row.isSignature && (
            <Badge colorPalette='purple' size='xs'>
              Signature
            </Badge>
          )}
        </Box>
      ),
    },
    {
      label: 'Date',
      key: 'date' as keyof EventResponseDto,
      render: (val: any) => formatDate(val),
    },
    {
      label: 'Time',
      key: 'date' as keyof EventResponseDto,
      render: (val: any) => (
        <Box>
          <Badge variant='subtle' colorPalette='blue' size='xs'>
            {formatTime(val)}
          </Badge>
        </Box>
      ),
    },
    {
      label: 'Location',
      key: 'location' as keyof EventResponseDto,
    },
    {
      label: 'Spots Left',
      key: 'spotLeft' as keyof EventResponseDto,
      render: (val: any) => (
        <Badge colorPalette={val > 5 ? 'green' : 'red'}>{val} spots</Badge>
      ),
    },
    {
      label: 'Registrations',
      key: '_count' as keyof EventResponseDto,
      render: (val: any) => <Text>{val?.registrations || 0}</Text>,
    },
    {
      label: 'Actions',
      key: 'id' as keyof EventResponseDto,
      render: (id: any) => (
        <HStack gap={2}>
          <IconButton
            size='sm'
            variant='ghost'
            onClick={() => router.push(`/admin/events/${id}`)}
          >
            <FiEye />
          </IconButton>
          <IconButton
            size='sm'
            variant='ghost'
            colorPalette='blue'
            onClick={() => router.push(`/admin/events/${id}/edit`)}
          >
            <FiEdit2 />
          </IconButton>
          <IconButton
            size='sm'
            variant='ghost'
            colorPalette='red'
            onClick={() => {
              if (confirm('Are you sure you want to delete this event?')) {
                deleteEvent(id);
              }
            }}
          >
            <FiTrash2 />
          </IconButton>
        </HStack>
      ),
    },
  ] as const;

  return (
    <Container maxW='container.xl' py={8}>
      <HStack justify='space-between' mb={6}>
        <Heading size='lg'>Manage Events</Heading>
        <Button
          bg='primary'
          color='white'
          onClick={() => router.push('/admin/events/create')}
        >
          <FiPlus /> Create Event
        </Button>
      </HStack>

      <Box
        bg='bg.panel'
        rounded='lg'
        shadow='sm'
        borderWidth='1px'
        overflow='hidden'
      >
        {isLoading && <DataTableSkeleton columns={5} />}

        {!isLoading && <DataTable columns={columns} data={events} />}

        {!isLoading && events.length === 0 && (
          <Center p={10}>
            <Box color='fg.muted'>No events found in the database.</Box>
          </Center>
        )}
      </Box>

      {!isLoading &&
        !showPagination &&
        pagination &&
        pagination.total > limit && (
          <Center mt={6}>
            <Button variant='outline' onClick={() => setShowPagination(true)}>
              <Icon as={Grip} mr='2' />
              Show Pagination (Total: {pagination.total})
            </Button>
          </Center>
        )}

      {!isLoading && showPagination && pagination && (
        <Box mt={6}>
          <PaginationControl
            pagination={pagination}
            onPageChange={(newPage) => {
              router.push(`/admin/events?page=${newPage}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </Box>
      )}
    </Container>
  );
}

export default function AdminEventsPage() {
  return (
    <Suspense fallback={<DataTableSkeleton columns={5} />}>
      <AdminEventsContent />
    </Suspense>
  );
}
