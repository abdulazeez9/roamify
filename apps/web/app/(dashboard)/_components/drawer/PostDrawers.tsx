'use client';

import React, { useState } from 'react';
import {
  HStack,
  Text,
  Badge,
  VStack,
  Textarea,
  Input,
  Drawer,
  Dialog,
  Field,
  CloseButton,
  Portal,
} from '@chakra-ui/react';
import { PostResponseDto } from '@zagotours/types';
import { useDeletePost, useUpdatePost } from '@/hooks';
import { AvatarImage } from '@/components/media/AvatarImage';
import Button from '@/components/ui/button/Button';

interface PostViewDrawerProps {
  post: PostResponseDto;
  open: boolean;
  onClose: () => void;
}

export function PostViewDrawer({ post, open, onClose }: PostViewDrawerProps) {
  return (
    <Drawer.Root
      open={open}
      onOpenChange={(e) => !e.open && onClose()}
      size='md'
      placement='end'
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Post Details</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <VStack align='stretch' gap={4}>
                <Field.Root>
                  <Field.Label>Author</Field.Label>
                  <HStack>
                    <AvatarImage
                      src={post.user.image}
                      name={post.user.name}
                      size='sm'
                    />
                    <Text fontWeight='medium'>{post.user.name}</Text>
                  </HStack>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Title</Field.Label>
                  <Text>{post.title}</Text>
                </Field.Root>

                {post.description && (
                  <Field.Root>
                    <Field.Label>Description</Field.Label>
                    <Text color='fg.muted'>{post.description}</Text>
                  </Field.Root>
                )}

                <Field.Root>
                  <Field.Label>Media Type</Field.Label>
                  <Badge variant='outline'>{post.mediaType}</Badge>
                </Field.Root>

                {post.mediaUrl && (
                  <Field.Root>
                    <Field.Label>Media</Field.Label>
                    {post.mediaType === 'IMAGE' ? (
                      <img
                        src={post.mediaUrl}
                        alt={post.title}
                        style={{ maxWidth: '100%', borderRadius: '8px' }}
                      />
                    ) : post.mediaType === 'VIDEO' ? (
                      <video
                        src={post.mediaUrl}
                        controls
                        style={{ maxWidth: '100%', borderRadius: '8px' }}
                      />
                    ) : (
                      <Text color='blue.500' textDecoration='underline'>
                        {post.mediaUrl}
                      </Text>
                    )}
                  </Field.Root>
                )}

                <Field.Root>
                  <Field.Label>Statistics</Field.Label>
                  <HStack gap={4}>
                    <Text fontSize='sm'>👍 Likes: {post._count.likes}</Text>
                    <Text fontSize='sm'>
                      💬 Comments: {post._count.comments}
                    </Text>
                    <Text fontSize='sm'>🔄 Shares: {post._count.shares}</Text>
                  </HStack>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Created</Field.Label>
                  <Text fontSize='sm'>
                    {new Date(post.createdAt).toLocaleString()}
                  </Text>
                </Field.Root>
              </VStack>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant='outline' onClick={onClose}>
                Close
              </Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size='sm' />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

interface PostEditDrawerProps {
  post: PostResponseDto;
  open: boolean;
  onClose: () => void;
}

export function PostEditDrawer({ post, open, onClose }: PostEditDrawerProps) {
  const [formData, setFormData] = useState({
    title: post.title,
    description: post.description || '',
  });
  const updatePost = useUpdatePost();

  const handleSubmit = async () => {
    try {
      await updatePost.mutateAsync({
        id: post.id,
        data: formData,
      });
      onClose();
    } catch (error) {
      // Error is handled by the mutation's onError
    }
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(e) => !e.open && onClose()}
      size='md'
      placement='end'
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Edit Post</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <VStack align='stretch' gap={4}>
                <Field.Root>
                  <Field.Label>Author (Read-only)</Field.Label>
                  <HStack>
                    <AvatarImage
                      src={post.user.image}
                      name={post.user.name}
                      size='sm'
                    />
                    <Text fontWeight='medium'>{post.user.name}</Text>
                  </HStack>
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Title</Field.Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder='Enter post title'
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Description</Field.Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder='Enter post description'
                    rows={4}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Media Type (Read-only)</Field.Label>
                  <Badge variant='outline'>{post.mediaType}</Badge>
                </Field.Root>

                {post.mediaUrl && (
                  <Field.Root>
                    <Field.Label>Media Preview</Field.Label>
                    {post.mediaType === 'IMAGE' ? (
                      <img
                        src={post.mediaUrl}
                        alt={post.title}
                        style={{ maxWidth: '100%', borderRadius: '8px' }}
                      />
                    ) : post.mediaType === 'VIDEO' ? (
                      <video
                        src={post.mediaUrl}
                        controls
                        style={{ maxWidth: '100%', borderRadius: '8px' }}
                      />
                    ) : (
                      <Text
                        color='blue.500'
                        fontSize='sm'
                        wordBreak='break-all'
                      >
                        {post.mediaUrl}
                      </Text>
                    )}
                  </Field.Root>
                )}
              </VStack>
            </Drawer.Body>
            <Drawer.Footer>
              <HStack gap={2}>
                <Button variant='outline' onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorPalette='blue'
                  onClick={handleSubmit}
                  loading={updatePost.isPending}
                  disabled={!formData.title.trim()}
                >
                  Save Changes
                </Button>
              </HStack>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size='sm' />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

interface DeletePostDialogProps {
  post: PostResponseDto;
  open: boolean;
  onClose: () => void;
}

export function DeletePostDialog({
  post,
  open,
  onClose,
}: DeletePostDialogProps) {
  const deletePost = useDeletePost();

  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync(post.id);
      onClose();
    } catch (error) {
      // Error is handled by the mutation's onError
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Delete Post</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack align='stretch' gap={3}>
                <Text>Are you sure you want to delete this post?</Text>
                <VStack
                  align='stretch'
                  gap={2}
                  p={3}
                  bg='bg.muted'
                  borderRadius='md'
                >
                  <Text fontWeight='semibold' fontSize='sm'>
                    {post.title}
                  </Text>
                  <Text fontSize='xs' color='fg.muted'>
                    by {post.user.name}
                  </Text>
                  <HStack gap={2} fontSize='xs'>
                    <Text>👍 {post._count.likes}</Text>
                    <Text>💬 {post._count.comments}</Text>
                    <Text>🔄 {post._count.shares}</Text>
                  </HStack>
                </VStack>
                <Text fontSize='sm' color='red.500'>
                  This action cannot be undone. All comments and interactions
                  will also be removed.
                </Text>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <HStack gap={2}>
                <Dialog.ActionTrigger asChild>
                  <Button variant='outline'>Cancel</Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette='red'
                  onClick={handleDelete}
                  loading={deletePost.isPending}
                >
                  Delete Post
                </Button>
              </HStack>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size='sm' />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
