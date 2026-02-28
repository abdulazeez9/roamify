'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Heading,
  Box,
  Text,
  Spinner,
  Badge,
  Stack,
  Separator,
  Button,
  HStack,
  Image,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiTag,
} from 'react-icons/fi';
import { useEvent, useDeleteEvent } from '@/hooks';
import { formatDate } from '@/utils/DateFormat';
import { DataTable } from '@/app/(dashboard)/_components/table/DataTable';
import { LoadingState } from '@/components/ui/LoadingState';
import { formatTime } from '@/utils/TimeFormat';
import { Timer } from 'lucide-react';

export default function EventAdminDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: response, isLoading } = useEvent(id);

  const event = response?.data;

  const { mutate: deleteEvent } = useDeleteEvent();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!event) {
    return (
      <Container maxW='container.lg' py={8}>
        <Text>Event not found</Text>
      </Container>
    );
  }

  const handleDelete = () => {
    if (
      confirm(
        'Are you sure you want to delete this event? This action cannot be undone.',
      )
    ) {
      deleteEvent(id, {
        onSuccess: () => router.push('/admin/events'),
      });
    }
  };

  return (
    <Container maxW='container.lg' py={8}>
      <Stack gap={6}>
        {/* Header with Actions */}
        <HStack justify='space-between'>
          <Box>
            <Badge colorPalette={event.isSignature ? 'purple' : 'gray'} mb={2}>
              {event.isSignature ? 'Signature Event' : 'Standard Event'}
            </Badge>
            <Heading size='2xl'>{event.title}</Heading>
          </Box>
          <HStack>
            <Button
              colorPalette='blue'
              onClick={() => router.push(`/admin/events/${id}/edit`)}
            >
              <FiEdit2 /> Edit
            </Button>
            <Button colorPalette='red' variant='outline' onClick={handleDelete}>
              <FiTrash2 /> Delete
            </Button>
          </HStack>
        </HStack>

        {/* Event Banner */}
        {event.mediaUrl && (
          <Box rounded='lg' overflow='hidden' maxH='400px'>
            <Image
              src={event.mediaUrl}
              alt={event.title}
              width='100%'
              objectFit='cover'
            />
          </Box>
        )}

        {/* Event Details Grid */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          <Box p={4} borderWidth='1px' rounded='lg'>
            <HStack mb={2}>
              <FiCalendar />
              <Text fontWeight='bold'>Event Date</Text>
            </HStack>
            <Text color='fg.muted'>{formatDate(event.date)}</Text>
          </Box>
          <Box p={4} borderWidth='1px' rounded='lg'>
            <HStack mb={2}>
              <Timer />
              <Text fontWeight='bold'>Schedule</Text>
            </HStack>
            <Text fontWeight='bold' color='cyan.600' fontSize='lg'>
              {formatTime(event.time)}
            </Text>
          </Box>

          <Box p={4} borderWidth='1px' rounded='lg'>
            <HStack mb={2}>
              <FiMapPin />
              <Text fontWeight='bold'>Location</Text>
            </HStack>
            <Text color='fg.muted'>{event.location}</Text>
          </Box>

          <Box p={4} borderWidth='1px' rounded='lg'>
            <HStack mb={2}>
              <FiUsers />
              <Text fontWeight='bold'>Available Spots</Text>
            </HStack>
            <Badge
              colorPalette={event.spotLeft > 5 ? 'green' : 'red'}
              size='lg'
            >
              {event.spotLeft} /{' '}
              {event.spotLeft + (event._count?.registrations || 0)}
            </Badge>
          </Box>

          <Box p={4} borderWidth='1px' rounded='lg'>
            <HStack mb={2}>
              <FiTag />
              <Text fontWeight='bold'>Pricing</Text>
            </HStack>
            <Badge colorPalette={event.pricing === 'FREE' ? 'green' : 'yellow'}>
              {event.pricing}
            </Badge>
          </Box>
        </SimpleGrid>

        {/* Description */}
        <Box p={4} borderWidth='1px' rounded='lg'>
          <Heading size='md' mb={3}>
            Description
          </Heading>
          <Text whiteSpace='pre-wrap'>{event.description}</Text>
        </Box>

        {/* Additional Info */}
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <Box p={4} borderWidth='1px' rounded='lg'>
            <Text fontWeight='bold' mb={2}>
              Registration Deadline
            </Text>
            <Text color='fg.muted'>{formatDate(event.joinTill)}</Text>
          </Box>

          {event.cancellationTerms && (
            <Box p={4} borderWidth='1px' rounded='lg'>
              <Text fontWeight='bold' mb={2}>
                Cancellation Policy
              </Text>
              <Text color='fg.muted'>{event.cancellationTerms}</Text>
            </Box>
          )}
        </SimpleGrid>

        <Separator />

        {/* Registrations Table */}
        <Box>
          <HStack justify='space-between' mb={4}>
            <Heading size='md'>
              Registrations ({event._count?.registrations || 0})
            </Heading>
          </HStack>

          <Box
            border='1px solid'
            borderColor='border.muted'
            rounded='lg'
            overflow='hidden'
          >
            {event.registrations && event.registrations.length > 0 ? (
              <DataTable
                columns={[
                  {
                    label: 'User',
                    key: 'user' as any,
                    render: (u: any) => (
                      <Box>
                        <Text fontWeight='medium'>{u.name}</Text>
                        <Text fontSize='sm' color='fg.muted'>
                          ID: {u.id.slice(0, 8)}...
                        </Text>
                      </Box>
                    ),
                  },
                  {
                    label: 'Status',
                    key: 'status' as any,
                    render: (s: any) => (
                      <Badge
                        colorPalette={
                          s === 'CONFIRMED'
                            ? 'green'
                            : s === 'CANCELLED'
                              ? 'red'
                              : 'gray'
                        }
                      >
                        {s}
                      </Badge>
                    ),
                  },
                  {
                    label: 'Registered At',
                    key: 'createdAt' as any,
                    render: (date: any) => formatDate(date),
                  },
                ]}
                data={event.registrations}
              />
            ) : (
              <Box p={8} textAlign='center'>
                <Text color='fg.muted'>No registrations yet</Text>
              </Box>
            )}
          </Box>
        </Box>

        {/* Event Metadata */}
        <Box p={4} bg='bg.muted' rounded='lg'>
          <Text fontSize='sm' color='fg.muted'>
            Created by: {event.creator?.name || 'Unknown'} •{' '}
            {formatDate(event.createdAt)}
          </Text>
        </Box>
      </Stack>
    </Container>
  );
}
