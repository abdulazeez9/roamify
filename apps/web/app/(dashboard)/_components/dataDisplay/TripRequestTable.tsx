'use client';

import { useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { TripRequestCallbackDialog } from '../dialogs/trip-request-callback-dialog';
import Button from '@/components/ui/button/Button';

import { formatDate } from '@/utils/DateFormat';
import { useMyTripRequests } from '@/hooks';
import { TripRequest } from '@zagotours/types';
import { Column, DataTable } from '../table/DataTable';
import { DataTableSkeleton } from '../table/Datatableskeleton';

export const TripRequestsTable = () => {
  const { data, isLoading } = useMyTripRequests();
  const [isCallbackDialogOpen, setIsCallbackDialogOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | undefined>();

  const handleRequestCallback = (tripId: string) => {
    setSelectedTripId(tripId);
    setIsCallbackDialogOpen(true);
  };

  const columns: Column<TripRequest>[] = [
    {
      label: 'Trip Type',
      key: 'tripType',
    },
    {
      label: 'Destination',
      key: 'destination',
    },
    {
      label: 'Date',
      key: 'date',
      render: (value: any) => (value ? formatDate(String(value)) : 'N/A'),
    },
    {
      label: 'Reference',
      key: 'id',
      render: (value: any) =>
        value ? String(value).slice(0, 8).toUpperCase() : '',
    },
    {
      label: 'Action',
      key: 'id',
      render: (_: any, row: TripRequest) => (
        <Button
          size='sm'
          bg='primary'
          color='white'
          variant='outline'
          onClick={() => handleRequestCallback(row.id)}
        >
          Request Callback
        </Button>
      ),
    },
  ];

  const tripRequests = data?.data || [];

  return (
    <>
      {isLoading && <DataTableSkeleton columns={5} />}

      {!isLoading && tripRequests.length === 0 && (
        <Box textAlign='center' py={10}>
          <Text fontSize='lg' color='fg.muted'>
            No trip requests yet. Request your first trip!
          </Text>
        </Box>
      )}

      <Box overflowX='auto'>
        <DataTable columns={columns} data={tripRequests} />
      </Box>

      <TripRequestCallbackDialog
        open={isCallbackDialogOpen}
        onOpenChange={(e) => setIsCallbackDialogOpen(e.open)}
        tripRequestId={selectedTripId}
      />
    </>
  );
};
