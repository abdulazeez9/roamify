'use client';

import { useState } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Card,
  IconButton,
  Menu,
  Portal,
} from '@chakra-ui/react';

import { useMyPlanningCalls } from '@/hooks';
import { TripPlanningCallResponseDto } from '@zagotours/types';
import { ReschedulePlanningCallDialog } from '../../_components/dialogs/ReschedulePlanningCallDialog';
import { CancelPlanningCallDialog } from '../../_components/dialogs/CancelPlanningCallDialog';
import { formatDate } from '@/utils/DateFormat';
import { Column, DataTable } from '../table/DataTable';
import { AppLink } from '@/components/ui/link/AppLink';
import Button from '@/components/ui/button/Button';
import { DataTableSkeleton } from '../table/Datatableskeleton';
import { MoreVertical } from 'lucide-react';
import { formatTime } from '@/utils/TimeFormat';

export function TripPlanningCalls() {
  const { data: response, isLoading, error } = useMyPlanningCalls();
  const calls = response?.data || [];

  const [selectedCallForReschedule, setSelectedCallForReschedule] =
    useState<TripPlanningCallResponseDto | null>(null);
  const [selectedCallForCancel, setSelectedCallForCancel] =
    useState<TripPlanningCallResponseDto | null>(null);

  const upcomingCalls = calls.filter(
    (call: TripPlanningCallResponseDto) =>
      call.status === 'SCHEDULED' && new Date(call.startTime) > new Date(),
  );

  // Define table columns for upcoming calls
  const upcomingColumns: Column<TripPlanningCallResponseDto>[] = [
    {
      label: 'Traveler',
      key: 'adventurer',
      render: (adventurer) => adventurer?.name || 'N/A',
    },
    {
      label: 'Date',
      key: 'startTime',
      render: (startTime) => formatDate(startTime),
    },
    {
      label: 'Time',
      key: 'startTime',
      render: (startTime) => formatTime(startTime),
    },
    {
      label: 'Action',
      key: 'meetingLink',
      width: 'fit-content',
      render: (meetingLink, row) => (
        <HStack gap={2} whiteSpace='nowrap'>
          {meetingLink ? (
            <AppLink
              href={meetingLink}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button bg='primary' color='white' size='sm'>
                Join Call
              </Button>
            </AppLink>
          ) : (
            <Button bg='primary' color='white' size='sm' disabled>
              No Meeting Link
            </Button>
          )}

          <Menu.Root>
            <Menu.Trigger asChild>
              <IconButton size='sm' variant='ghost' aria-label='More options'>
                <MoreVertical size={18} />
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item
                    value='reschedule'
                    onClick={() => setSelectedCallForReschedule(row)}
                  >
                    Reschedule
                  </Menu.Item>
                  <Menu.Item
                    value='cancel'
                    onClick={() => setSelectedCallForCancel(row)}
                    color='red.600'
                  >
                    Cancel
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </HStack>
      ),
    },
  ];

  const pastColumns: Column<TripPlanningCallResponseDto>[] = [
    {
      label: 'Traveler',
      key: 'adventurer',
      render: (adventurer) => adventurer?.name || 'N/A',
    },
    {
      label: 'Date',
      key: 'startTime',
      render: (startTime) =>
        new Date(startTime).toLocaleDateString('en-US', {
          dateStyle: 'medium',
        }),
    },
    {
      label: 'Time',
      key: 'endTime',
      render: (endTime, row) =>
        new Date(row.startTime).toLocaleTimeString('en-US', {
          timeStyle: 'short',
        }),
    },
    {
      label: 'Status',
      key: 'status',
      render: (status) => (
        <Text
          fontSize='sm'
          fontWeight='medium'
          color={status === 'COMPLETED' ? 'green.600' : 'red.600'}
        >
          {status}
        </Text>
      ),
    },
  ];

  if (isLoading) {
    return <DataTableSkeleton columns={4} />;
  }

  if (error) {
    return (
      <Box p={8}>
        <Card.Root>
          <Card.Body>
            <Text color='red.500'>
              Failed to load planning calls. Please try again.
            </Text>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

  return (
    <Box p={8}>
      <VStack gap={6} align='stretch'>
        <Text fontSize='2xl' fontWeight='bold'>
          Trip Planning Calls
        </Text>

        {/* Display Upcoming Calls in Table */}
        {upcomingCalls.length > 0 ? (
          <Box>
            <Text fontSize='lg' fontWeight='semibold' mb={4}>
              Upcoming Calls
            </Text>
            <DataTable columns={upcomingColumns} data={upcomingCalls} />
          </Box>
        ) : (
          <Card.Root>
            <Card.Body>
              <Text fontSize='sm' color='gray.500' textAlign='center'>
                No upcoming calls scheduled. Book your first planning call!
              </Text>
            </Card.Body>
          </Card.Root>
        )}

        {/* Display Past Calls */}
        {calls.filter(
          (call: TripPlanningCallResponseDto) =>
            call.status === 'COMPLETED' || call.status === 'CANCELLED',
        ).length > 0 && (
          <Box mt={8}>
            <Text fontSize='lg' fontWeight='semibold' mb={4}>
              Past Calls
            </Text>
            <DataTable
              columns={pastColumns}
              data={calls.filter(
                (call: TripPlanningCallResponseDto) =>
                  call.status === 'COMPLETED' || call.status === 'CANCELLED',
              )}
            />
          </Box>
        )}
      </VStack>

      {selectedCallForReschedule && (
        <ReschedulePlanningCallDialog
          open={!!selectedCallForReschedule}
          onOpenChange={(e) => !e.open && setSelectedCallForReschedule(null)}
          callId={selectedCallForReschedule.id}
          currentStartTime={selectedCallForReschedule.startTime}
          currentEndTime={
            selectedCallForReschedule.endTime || formatDate(new Date())
          }
          currentMeetingLink={
            selectedCallForReschedule.meetingLink || undefined
          }
        />
      )}

      {selectedCallForCancel && (
        <CancelPlanningCallDialog
          open={!!selectedCallForCancel}
          onOpenChange={(e) => !e.open && setSelectedCallForCancel(null)}
          callId={selectedCallForCancel.id}
          startTime={selectedCallForCancel.startTime}
        />
      )}
    </Box>
  );
}
