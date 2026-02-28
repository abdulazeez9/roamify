'use client';

import React from 'react';
import {
  Text,
  Badge,
  VStack,
  IconButton,
  HStack,
  Box,
  Drawer,
  Portal,
  Flex,
  Button,
  CloseButton,
  Heading,
  Stack,
  Separator,
} from '@chakra-ui/react';
import { useTripRequests, useDeleteTripRequest } from '@/hooks';
import { Column, DataTable } from '../../_components/table/DataTable';
import { PaginationControl } from '@/components/ui/pagination/PaginationControl';
import {
  Eye,
  Trash2,
  Plane,
  Calendar,
  MapPin,
  FileText,
  User,
  Mail,
} from 'lucide-react';
import { TripRequestResponseDto } from '@zagotours/types';
import AdminTableWrapper from '../../_components/table/AdminTableWrapper';
import { DataTableSkeleton } from '../../_components/table/Datatableskeleton';

export default function DashboardTripRequest() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedRequest, setSelectedRequest] =
    React.useState<TripRequestResponseDto | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const {
    data: response,
    isLoading,
    isError,
  } = useTripRequests({ page: currentPage });

  const deleteMutation = useDeleteTripRequest();

  const handleView = (request: TripRequestResponseDto) => {
    setSelectedRequest(request);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (request: TripRequestResponseDto) => {
    if (
      window.confirm(
        `Are you sure you want to delete the trip request to ${request.destination}?`,
      )
    ) {
      try {
        await deleteMutation.mutateAsync(request.id);
        if (selectedRequest?.id === request.id) {
          setIsDrawerOpen(false);
          setSelectedRequest(null);
        }
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedRequest(null), 300);
  };

  const columns: Column<TripRequestResponseDto>[] = [
    {
      label: 'Destination',
      key: 'destination',
      render: (val) => (
        <HStack gap={2}>
          <MapPin size={16} color='var(--chakra-colors-blue-500)' />
          <Text fontWeight='semibold' color='blue.600'>
            {val}
          </Text>
        </HStack>
      ),
    },
    {
      label: 'Trip Type',
      key: 'tripType',
      render: (val) => (
        <Badge variant='subtle' colorPalette='purple'>
          {val.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      label: 'Travel Date',
      key: 'date',
      render: (date) => (
        <VStack align='start' gap={0}>
          <Text fontSize='sm' fontWeight='medium'>
            {new Date(date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
          <Text fontSize='xs' color='fg.muted'>
            Planned Date
          </Text>
        </VStack>
      ),
    },
    {
      label: 'Preferences',
      key: 'preferences',
      render: (val) => (
        <Text fontSize='sm' color='fg.muted' truncate maxW='200px'>
          {val || 'No special preferences'}
        </Text>
      ),
    },
    {
      label: 'Actions',
      key: 'id',
      render: (_, request) => (
        <HStack gap={2} justify='end'>
          <IconButton
            aria-label='View Details'
            variant='ghost'
            size='sm'
            colorPalette='blue'
            onClick={() => handleView(request)}
          >
            <Eye size={16} />
          </IconButton>
          <IconButton
            aria-label='Delete Request'
            variant='ghost'
            size='sm'
            colorPalette='red'
            onClick={() => handleDelete(request)}
            loading={deleteMutation.isPending}
          >
            <Trash2 size={16} />
          </IconButton>
        </HStack>
      ),
    },
  ];

  if (isLoading) return <DataTableSkeleton columns={5} />;

  return (
    <>
      <AdminTableWrapper
        title='Trip Planning Requests'
        hasData={!!(response?.data && response.data.length > 0)}
        emptyIcon={<Plane size={40} />}
        emptyText='No trip requests have been submitted yet.'
      >
        <DataTable columns={columns} data={response?.data ?? []} />
        {response?.pagination && (
          <Box borderTopWidth='1px' py={4}>
            <PaginationControl
              pagination={response.pagination}
              onPageChange={setCurrentPage}
            />
          </Box>
        )}
      </AdminTableWrapper>

      {/* Chakra v3 Drawer for viewing details */}
      <Drawer.Root
        open={isDrawerOpen}
        onOpenChange={(e) => !e.open && handleCloseDrawer()}
        size='md'
        placement='end'
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header borderBottomWidth='1px'>
                <Drawer.Title>
                  <HStack gap={2}>
                    <Plane size={20} />
                    <span>Trip Request Details</span>
                  </HStack>
                </Drawer.Title>
              </Drawer.Header>

              <Drawer.Body py={6} overflow='auto'>
                {selectedRequest && (
                  <Stack gap={6}>
                    {/* Destination Section */}
                    <Flex align='center' justify='space-between'>
                      <Box>
                        <Text fontSize='sm' color='fg.muted' mb={2}>
                          Name
                        </Text>
                        <HStack gap={2}>
                          <User
                            size={18}
                            color='var(--chakra-colors-blue-500)'
                          />
                          <Heading size='lg' color='blue.600'>
                            {selectedRequest?.adventurer?.name}
                          </Heading>
                        </HStack>
                      </Box>
                      <Box>
                        <Text fontSize='sm' color='fg.muted' mb={2}>
                          Email
                        </Text>
                        <HStack gap={2}>
                          <Mail
                            size={18}
                            color='var(--chakra-colors-blue-500)'
                          />
                          <Heading size='lg' color='blue.600'>
                            {selectedRequest.adventurer.email}
                          </Heading>
                        </HStack>
                      </Box>
                    </Flex>

                    <Separator />
                    {/* Destination Section */}
                    <Box>
                      <Text fontSize='sm' color='fg.muted' mb={2}>
                        Destination
                      </Text>
                      <HStack gap={2}>
                        <MapPin
                          size={18}
                          color='var(--chakra-colors-blue-500)'
                        />
                        <Heading size='lg' color='blue.600'>
                          {selectedRequest.destination}
                        </Heading>
                      </HStack>
                    </Box>

                    <Separator />

                    {/* Trip Type */}
                    <Box>
                      <Text fontSize='sm' color='fg.muted' mb={2}>
                        Trip Type
                      </Text>
                      <Badge size='lg' variant='subtle' colorPalette='purple'>
                        {selectedRequest.tripType.replace('_', ' ')}
                      </Badge>
                    </Box>

                    <Separator />

                    {/* Travel Date */}
                    <Box>
                      <Text fontSize='sm' color='fg.muted' mb={2}>
                        Travel Date
                      </Text>
                      <HStack gap={2}>
                        <Calendar
                          size={18}
                          color='var(--chakra-colors-green-500)'
                        />
                        <VStack align='start' gap={0}>
                          <Text fontSize='md' fontWeight='semibold'>
                            {new Date(selectedRequest.date).toLocaleDateString(
                              'en-US',
                              {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              },
                            )}
                          </Text>
                          <Text fontSize='xs' color='fg.muted'>
                            {new Date(selectedRequest.date).toLocaleTimeString(
                              'en-US',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              },
                            )}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>

                    <Separator />

                    {/* Preferences */}
                    <Box>
                      <HStack gap={2} mb={2}>
                        <FileText
                          size={16}
                          color='var(--chakra-colors-gray-500)'
                        />
                        <Text fontSize='sm' color='fg.muted'>
                          Preferences & Notes
                        </Text>
                      </HStack>
                      <Box
                        p={4}
                        bg='bg.muted'
                        borderRadius='md'
                        borderWidth='1px'
                      >
                        <Text fontSize='sm' lineHeight='tall'>
                          {selectedRequest.preferences ||
                            'No special preferences provided'}
                        </Text>
                      </Box>
                    </Box>

                    {/* Metadata */}
                    <Box>
                      <Text fontSize='sm' color='fg.muted' mb={2}>
                        Request Information
                      </Text>
                      <VStack
                        align='start'
                        gap={1}
                        fontSize='xs'
                        color='fg.muted'
                      >
                        <Text>
                          Request ID:{' '}
                          <Text as='span' fontFamily='mono'>
                            {selectedRequest.id}
                          </Text>
                        </Text>
                        {selectedRequest.createdAt && (
                          <Text>
                            Created:{' '}
                            {new Date(
                              selectedRequest.createdAt,
                            ).toLocaleString()}
                          </Text>
                        )}
                      </VStack>
                    </Box>
                  </Stack>
                )}
              </Drawer.Body>

              <Drawer.Footer borderTopWidth='1px' gap={3}>
                <Button variant='outline' onClick={handleCloseDrawer}>
                  Close
                </Button>
                <Button
                  colorPalette='red'
                  onClick={() =>
                    selectedRequest && handleDelete(selectedRequest)
                  }
                  loading={deleteMutation.isPending}
                >
                  Delete Request
                </Button>
              </Drawer.Footer>

              <Drawer.CloseTrigger asChild>
                <CloseButton size='sm' />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
}
