'use client';

import React, { useState } from 'react';
import {
  HStack,
  Text,
  Badge,
  IconButton,
  VStack,
  Textarea,
  Input,
} from '@chakra-ui/react';
import { Eye, Trash2, Edit } from 'lucide-react';
import { LoadingState } from '@/components/ui/LoadingState';
import AdminTableWrapper from '../../_components/table/AdminTableWrapper';
import { Column, DataTable } from '../../_components/table/DataTable';
import { PaginationControl } from '@/components/ui/pagination/PaginationControl';
import { PostResponseDto } from '@zagotours/types';
import { usePosts, useDeletePost, useUpdatePost } from '@/hooks';
import { AvatarImage } from '@/components/media/AvatarImage';
import {
  DeletePostDialog,
  PostEditDrawer,
  PostViewDrawer,
} from '../../_components/drawer/PostDrawers';
import { DataTableSkeleton } from '../../_components/table/Datatableskeleton';

export default function DashboardPosts() {
  const [page, setPage] = useState(1);
  const { data: res, isLoading } = usePosts({ page });

  const [selectedPost, setSelectedPost] = useState<PostResponseDto | null>(
    null,
  );
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleView = (post: PostResponseDto) => {
    setSelectedPost(post);
    setViewOpen(true);
  };

  const handleEdit = (post: PostResponseDto) => {
    setSelectedPost(post);
    setEditOpen(true);
  };

  const handleDelete = (post: PostResponseDto) => {
    setSelectedPost(post);
    setDeleteOpen(true);
  };

  const columns: Column<PostResponseDto>[] = [
    {
      label: 'Author',
      key: 'user',
      render: (u) => (
        <HStack gap={2}>
          <AvatarImage src={u.image} name={u.name} size='xs' />
          <Text fontSize='sm'>{u.name}</Text>
        </HStack>
      ),
    },
    {
      label: 'Title',
      key: 'title',
      render: (v) => (
        <Text fontSize='sm' fontWeight='medium' maxW='300px' truncate>
          {v}
        </Text>
      ),
    },
    {
      label: 'Type',
      key: 'mediaType',
      render: (v) => <Badge variant='outline'>{v}</Badge>,
    },
    {
      label: 'Stats',
      key: '_count',
      render: (c) => (
        <Text fontSize='xs'>
          👍 {c.likes} | 💬 {c.comments} | 🔄 {c.shares}
        </Text>
      ),
    },
    {
      label: 'Created',
      key: 'createdAt',
      render: (v) => (
        <Text fontSize='sm'>{new Date(v).toLocaleDateString()}</Text>
      ),
    },
    {
      label: 'Actions',
      key: 'id',
      render: (_id, post) => (
        <HStack gap={1} justify='end'>
          <IconButton
            aria-label='View'
            variant='ghost'
            size='sm'
            onClick={() => handleView(post)}
          >
            <Eye size={16} />
          </IconButton>
          <IconButton
            aria-label='Edit'
            variant='ghost'
            size='sm'
            colorPalette='blue'
            onClick={() => handleEdit(post)}
          >
            <Edit size={16} />
          </IconButton>
          <IconButton
            aria-label='Delete'
            variant='ghost'
            size='sm'
            colorPalette='red'
            onClick={() => handleDelete(post)}
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
      <AdminTableWrapper title='Posts' hasData={!!res?.data?.length}>
        <DataTable columns={columns} data={res?.data ?? []} />
        <PaginationControl
          pagination={res?.pagination}
          onPageChange={setPage}
        />
      </AdminTableWrapper>

      {selectedPost && (
        <>
          <PostViewDrawer
            post={selectedPost}
            open={viewOpen}
            onClose={() => {
              setViewOpen(false);
              setSelectedPost(null);
            }}
          />
          <PostEditDrawer
            post={selectedPost}
            open={editOpen}
            onClose={() => {
              setEditOpen(false);
              setSelectedPost(null);
            }}
          />
          <DeletePostDialog
            post={selectedPost}
            open={deleteOpen}
            onClose={() => {
              setDeleteOpen(false);
              setSelectedPost(null);
            }}
          />
        </>
      )}
    </>
  );
}
