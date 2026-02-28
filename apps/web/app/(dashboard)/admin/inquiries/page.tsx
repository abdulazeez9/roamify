'use client';

import React, { useState } from 'react';
import { Text, HStack, IconButton, VStack, Box } from '@chakra-ui/react';
import { Eye, Trash2, Mail } from 'lucide-react';
import { useInquiries, useDeleteInquiry } from '@/hooks';
import { Column, DataTable } from '../../_components/table/DataTable';
import { PaginationControl } from '@/components/ui/pagination/PaginationControl';
import { GeneralInquiryResponseDto } from '@zagotours/types';
import AdminTableWrapper from '../../_components/table/AdminTableWrapper';
import { DataTableSkeleton } from '../../_components/table/Datatableskeleton';
import {
  DeleteInquiryDialog,
  InquiryViewDrawer,
} from '../../_components/drawer/InquiriesDrawer';

export default function DashboardEnquiriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: response, isLoading } = useInquiries({ page: currentPage });

  const [selectedInquiry, setSelectedInquiry] =
    useState<GeneralInquiryResponseDto | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleView = (inquiry: GeneralInquiryResponseDto) => {
    setSelectedInquiry(inquiry);
    setViewOpen(true);
  };

  const handleDelete = (inquiry: GeneralInquiryResponseDto) => {
    setSelectedInquiry(inquiry);
    setDeleteOpen(true);
  };

  const handleDeleteFromDrawer = () => {
    setViewOpen(false);
    if (selectedInquiry) {
      setDeleteOpen(true);
    }
  };

  const columns: Column<GeneralInquiryResponseDto>[] = [
    {
      label: 'Contact Info',
      key: 'email',
      render: (email, inquiry) => (
        <VStack align='start' gap={0}>
          <Text fontWeight='medium' fontSize='sm'>
            {email}
          </Text>
          {inquiry.phone && (
            <Text fontSize='xs' color='fg.muted'>
              {inquiry.phone}
            </Text>
          )}
        </VStack>
      ),
    },
    {
      label: 'Message',
      key: 'message',
      render: (v) => (
        <Text truncate maxW='400px' fontSize='sm' color='fg.muted'>
          {v}
        </Text>
      ),
    },
    {
      label: 'Address',
      key: 'address',
      render: (v) => (
        <Text fontSize='sm' maxW='200px' truncate>
          {v || '—'}
        </Text>
      ),
    },
    {
      label: 'Date',
      key: 'createdAt',
      render: (v) => (
        <VStack align='start' gap={0}>
          <Text fontSize='sm'>{new Date(v).toLocaleDateString()}</Text>
          <Text fontSize='xs' color='fg.muted'>
            {new Date(v).toLocaleTimeString()}
          </Text>
        </VStack>
      ),
    },
    {
      label: 'Actions',
      key: 'id',
      render: (_id, inquiry) => (
        <HStack gap={1} justify='end'>
          <IconButton
            aria-label='View'
            variant='ghost'
            size='sm'
            onClick={() => handleView(inquiry)}
          >
            <Eye size={16} />
          </IconButton>
          <IconButton
            aria-label='Delete'
            variant='ghost'
            size='sm'
            colorPalette='red'
            onClick={() => handleDelete(inquiry)}
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
        title='General Inquiries'
        hasData={!!response?.data?.length}
        emptyIcon={<Mail size={40} />}
        emptyText='No inquiries from the contact form yet.'
      >
        <DataTable columns={columns} data={response?.data ?? []} />
        {response?.pagination && (
          <PaginationControl
            pagination={response.pagination}
            onPageChange={setCurrentPage}
          />
        )}
      </AdminTableWrapper>

      {selectedInquiry && (
        <>
          <InquiryViewDrawer
            inquiry={selectedInquiry}
            open={viewOpen}
            onClose={() => {
              setViewOpen(false);
              setSelectedInquiry(null);
            }}
            onDelete={handleDeleteFromDrawer}
          />
          <DeleteInquiryDialog
            inquiry={selectedInquiry}
            open={deleteOpen}
            onClose={() => {
              setDeleteOpen(false);
              setSelectedInquiry(null);
            }}
          />
        </>
      )}
    </>
  );
}
