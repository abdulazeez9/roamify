'use client';

import React from 'react';
import {
  Text,
  HStack,
  IconButton,
  Badge,
  VStack,
  Box,
  Drawer,
  Portal,
  Button,
  CloseButton,
  Heading,
  Stack,
  Separator,
} from '@chakra-ui/react';
import {
  PhoneCall,
  Trash2,
  CheckCircle,
  Eye,
  User,
  Mail,
  Phone,
  Clock,
} from 'lucide-react';
import { useCallbackRequests, useDeleteCallbackRequest } from '@/hooks';
import { Column, DataTable } from '../../_components/table/DataTable';
import { AvatarImage } from '@/components/media/AvatarImage';
import { PaginationControl } from '@/components/ui/pagination/PaginationControl';
import { CallbackRequestResponseDto } from '@zagotours/types';
import AdminTableWrapper from '../../_components/table/AdminTableWrapper';
import { DataTableSkeleton } from '../../_components/table/Datatableskeleton';

export default function DashboardCallbacks() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedCallback, setSelectedCallback] =
    React.useState<CallbackRequestResponseDto | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const { data: response, isLoading } = useCallbackRequests({
    page: currentPage,
  });
  const deleteMutation = useDeleteCallbackRequest();

  const handleView = (callback: CallbackRequestResponseDto) => {
    setSelectedCallback(callback);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (callback: CallbackRequestResponseDto) => {
    if (
      window.confirm(
        `Are you sure you want to delete the callback request from ${callback.name}?`,
      )
    ) {
      try {
        await deleteMutation.mutateAsync(callback.id);
        if (selectedCallback?.id === callback.id) {
          setIsDrawerOpen(false);
          setSelectedCallback(null);
        }
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleMarkDone = (callback: CallbackRequestResponseDto) => {
    // Implement mark as done functionality
    console.log('Mark done:', callback.id);
    // You might want to add a mutation hook for this
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedCallback(null), 300);
  };

  const columns: Column<CallbackRequestResponseDto>[] = [
    {
      label: 'Requester',
      key: 'name',
      render: (_, row) => (
        <HStack gap={3}>
          <AvatarImage src={row.image} name={row.name} size='sm' />
          <VStack align='start' gap={0}>
            <Text fontWeight='medium' fontSize='sm'>
              {row.name}
            </Text>
            <Text fontSize='xs' color='fg.muted'>
              {row.email}
            </Text>
          </VStack>
        </HStack>
      ),
    },
    {
      label: 'Phone',
      key: 'phone',
      render: (v) => (
        <HStack gap={2}>
          <Phone size={14} color='var(--chakra-colors-green-500)' />
          <Text fontSize='sm' fontWeight='medium'>
            {v}
          </Text>
        </HStack>
      ),
    },
    {
      label: 'Preferred Time',
      key: 'bestTime',
      render: (v) => (
        <Badge colorPalette='cyan' variant='subtle'>
          {v}
        </Badge>
      ),
    },
    {
      label: 'Submitted',
      key: 'createdAt',
      render: (v) => (
        <VStack align='start' gap={0}>
          <Text fontSize='sm' fontWeight='medium'>
            {new Date(v).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </Text>
          <Text fontSize='xs' color='fg.muted'>
            {new Date(v).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </VStack>
      ),
    },
    {
      label: 'Actions',
      key: 'id',
      render: (_, callback) => (
        <HStack gap={2} justify='end'>
          <IconButton
            aria-label='View Details'
            variant='ghost'
            size='sm'
            colorPalette='blue'
            onClick={() => handleView(callback)}
          >
            <Eye size={16} />
          </IconButton>
          <IconButton
            aria-label='Mark as Done'
            variant='ghost'
            size='sm'
            colorPalette='green'
            onClick={() => handleMarkDone(callback)}
          >
            <CheckCircle size={16} />
          </IconButton>
          <IconButton
            aria-label='Delete'
            variant='ghost'
            size='sm'
            colorPalette='red'
            onClick={() => handleDelete(callback)}
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
        title='Callback Requests'
        hasData={!!response?.data?.length}
        emptyIcon={<PhoneCall size={40} />}
        emptyText='No pending callback requests at the moment.'
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
                    <PhoneCall size={20} />
                    <span>Callback Request Details</span>
                  </HStack>
                </Drawer.Title>
              </Drawer.Header>

              <Drawer.Body py={6}>
                {selectedCallback && (
                  <Stack gap={6}>
                    {/* Requester Info */}
                    <Box>
                      <Text fontSize='sm' color='fg.muted' mb={3}>
                        Requester Information
                      </Text>
                      <VStack align='stretch' gap={4}>
                        {/* Avatar and Name */}
                        <HStack
                          gap={3}
                          p={4}
                          bg='bg.muted'
                          borderRadius='md'
                          borderWidth='1px'
                        >
                          <AvatarImage
                            src={selectedCallback.image}
                            name={selectedCallback.name}
                            size='lg'
                          />
                          <VStack align='start' gap={1}>
                            <HStack gap={2}>
                              <User size={14} />
                              <Text fontWeight='semibold' fontSize='lg'>
                                {selectedCallback.name}
                              </Text>
                            </HStack>
                          </VStack>
                        </HStack>

                        {/* Email */}
                        <HStack
                          gap={3}
                          p={3}
                          bg='bg.muted'
                          borderRadius='md'
                          borderWidth='1px'
                        >
                          <Mail
                            size={18}
                            color='var(--chakra-colors-blue-500)'
                          />
                          <VStack align='start' gap={0}>
                            <Text fontSize='xs' color='fg.muted'>
                              Email Address
                            </Text>
                            <Text fontSize='sm' fontWeight='medium'>
                              {selectedCallback.email}
                            </Text>
                          </VStack>
                        </HStack>

                        {/* Phone */}
                        <HStack
                          gap={3}
                          p={3}
                          bg='green.50'
                          borderRadius='md'
                          borderWidth='1px'
                          borderColor='green.200'
                        >
                          <Phone
                            size={18}
                            color='var(--chakra-colors-green-600)'
                          />
                          <VStack align='start' gap={0}>
                            <Text fontSize='xs' color='fg.muted'>
                              Phone Number
                            </Text>
                            <Text
                              fontSize='md'
                              fontWeight='semibold'
                              color='green.700'
                            >
                              {selectedCallback.phone}
                            </Text>
                          </VStack>
                        </HStack>
                      </VStack>
                    </Box>

                    <Separator />

                    {/* Preferred Time */}
                    <Box>
                      <Text fontSize='sm' color='fg.muted' mb={3}>
                        Preferred Callback Time
                      </Text>
                      <HStack
                        gap={3}
                        p={4}
                        bg='cyan.50'
                        borderRadius='md'
                        borderWidth='1px'
                        borderColor='cyan.200'
                      >
                        <Clock
                          size={20}
                          color='var(--chakra-colors-cyan-600)'
                        />
                        <VStack align='start' gap={0}>
                          <Text fontSize='xs' color='fg.muted'>
                            Best Time to Call
                          </Text>
                          <Badge size='lg' colorPalette='cyan' variant='solid'>
                            {selectedCallback.bestTime}
                          </Badge>
                        </VStack>
                      </HStack>
                    </Box>

                    <Separator />

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
                            {selectedCallback.id}
                          </Text>
                        </Text>
                        <Text>
                          Submitted:{' '}
                          {new Date(selectedCallback.createdAt).toLocaleString(
                            'en-US',
                            {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            },
                          )}
                        </Text>
                      </VStack>
                    </Box>

                    <Separator />

                    {/* Quick Actions */}
                    <Box
                      p={4}
                      bg='blue.50'
                      borderRadius='md'
                      borderWidth='1px'
                      borderColor='blue.200'
                    >
                      <Text
                        fontSize='sm'
                        fontWeight='semibold'
                        mb={2}
                        color='blue.800'
                      >
                        Quick Actions
                      </Text>
                      <VStack align='stretch' gap={2}>
                        <Button
                          size='sm'
                          variant='outline'
                          bg='primary'
                          color='white'
                          onClick={() =>
                            (window.location.href = `tel:${selectedCallback.phone}`)
                          }
                        >
                          <Phone size={14} />
                          Call Now
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          colorPalette='blue'
                          onClick={() =>
                            (window.location.href = `mailto:${selectedCallback.email}`)
                          }
                        >
                          <Mail size={14} />
                          Send Email
                        </Button>
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
                  colorPalette='green'
                  onClick={() =>
                    selectedCallback && handleMarkDone(selectedCallback)
                  }
                >
                  <CheckCircle size={16} />
                  Mark as Done
                </Button>
                <Button
                  colorPalette='red'
                  onClick={() =>
                    selectedCallback && handleDelete(selectedCallback)
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
