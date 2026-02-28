'use client';

import React from 'react';
import {
  HStack,
  Text,
  Badge,
  VStack,
  Link,
  Box,
  Drawer,
  Portal,
  Button,
  CloseButton,
  Heading,
  Stack,
  Separator,
  IconButton,
} from '@chakra-ui/react';
import { TripPlanningCallResponseDto } from '@zagotours/types';
import {
  usePlanningCalls,
  useDeletePlanningCall,
  useCompletePlanningCall,
  useCancelPlanningCall,
} from '@/hooks';
import { Column, DataTable } from '../../_components/table/DataTable';
import { AvatarImage } from '@/components/media/AvatarImage';
import AdminTableWrapper from '../../_components/table/AdminTableWrapper';
import { PaginationControl } from '@/components/ui/pagination/PaginationControl';
import {
  Eye,
  Trash2,
  PhoneCall,
  Calendar,
  Video,
  User,
  Mail,
  CheckCircle,
  XCircle,
  Phone,
} from 'lucide-react';
import { DataTableSkeleton } from '../../_components/table/Datatableskeleton';

export default function DashboardPlanningCalls() {
  const [page, setPage] = React.useState(1);
  const [selectedCall, setSelectedCall] =
    React.useState<TripPlanningCallResponseDto | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const { data: res, isLoading } = usePlanningCalls({ page });
  const deleteMutation = useDeletePlanningCall();
  const completeMutation = useCompletePlanningCall();
  const cancelMutation = useCancelPlanningCall();

  const handleView = (call: TripPlanningCallResponseDto) => {
    setSelectedCall(call);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (call: TripPlanningCallResponseDto) => {
    if (window.confirm(`Are you sure you want to delete this planning call?`)) {
      try {
        await deleteMutation.mutateAsync(call.id);
        if (selectedCall?.id === call.id) {
          setIsDrawerOpen(false);
          setSelectedCall(null);
        }
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleComplete = async (call: TripPlanningCallResponseDto) => {
    try {
      await completeMutation.mutateAsync(call.id);
    } catch (error) {
      console.error('Complete failed:', error);
    }
  };

  const handleCancel = async (call: TripPlanningCallResponseDto) => {
    if (window.confirm('Are you sure you want to cancel this call?')) {
      try {
        await cancelMutation.mutateAsync(call.id);
      } catch (error) {
        console.error('Cancel failed:', error);
      }
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedCall(null), 300);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'green';
      case 'SCHEDULED':
        return 'blue';
      case 'CANCELLED':
        return 'red';
      default:
        return 'orange';
    }
  };

  const columns: Column<TripPlanningCallResponseDto>[] = [
    {
      label: 'Adventurer',
      key: 'adventurer',
      render: (_, row) => (
        <HStack gap={3}>
          {row.adventurer && (
            <AvatarImage name={row.adventurer.name} size='sm' />
          )}
          <VStack align='start' gap={0}>
            <Text fontSize='sm' fontWeight='medium'>
              {row.adventurer?.name || 'N/A'}
            </Text>
            <Text fontSize='xs' color='fg.muted'>
              {row.adventurer?.email || 'No email'}
            </Text>
          </VStack>
        </HStack>
      ),
    },
    {
      label: 'Time',
      key: 'startTime',
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
      label: 'Status',
      key: 'status',
      render: (v) => (
        <Badge colorPalette={getStatusColor(v)} variant='subtle'>
          {v}
        </Badge>
      ),
    },
    {
      label: 'Link',
      key: 'meetingLink',
      render: (v) =>
        v ? (
          <Link href={v} color='blue.500' fontSize='sm' fontWeight='medium'>
            Join Meeting
          </Link>
        ) : (
          <Text fontSize='sm' color='fg.muted'>
            N/A
          </Text>
        ),
    },
    {
      label: 'Actions',
      key: 'id',
      render: (_, call) => (
        <HStack gap={2} justify='end'>
          <IconButton
            aria-label='View Details'
            variant='ghost'
            size='sm'
            colorPalette='blue'
            onClick={() => handleView(call)}
          >
            <Eye size={16} />
          </IconButton>
          <IconButton
            aria-label='Delete Call'
            variant='ghost'
            size='sm'
            colorPalette='red'
            onClick={() => handleDelete(call)}
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
        title='Planning Calls'
        hasData={!!res?.data?.length}
        emptyIcon={<PhoneCall size={40} />}
        emptyText='No planning calls scheduled yet.'
      >
        <DataTable columns={columns} data={res?.data ?? []} />
        {res?.pagination && (
          <Box borderTopWidth='1px' py={4}>
            <PaginationControl
              pagination={res.pagination}
              onPageChange={setPage}
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
                    <span>Planning Call Details</span>
                  </HStack>
                </Drawer.Title>
              </Drawer.Header>

              <Drawer.Body py={6}>
                {selectedCall && (
                  <Stack gap={6}>
                    {/* Status Badge */}
                    <Box>
                      <Text fontSize='sm' color='fg.muted' mb={2}>
                        Status
                      </Text>
                      <Badge
                        size='lg'
                        colorPalette={getStatusColor(selectedCall.status)}
                        variant='subtle'
                      >
                        {selectedCall.status}
                      </Badge>
                    </Box>

                    <Separator />

                    {/* Adventurer Info */}
                    {selectedCall.adventurer && (
                      <>
                        <Box>
                          <Text fontSize='sm' color='fg.muted' mb={3}>
                            Adventurer
                          </Text>
                          <HStack
                            gap={3}
                            p={4}
                            bg='bg.muted'
                            borderRadius='md'
                            borderWidth='1px'
                          >
                            <AvatarImage
                              name={selectedCall.adventurer.name}
                              size='lg'
                            />
                            <VStack align='start' gap={1}>
                              <HStack gap={2}>
                                <User size={14} />
                                <Text fontWeight='semibold'>
                                  {selectedCall.adventurer.name}
                                </Text>
                              </HStack>
                              <HStack gap={2}>
                                <Mail size={14} />
                                <Text fontSize='sm' color='fg.muted'>
                                  {selectedCall.adventurer.email}
                                </Text>
                              </HStack>
                              {selectedCall.adventurer.phone && (
                                <HStack gap={2}>
                                  <Phone size={14} />
                                  <Text fontSize='sm' color='fg.muted'>
                                    {selectedCall.adventurer.phone}
                                  </Text>
                                </HStack>
                              )}
                            </VStack>
                          </HStack>
                        </Box>

                        <Separator />
                      </>
                    )}

                    {/* Schedule Info */}
                    <Box>
                      <Text fontSize='sm' color='fg.muted' mb={3}>
                        Scheduled Time
                      </Text>
                      <HStack
                        gap={2}
                        p={4}
                        bg='bg.muted'
                        borderRadius='md'
                        borderWidth='1px'
                      >
                        <Calendar
                          size={18}
                          color='var(--chakra-colors-blue-500)'
                        />
                        <VStack align='start' gap={0}>
                          <Text fontWeight='semibold'>
                            {new Date(
                              selectedCall.startTime,
                            ).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </Text>
                          <Text fontSize='sm' color='fg.muted'>
                            {new Date(
                              selectedCall.startTime,
                            ).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {selectedCall.endTime &&
                              ` - ${new Date(
                                selectedCall.endTime,
                              ).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}`}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>

                    <Separator />

                    {/* Meeting Link */}
                    {selectedCall.meetingLink && (
                      <>
                        <Box>
                          <Text fontSize='sm' color='fg.muted' mb={2}>
                            Meeting Link
                          </Text>
                          <HStack
                            gap={2}
                            p={3}
                            bg='blue.50'
                            borderRadius='md'
                            borderWidth='1px'
                            borderColor='blue.200'
                          >
                            <Video
                              size={18}
                              color='var(--chakra-colors-blue-600)'
                            />
                            <Link
                              href={selectedCall.meetingLink}
                              color='blue.600'
                              fontWeight='medium'
                              fontSize='sm'
                              target='_blank'
                            >
                              Join Video Call
                            </Link>
                          </HStack>
                        </Box>

                        <Separator />
                      </>
                    )}

                    {/* Calendar Event ID */}
                    {selectedCall.calendarEventId && (
                      <>
                        <Box>
                          <Text fontSize='sm' color='fg.muted' mb={2}>
                            Calendar Event
                          </Text>
                          <Box
                            p={3}
                            bg='bg.muted'
                            borderRadius='md'
                            borderWidth='1px'
                          >
                            <Text
                              fontSize='xs'
                              fontFamily='mono'
                              color='fg.muted'
                            >
                              {selectedCall.calendarEventId}
                            </Text>
                          </Box>
                        </Box>

                        <Separator />
                      </>
                    )}

                    {/* Metadata */}
                    <Box>
                      <Text fontSize='sm' color='fg.muted' mb={2}>
                        Call Information
                      </Text>
                      <VStack
                        align='start'
                        gap={1}
                        fontSize='xs'
                        color='fg.muted'
                      >
                        <Text>
                          Call ID:{' '}
                          <Text as='span' fontFamily='mono'>
                            {selectedCall.id}
                          </Text>
                        </Text>
                        {selectedCall.createdAt && (
                          <Text>
                            Created:{' '}
                            {new Date(selectedCall.createdAt).toLocaleString()}
                          </Text>
                        )}
                        {selectedCall.updatedAt && (
                          <Text>
                            Updated:{' '}
                            {new Date(selectedCall.updatedAt).toLocaleString()}
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
                {selectedCall && selectedCall.status !== 'COMPLETED' && (
                  <Button
                    colorPalette='green'
                    onClick={() => handleComplete(selectedCall)}
                    loading={completeMutation.isPending}
                  >
                    <CheckCircle size={16} />
                    Mark Complete
                  </Button>
                )}
                {selectedCall && selectedCall.status === 'SCHEDULED' && (
                  <Button
                    colorPalette='orange'
                    onClick={() => handleCancel(selectedCall)}
                    loading={cancelMutation.isPending}
                    disabled
                  >
                    <XCircle size={16} />
                    Cancel Call
                  </Button>
                )}
                <Button
                  colorPalette='red'
                  onClick={() => selectedCall && handleDelete(selectedCall)}
                  loading={deleteMutation.isPending}
                >
                  Delete
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
