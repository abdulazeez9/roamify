'use client';

import React from 'react';
import {
  Text,
  HStack,
  Drawer,
  Dialog,
  Field,
  VStack,
  Box,
  CloseButton,
  Portal,
} from '@chakra-ui/react';
import { Trash2, Mail } from 'lucide-react';
import { useDeleteInquiry } from '@/hooks';
import { GeneralInquiryResponseDto } from '@zagotours/types';
import Button from '@/components/ui/button/Button';

interface InquiryViewDrawerProps {
  inquiry: GeneralInquiryResponseDto;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function InquiryViewDrawer({
  inquiry,
  open,
  onClose,
  onDelete,
}: InquiryViewDrawerProps) {
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
              <Drawer.Title>Inquiry Details</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <VStack align='stretch' gap={4}>
                <Field.Root>
                  <Field.Label>Email Address</Field.Label>
                  <HStack>
                    <Mail size={16} />
                    <Text fontWeight='medium'>{inquiry.email}</Text>
                  </HStack>
                  <Button
                    variant='ghost'
                    size='sm'
                    colorPalette='blue'
                    mt={2}
                    asChild
                  >
                    <a href={`mailto:${inquiry.email}`}>Send Email Reply</a>
                  </Button>
                </Field.Root>

                {inquiry.phone && (
                  <Field.Root>
                    <Field.Label>Phone</Field.Label>
                    <Text>{inquiry.phone}</Text>
                  </Field.Root>
                )}

                {inquiry.address && (
                  <Field.Root>
                    <Field.Label>Address</Field.Label>
                    <Text>{inquiry.address}</Text>
                  </Field.Root>
                )}

                <Field.Root>
                  <Field.Label>Message</Field.Label>
                  <Box
                    p={3}
                    bg='bg.muted'
                    borderRadius='md'
                    borderWidth='1px'
                    borderColor='border.muted'
                  >
                    <Text lineHeight='1.7' whiteSpace='pre-wrap'>
                      {inquiry.message}
                    </Text>
                  </Box>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Received</Field.Label>
                  <Text fontSize='sm' color='fg.muted'>
                    {new Date(inquiry.createdAt).toLocaleString()}
                  </Text>
                </Field.Root>
              </VStack>
            </Drawer.Body>
            <Drawer.Footer>
              <HStack gap={2} width='full' justify='space-between'>
                <Button variant='outline' onClick={onClose}>
                  Close
                </Button>
                <Button colorPalette='red' variant='outline' onClick={onDelete}>
                  <Trash2 size={16} />
                  Delete Inquiry
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

interface DeleteInquiryDialogProps {
  inquiry: GeneralInquiryResponseDto;
  open: boolean;
  onClose: () => void;
}

export function DeleteInquiryDialog({
  inquiry,
  open,
  onClose,
}: DeleteInquiryDialogProps) {
  const deleteInquiry = useDeleteInquiry();

  const handleDelete = async () => {
    try {
      await deleteInquiry.mutateAsync(inquiry.id);
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
              <Dialog.Title>Delete Inquiry</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack align='stretch' gap={3}>
                <Text>Are you sure you want to delete this inquiry?</Text>
                <VStack
                  align='stretch'
                  gap={2}
                  p={3}
                  bg='bg.muted'
                  borderRadius='md'
                >
                  <HStack>
                    <Mail size={16} />
                    <Text fontWeight='semibold' fontSize='sm'>
                      {inquiry.email}
                    </Text>
                  </HStack>
                  {inquiry.phone && (
                    <Text fontSize='xs' color='fg.muted'>
                      Phone: {inquiry.phone}
                    </Text>
                  )}
                  <Text fontSize='sm' color='fg.muted'>
                    {inquiry.message}
                  </Text>
                  <Text fontSize='xs' color='fg.muted'>
                    Received: {new Date(inquiry.createdAt).toLocaleDateString()}
                  </Text>
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
                  loading={deleteInquiry.isPending}
                >
                  Delete Inquiry
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
