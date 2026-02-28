'use client';

import { useState } from 'react';
import { Text, Badge, IconButton, HStack, VStack } from '@chakra-ui/react';
import { Eye, Trash2, Star } from 'lucide-react';
import { useReviews, useToggleFeaturedReview } from '@/hooks';
import { ReviewResponseDto } from '@zagotours/types';
import { Column, DataTable } from '../../_components/table/DataTable';
import AdminTableWrapper from '../../_components/table/AdminTableWrapper';
import { PaginationControl } from '@/components/ui/pagination/PaginationControl';
import { DataTableSkeleton } from '../../_components/table/Datatableskeleton';
import {
  ReviewViewDrawer,
  ReviewEditDrawer,
  DeleteReviewDialog,
} from '../../_components/drawer/ReviewDrawers';

export default function DashboardReviews() {
  const [page, setPage] = useState(1);
  const { data: res, isLoading } = useReviews({ page });

  const [selectedReview, setSelectedReview] =
    useState<ReviewResponseDto | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const toggleFeatured = useToggleFeaturedReview();

  const handleView = (review: ReviewResponseDto) => {
    setSelectedReview(review);
    setViewOpen(true);
  };

  const handleDelete = (review: ReviewResponseDto) => {
    setSelectedReview(review);
    setDeleteOpen(true);
  };

  const handleToggleFeatured = async (review: ReviewResponseDto) => {
    try {
      await toggleFeatured.mutateAsync(review.id);
    } catch (error) {
      // Error is handled by the mutation's onError
    }
  };

  const columns: Column<ReviewResponseDto>[] = [
    {
      label: 'User',
      key: 'user',
      render: (u) => (
        <VStack align='start' gap={0}>
          <Text fontSize='sm' fontWeight='medium'>
            {u.name}
          </Text>
          {u.country && (
            <Text fontSize='xs' color='fg.muted'>
              {u.country}
            </Text>
          )}
        </VStack>
      ),
    },
    {
      label: 'Rating',
      key: 'rating',
      render: (v) => (
        <HStack>
          <Text color='yellow.500' fontSize='lg'>
            {'★'.repeat(v)}
          </Text>
          <Text fontSize='xs' color='fg.muted'>
            {v}/5
          </Text>
        </HStack>
      ),
    },
    {
      label: 'Content',
      key: 'content',
      render: (v) => (
        <Text truncate maxW='300px' fontSize='sm'>
          {v}
        </Text>
      ),
    },
    {
      label: 'Featured',
      key: 'isFeatured',
      render: (v) => (
        <Badge colorPalette={v ? 'purple' : 'gray'}>{v ? 'Yes' : 'No'}</Badge>
      ),
    },
    {
      label: 'Date',
      key: 'createdAt',
      render: (v) => (
        <Text fontSize='sm'>{new Date(v).toLocaleDateString()}</Text>
      ),
    },
    {
      label: 'Actions',
      key: 'id',
      render: (_id, review) => (
        <HStack gap={1} justify='end'>
          <IconButton
            aria-label='View'
            variant='ghost'
            size='sm'
            onClick={() => handleView(review)}
          >
            <Eye size={16} />
          </IconButton>

          <IconButton
            aria-label='Toggle Featured'
            variant='ghost'
            size='sm'
            colorPalette={review.isFeatured ? 'purple' : 'gray'}
            onClick={() => handleToggleFeatured(review)}
            loading={toggleFeatured.isPending}
          >
            <Star
              size={16}
              fill={review.isFeatured ? 'currentColor' : 'none'}
            />
          </IconButton>
          <IconButton
            aria-label='Delete'
            variant='ghost'
            size='sm'
            colorPalette='red'
            onClick={() => handleDelete(review)}
          >
            <Trash2 size={16} />
          </IconButton>
        </HStack>
      ),
    },
  ];

  if (isLoading) return <DataTableSkeleton columns={6} />;

  return (
    <>
      <AdminTableWrapper title='User Reviews' hasData={!!res?.data?.length}>
        <DataTable columns={columns} data={res?.data ?? []} />
        <PaginationControl
          pagination={res?.pagination}
          onPageChange={setPage}
        />
      </AdminTableWrapper>

      {selectedReview && (
        <>
          <ReviewViewDrawer
            review={selectedReview}
            open={viewOpen}
            onClose={() => {
              setViewOpen(false);
              setSelectedReview(null);
            }}
          />
          <ReviewEditDrawer
            review={selectedReview}
            open={editOpen}
            onClose={() => {
              setEditOpen(false);
              setSelectedReview(null);
            }}
          />
          <DeleteReviewDialog
            review={selectedReview}
            open={deleteOpen}
            onClose={() => {
              setDeleteOpen(false);
              setSelectedReview(null);
            }}
          />
        </>
      )}
    </>
  );
}
