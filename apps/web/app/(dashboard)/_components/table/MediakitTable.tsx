'use client';

import { useState } from 'react';
import { Box, Text, HStack, IconButton, Menu, Portal } from '@chakra-ui/react';
import { MoreVertical, FileText, ExternalLink, Download } from 'lucide-react';
import { Column, DataTable } from '../table/DataTable';
import AdminTableWrapper from '../table/AdminTableWrapper';
import { DataTableSkeleton } from '../table/Datatableskeleton';
import { formatDate } from '@/utils/DateFormat';

interface MediaKit {
  id: string;
  adventureName: string;
  createdAt: string;
  driveUrl: string;
}

export function MediaKitTable() {
  const isLoading = false;
  const error = null;

  const mediaKits: MediaKit[] = [
    {
      id: '1',
      adventureName: 'Skydiving in Mauritius',
      createdAt: '2026-02-10T10:00:00Z',
      driveUrl:
        'https://drive.google.com/drive/folders/1EngUqCMIFaFQ0eoaxexs69e6Rvk1jQkB',
    },
    {
      id: '2',
      adventureName: 'Rafting in Jinja Uganda',
      createdAt: '2026-02-12T14:30:00Z',
      driveUrl:
        'https://drive.google.com/drive/folders/13ppM5bklzm30uj9vxtx35yrbwfHjNmGL',
    },
    {
      id: '3',
      adventureName: 'Inca Trail(Machu Picchu)',
      createdAt: '2026-02-13T09:00:00Z',
      driveUrl:
        'https://drive.google.com/drive/folders/1hobOsbzM5NRsLdo4u0ah-_mZJzEcWFq0',
    },
    {
      id: '4',
      adventureName: 'Experience Flying Safari in Kenya',
      createdAt: '2026-02-14T11:00:00Z',
      driveUrl:
        'https://drive.google.com/drive/folders/1BmAbNfu5o1BgwjPtujNsvg0GtQ0eENu5',
    },
    {
      id: '5',
      adventureName: 'Balloon Safari in South Africa',
      createdAt: '2026-02-14T16:00:00Z',
      driveUrl:
        'https://drive.google.com/drive/folders/1_qPTpjlYb7nmYLGGYazIWKOEsPdNvIa2',
    },
    {
      id: '6',
      adventureName: 'Gorrila tracking in Uganda',
      createdAt: '2026-02-15T08:30:00Z',
      driveUrl:
        'https://drive.google.com/drive/folders/1SWCUwRPTUs9RtA_tGR0XhXkWUJmn_sHu',
    },
    {
      id: '7',
      adventureName: 'Quad biking in South Africa',
      createdAt: '2026-02-15T12:00:00Z',
      driveUrl:
        'https://drive.google.com/drive/folders/1xvj0MFGb6Ypwp7a2x3lGU8CJyqFX9ENr',
    },
    {
      id: '8',
      adventureName: 'Mountain Trekking',
      createdAt: '2026-02-15T18:45:00Z',
      driveUrl:
        'https://drive.google.com/drive/folders/1KOaOGN7UM9xxHH9k6m8MU5JHoouSQaSy',
    },
    {
      id: '9',
      adventureName: 'Paragliding in South Africa',
      createdAt: '2026-02-16T07:15:00Z',
      driveUrl:
        'https://drive.google.com/drive/folders/1HaM87cXHTAxDRVz3Hn37JPXxACv_wvbp',
    },
    {
      id: '10',
      adventureName: 'Island Hopping in the Philippines',
      createdAt: '2026-02-16T10:30:00Z',
      driveUrl:
        'https://drive.google.com/drive/folders/1XldP_jlC7CP37bORfDskBBqff_QrKPTW',
    },
    {
      id: '11',
      adventureName: 'Big 5 tracking in South Africa',
      createdAt: '2026-02-16T10:30:00Z',
      driveUrl:
        'https://drive.google.com/drive/folders/1YnDhjlbNHqNAI5oUAA1b3m7SfOABRuVZ',
    },
  ];

  const handleView = (mediaKit: MediaKit) => {
    if (mediaKit.driveUrl) {
      window.open(mediaKit.driveUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownload = (mediaKit: MediaKit) => {
    if (mediaKit.driveUrl) {
      const win = window.open(mediaKit.driveUrl, '_blank');
      if (win) win.focus();
    }
  };

  const columns: Column<MediaKit>[] = [
    {
      label: 'Adventure Name',
      key: 'adventureName',
      render: (adventureName) => (
        <Text fontWeight='medium'>{adventureName || 'N/A'}</Text>
      ),
    },
    {
      label: 'Date',
      key: 'createdAt',
      render: (createdAt) => <Text fontSize='sm'>{formatDate(createdAt)}</Text>,
    },
    {
      label: 'Action',
      key: 'id',
      width: 'fit-content',
      render: (_, row) => (
        <HStack gap={2} justifyContent='flex-end'>
          <Menu.Root>
            <Menu.Trigger asChild>
              <IconButton size='sm' variant='ghost' aria-label='More options'>
                <MoreVertical size={18} />
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value='view' onClick={() => handleView(row)}>
                    <HStack gap={2}>
                      <ExternalLink size={14} /> View Folder
                    </HStack>
                  </Menu.Item>
                  <Menu.Item
                    value='download'
                    onClick={() => handleDownload(row)}
                  >
                    <HStack gap={2}>
                      <Download size={14} /> Open to Download
                    </HStack>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </HStack>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Box p={8}>
        <DataTableSkeleton columns={3} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={8}>
        <Text color='red.500'>
          Failed to load media kits. Please try again.
        </Text>
      </Box>
    );
  }

  return (
    <AdminTableWrapper
      title='Media Kit'
      hasData={mediaKits.length > 0}
      emptyIcon={<FileText size={48} />}
      emptyText='No media kits available.'
    >
      <DataTable columns={columns} data={mediaKits} />
    </AdminTableWrapper>
  );
}
