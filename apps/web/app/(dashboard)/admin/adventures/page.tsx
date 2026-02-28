'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Badge,
  HStack,
  Container,
  Heading,
  IconButton,
  Center,
  Icon,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from '@chakra-ui/react';

import { FiEdit, FiEye, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import { Grip } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAdventures, useDeleteAdventure } from '@/hooks';
import { Adventure } from '@zagotours/types';
import { DataTable } from '../../_components/table/DataTable';
import { PaginationControl } from '@/components/ui/pagination/PaginationControl';
import { DataTableSkeleton } from '../../_components/table/Datatableskeleton';

export default function AdventuresPage() {
  const router = useRouter();

  // Pagination State
  const [page, setPage] = useState(1);
  const [showPagination, setShowPagination] = useState(false);
  const limit = 10;

  // Hooks
  const { data: response, isLoading } = useAdventures({
    page,
    limit,
  });
  const deleteMutation = useDeleteAdventure();

  const adventures = response?.data || [];
  const pagination = response?.pagination;

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this adventure?')) return;
    deleteMutation.mutate(id);
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      EASY: 'green',
      MEDIUM: 'yellow',
      HARD: 'orange',
      CHALLENGING: 'red',
    };
    return colors[level] || 'gray';
  };

  const columns = [
    {
      label: 'Title',
      key: 'title' as const,
      render: (val: any) => <Box fontWeight='medium'>{val}</Box>,
    },
    { label: 'Location', key: 'location' as const },
    {
      label: 'Level',
      key: 'level' as const,
      render: (val: any) => (
        <Badge colorPalette={getLevelColor(val)}>{val}</Badge>
      ),
    },
    {
      label: 'Price',
      key: 'price' as const,
      render: (val: any) => `$${val}`,
    },
    {
      label: 'Status',
      key: 'status' as const,
      render: (val: any) => (
        <Badge colorPalette={val === 'DRAFT' ? 'gray' : 'green'}>{val}</Badge>
      ),
    },
    {
      label: 'Days',
      key: 'days' as const,
      render: (val: any) => `${val} days`,
    },
    {
      label: 'Actions',
      key: 'id' as const,
      render: (_: any, adventure: Adventure) => (
        <MenuRoot>
          <MenuTrigger asChild>
            <IconButton variant='ghost' size='sm'>
              <FiMoreVertical />
            </IconButton>
          </MenuTrigger>
          <MenuContent>
            <MenuItem
              value='view'
              onClick={() => router.push(`/admin/adventures/${adventure.id}`)}
            >
              <FiEye /> View
            </MenuItem>
            <MenuItem
              value='edit'
              onClick={() =>
                router.push(`/admin/adventures/${adventure.id}/edit`)
              }
            >
              <FiEdit /> Edit
            </MenuItem>
            <MenuItem
              value='delete'
              color='fg.error'
              onClick={() => handleDelete(adventure.id)}
            >
              <FiTrash2 /> Delete
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      ),
    },
  ];

  return (
    <Container maxW='container.xl' py={8}>
      {/* Header */}
      <HStack justify='space-between' mb={6}>
        <Heading size='lg'>Adventures Management</Heading>
        <Button
          bg='primary'
          color='white'
          onClick={() => router.push('/admin/adventures/create')}
        >
          Create Adventure
        </Button>
      </HStack>

      {/* Table Section */}
      <Box
        bg='bg.panel'
        shadow='sm'
        rounded='md'
        overflow='hidden'
        position='relative'
      >
        {isLoading && <DataTableSkeleton columns={5} />}

        <DataTable columns={columns} data={adventures} />

        {!isLoading && adventures.length === 0 && (
          <Center p={10}>
            <Box color='fg.muted'>No adventures found in the database.</Box>
          </Center>
        )}
      </Box>

      {/* Load More Button (Initial State) */}
      {!showPagination && pagination && pagination.total > limit && (
        <Center mt={6}>
          <Button variant='outline' onClick={() => setShowPagination(true)}>
            <Icon as={Grip} mr='2' />
            Show Pagination (Total: {pagination.total})
          </Button>
        </Center>
      )}

      {/* Full Pagination Controls */}
      {showPagination && pagination && (
        <Box mt={6}>
          <PaginationControl
            pagination={pagination}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </Box>
      )}
    </Container>
  );
}
