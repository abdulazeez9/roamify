'use client';

import React from 'react';
import {
  Box,
  Heading,
  HStack,
  Text,
  Badge,
  VStack,
  IconButton,
  Center,
  Stack,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useUsers, useDeleteUser, useCurrentUser } from '@/hooks';
import { Column, DataTable } from '../../_components/table/DataTable';
import { AvatarImage } from '@/components/media/AvatarImage';
import { PaginationControl } from '@/components/ui/pagination/PaginationControl';
import { Eye, Pencil, Trash2, Users } from 'lucide-react';
import { DataTableSkeleton } from '../../_components/table/Datatableskeleton';
import { User } from '@zagotours/types';
import Button from '@/components/ui/button/Button';

export default function UsersAdminPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const {
    data: response,
    isLoading,
    isError,
  } = useUsers({ page: currentPage });
  const { data: res } = useCurrentUser();
  const deleteUserMutation = useDeleteUser();
  const currentUser = res?.data;

  
  //Handle view
  const handleView = (user: User) => {
    router.push(`/admin/users/${user.id}`);
  };

  //Handle Edit
  const handleEdit = (user: User) => {
    router.push(`/admin/users/${user.id}/edit`);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUserMutation.mutateAsync(userToDelete.id);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colorMap: Record<string, string> = {
      SUPER_ADMIN: 'purple',
      ADMIN: 'orange',
      AFFILIATE: 'cyan',
      ADVENTURER: 'green',
      INDEPENDENT_AGENT: 'blue',
      COOPERATE_AGENT: 'teal',
    };
    return colorMap[role] || 'gray';
  };

  const columns: Column<User>[] = [
    {
      label: 'User',
      key: 'name',
      render: (_, user) => (
        <HStack gap={3}>
          <AvatarImage src={user.image} name={user.name} size='sm' />
          <VStack align='start' gap={0}>
            <HStack gap={2}>
              <Text fontWeight='medium' fontSize='sm'>
                {user.name}
              </Text>
              {currentUser?.id === user.id && (
                <Badge variant='subtle' colorPalette='blue' fontSize='xs'>
                  you
                </Badge>
              )}
            </HStack>
            <Text fontSize='xs' color='fg.muted'>
              {user.email}
            </Text>
          </VStack>
        </HStack>
      ),
    },
    {
      label: 'Role',
      key: 'role',
      render: (role) => (
        <Badge variant='subtle' colorPalette={getRoleBadgeColor(role)}>
          {role?.replace('_', ' ') ?? 'N/A'}
        </Badge>
      ),
    },
    {
      label: 'Status',
      key: 'status',
      render: (status) => (
        <Badge
          variant='solid'
          colorPalette={status === 'ACTIVE' ? 'green' : 'red'}
        >
          {status}
        </Badge>
      ),
    },
    {
      label: 'Referral Code',
      key: 'referralCode',
      render: (code) => (
        <Text fontSize='sm' fontFamily='mono' fontWeight='medium'>
          {code}
        </Text>
      ),
    },
    {
      label: 'Safety Ambassador',
      key: 'safetyAmbassador',
      render: (isSafetyAmbassador) => (
        <Badge
          variant='outline'
          colorPalette={isSafetyAmbassador ? 'green' : 'gray'}
        >
          {isSafetyAmbassador ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      label: 'Actions',
      key: 'id',
      render: (_, user) => (
        <HStack gap={2} justify='end'>
          <IconButton
            aria-label='View User'
            variant='ghost'
            size='sm'
            onClick={() => handleView(user)}
          >
            <Eye size={16} />
          </IconButton>

          <IconButton
            aria-label='Edit User'
            variant='ghost'
            size='sm'
            colorPalette='blue'
            onClick={() => handleEdit(user)}
          >
            <Pencil size={16} />
          </IconButton>

          <IconButton
            aria-label='Delete User'
            variant='ghost'
            size='sm'
            colorPalette='red'
            onClick={() => handleDeleteClick(user)}
            disabled={user.role === 'SUPER_ADMIN'}
          >
            <Trash2 size={16} />
          </IconButton>
        </HStack>
      ),
    },
  ];

  if (isError)
    return (
      <Center h='400px'>
        <Text color='red.500'>
          Failed to load users. Please check your connection.
        </Text>
      </Center>
    );

  const hasData = response?.data && response.data.length > 0;

  return (
    <Box p={8} bg='bg.canvas' minH='100vh'>
      <Heading size='lg' mb={6}>
        User Management
      </Heading>

      <Box
        border='1px solid'
        borderColor='border.subtle'
        borderRadius='md'
        bg='bg.panel'
        overflow='hidden'
      >
        {isLoading ? (
          <DataTableSkeleton columns={6} />
        ) : hasData ? (
          <>
            <DataTable columns={columns} data={response.data} />
            {response?.pagination && (
              <Box borderTopWidth='1px' py={4}>
                <PaginationControl
                  pagination={response.pagination}
                  onPageChange={setCurrentPage}
                />
              </Box>
            )}
          </>
        ) : (
          <Center py={20}>
            <VStack gap={4} textAlign='center'>
              <Box p={4} bg='gray.50' borderRadius='full' color='gray.400'>
                <Users size={40} />
              </Box>
              <Stack gap={1}>
                <Text fontWeight='semibold' fontSize='lg'>
                  No users found
                </Text>
                <Text color='fg.muted' maxW='sm'>
                  There are currently no users in the system. When users join
                  Zago Tours, they will appear here.
                </Text>
              </Stack>
            </VStack>
          </Center>
        )}
      </Box>

      {/* --- Delete Confirmation Dialog --- */}
      <Dialog.Root
        open={isDeleteDialogOpen}
        onOpenChange={(e) => setIsDeleteDialogOpen(e.open)}
        role='alertdialog'
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Confirm Delete</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  Are you sure you want to delete user{' '}
                  <Text as='span' fontWeight='bold'>
                    {userToDelete?.name}
                  </Text>
                  ? This action cannot be undone.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant='outline'>Cancel</Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette='red'
                  onClick={confirmDelete}
                  loading={deleteUserMutation.isPending}
                >
                  Delete User
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}
