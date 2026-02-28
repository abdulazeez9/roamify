'use client';

import { useState } from 'react';
import {
  Text,
  Badge,
  HStack,
  VStack,
  Textarea,
  Drawer,
  Dialog,
  Field,
  CloseButton,
  Portal,
  Box,
} from '@chakra-ui/react';
import { ReviewResponseDto } from '@zagotours/types';
import { useDeleteReview, useUpdateReview } from '@/hooks';
import Button from '@/components/ui/button/Button';
import { AvatarImage } from '@/components/media/AvatarImage';

interface ReviewViewDrawerProps {
  review: ReviewResponseDto;
  open: boolean;
  onClose: () => void;
}

export function ReviewViewDrawer({
  review,
  open,
  onClose,
}: ReviewViewDrawerProps) {
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
              <Drawer.Title>Review Details</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <VStack align='stretch' gap={4}>
                <Field.Root>
                  <Field.Label>Reviewer</Field.Label>
                  <HStack>
                    {review.user.image && (
                      <AvatarImage
                        src={review.user.image}
                        name={review.user.name}
                        size='sm'
                      />
                    )}
                    <VStack align='start' gap={0}>
                      <Text fontWeight='medium'>{review.user.name}</Text>
                      {review.user.country && (
                        <Text fontSize='xs' color='fg.muted'>
                          {review.user.country}
                        </Text>
                      )}
                    </VStack>
                  </HStack>
                </Field.Root>

                {review.title && (
                  <Field.Root>
                    <Field.Label>Title</Field.Label>
                    <Text fontWeight='medium'>{review.title}</Text>
                  </Field.Root>
                )}

                <Field.Root>
                  <Field.Label>Rating</Field.Label>
                  <HStack>
                    <Text color='yellow.500' fontSize='xl'>
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </Text>
                    <Text fontWeight='semibold'>{review.rating}/5</Text>
                  </HStack>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Review Content</Field.Label>
                  <Box
                    p={3}
                    bg='bg.muted'
                    borderRadius='md'
                    borderWidth='1px'
                    borderColor='border.muted'
                  >
                    <Text lineHeight='1.7' whiteSpace='pre-wrap'>
                      {review.content}
                    </Text>
                  </Box>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Featured Status</Field.Label>
                  <Badge colorPalette={review.isFeatured ? 'purple' : 'gray'}>
                    {review.isFeatured ? 'Featured' : 'Not Featured'}
                  </Badge>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Submitted</Field.Label>
                  <Text fontSize='sm'>
                    {new Date(review.createdAt).toLocaleString()}
                  </Text>
                </Field.Root>

                {review.updatedAt && review.updatedAt !== review.createdAt && (
                  <Field.Root>
                    <Field.Label>Last Updated</Field.Label>
                    <Text fontSize='sm'>
                      {new Date(review.updatedAt).toLocaleString()}
                    </Text>
                  </Field.Root>
                )}
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

interface ReviewEditDrawerProps {
  review: ReviewResponseDto;
  open: boolean;
  onClose: () => void;
}

export function ReviewEditDrawer({
  review,
  open,
  onClose,
}: ReviewEditDrawerProps) {
  const [content, setContent] = useState(review.content);
  const updateReview = useUpdateReview();

  const handleSubmit = async () => {
    try {
      await updateReview.mutateAsync({
        id: review.id,
        data: { content },
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
              <Drawer.Title>Edit Review</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <VStack align='stretch' gap={4}>
                <Field.Root>
                  <Field.Label>Reviewer (Read-only)</Field.Label>
                  <HStack>
                    {review.user.image && (
                      <AvatarImage
                        src={review.user.image}
                        name={review.user.name}
                        size='sm'
                      />
                    )}
                    <Text fontWeight='medium'>{review.user.name}</Text>
                  </HStack>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Rating (Read-only)</Field.Label>
                  <HStack>
                    <Text color='yellow.500' fontSize='xl'>
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </Text>
                    <Text fontWeight='semibold'>{review.rating}/5</Text>
                  </HStack>
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Review Content</Field.Label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder='Enter review content'
                    rows={6}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Featured Status</Field.Label>
                  <Badge colorPalette={review.isFeatured ? 'purple' : 'gray'}>
                    {review.isFeatured ? 'Featured' : 'Not Featured'}
                  </Badge>
                  <Text fontSize='xs' color='fg.muted' mt={1}>
                    Use the star icon in the table to toggle featured status
                  </Text>
                </Field.Root>
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
                  loading={updateReview.isPending}
                  disabled={!content.trim()}
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

interface DeleteReviewDialogProps {
  review: ReviewResponseDto;
  open: boolean;
  onClose: () => void;
}

export function DeleteReviewDialog({
  review,
  open,
  onClose,
}: DeleteReviewDialogProps) {
  const deleteReview = useDeleteReview();

  const handleDelete = async () => {
    try {
      await deleteReview.mutateAsync(review.id);
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
              <Dialog.Title>Delete Review</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack align='stretch' gap={3}>
                <Text>Are you sure you want to delete this review?</Text>
                <VStack
                  align='stretch'
                  gap={2}
                  p={3}
                  bg='bg.muted'
                  borderRadius='md'
                >
                  <HStack justify='space-between'>
                    <Text fontWeight='semibold' fontSize='sm'>
                      {review.user.name}
                    </Text>
                    <Text color='yellow.500'>{'★'.repeat(review.rating)}</Text>
                  </HStack>
                  {review.title && (
                    <Text fontSize='sm' fontWeight='medium'>
                      {review.title}
                    </Text>
                  )}
                  <Text fontSize='sm' color='fg.muted' lineClamp={3}>
                    {review.content}
                  </Text>
                  {review.isFeatured && (
                    <Badge colorPalette='purple' alignSelf='start'>
                      Featured
                    </Badge>
                  )}
                </VStack>
                <Text fontSize='sm' color='red.500'>
                  This action cannot be undone.
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
                  loading={deleteReview.isPending}
                >
                  Delete Review
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
