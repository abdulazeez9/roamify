'use client';

import React, { useState } from 'react';
import {
  Grid,
  Box,
  Image,
  Badge,
  IconButton,
  HStack,
  Text,
  VStack,
  Card,
  Drawer,
  Portal,
  CloseButton,
  AspectRatio,
} from '@chakra-ui/react';
import { LuTrash2, LuStar, LuStarOff, LuEye } from 'react-icons/lu';
import { useGalleries, useDeleteGallery, useUpdateGallery } from '@/hooks';
import { PaginationControl } from '@/components/ui/pagination/PaginationControl';
import { LoadingState } from '@/components/ui/LoadingState';
import Button from '@/components/ui/button/Button';
import { useRouter } from 'next/navigation';

export default function GalleryManagement() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [previewItem, setPreviewItem] = useState<any | null>(null);
  const limit = 12;

  const { data, isLoading } = useGalleries({ page, limit });
  const { mutate: deleteItem } = useDeleteGallery();
  const { mutate: updateItem } = useUpdateGallery();

  const handleToggleFeatured = (id: string, currentStatus: boolean) => {
    updateItem({ id, data: { featured: !currentStatus } });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this media?')) {
      deleteItem(id);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Box w='full' p={4}>
      <HStack justify='space-between' mb={6}>
        <VStack align='start' gap={0}>
          <Text fontSize='2xl' fontWeight='bold'>
            Gallery Assets
          </Text>
          <Text color='gray.500' fontSize='sm'>
            Manage platform-wide images and videos
          </Text>
        </VStack>
        <HStack gap={3}>
          <Badge colorPalette='blue' variant='subtle' p={2} borderRadius='md'>
            Total: {data?.pagination?.total || 0}
          </Badge>

          <Button
            bg='primary'
            color='white'
            onClick={() => router.push('/admin/galleries/create')}
          >
            Upload to gallery
          </Button>
        </HStack>
      </HStack>

      {/* Grid Display */}
      <Grid templateColumns='repeat(auto-fill, minmax(250px, 1fr))' gap={6}>
        {data?.data?.map((item: any) => (
          <Card.Root
            key={item.id}
            overflow='hidden'
            variant='outline'
            size='sm'
          >
            <Box position='relative' h='180px'>
              <Image
                src={item.mediaUrl}
                alt={item.title || 'Gallery item'}
                h='full'
                w='full'
                objectFit='cover'
              />

              <HStack position='absolute' top={2} left={2} gap={2}>
                {item.featured && (
                  <Badge colorPalette='yellow' variant='solid'>
                    <LuStar style={{ marginRight: '4px' }} /> Featured
                  </Badge>
                )}
                <Badge colorPalette='gray' variant='solid'>
                  {item.category || 'General'}
                </Badge>
              </HStack>
            </Box>

            <Card.Body p={3}>
              <Text fontWeight='semibold' truncate fontSize='sm'>
                {item.title || 'Untitled Asset'}
              </Text>
              <Text fontSize='xs' color='gray.500'>
                Order: {item.order} • {item.mediaType}
              </Text>
            </Card.Body>

            <Card.Footer p={3} borderTop='1px solid' borderColor='gray.100'>
              <HStack justify='space-between' w='full'>
                <HStack gap={2}>
                  <IconButton
                    size='sm'
                    variant='ghost'
                    aria-label='Toggle Featured'
                    color={item.featured ? 'yellow.500' : 'gray.400'}
                    onClick={() => handleToggleFeatured(item.id, item.featured)}
                  >
                    {item.featured ? <LuStar /> : <LuStarOff />}
                  </IconButton>

                  <IconButton
                    size='sm'
                    variant='ghost'
                    aria-label='Preview'
                    onClick={() => setPreviewItem(item)}
                  >
                    <LuEye />
                  </IconButton>
                </HStack>

                <IconButton
                  size='sm'
                  variant='ghost'
                  colorPalette='red'
                  aria-label='Delete'
                  onClick={() => handleDelete(item.id)}
                >
                  <LuTrash2 />
                </IconButton>
              </HStack>
            </Card.Footer>
          </Card.Root>
        ))}
      </Grid>

      {data?.pagination && (
        <PaginationControl
          pagination={data.pagination}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      {/* Media Preview Drawer */}
      <Drawer.Root
        open={!!previewItem}
        onOpenChange={(e) => {
          if (!e.open) setPreviewItem(null);
        }}
        size='md'
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>
                  {previewItem?.title || 'Untitled Asset'}
                </Drawer.Title>
              </Drawer.Header>

              <Drawer.Body>
                <VStack gap={4} align='stretch'>
                  {/* Media display */}
                  {previewItem?.mediaType === 'VIDEO' ? (
                    <AspectRatio ratio={16 / 9}>
                      <video
                        src={previewItem.mediaUrl}
                        controls
                        style={{ borderRadius: '8px', width: '100%' }}
                      />
                    </AspectRatio>
                  ) : (
                    <Image
                      src={previewItem?.mediaUrl}
                      alt={previewItem?.title || 'Preview'}
                      w='full'
                      borderRadius='md'
                      objectFit='contain'
                    />
                  )}

                  {/* Meta info */}
                  <HStack wrap='wrap' gap={2}>
                    <Badge colorPalette='blue' variant='subtle'>
                      {previewItem?.category || 'General'}
                    </Badge>
                    <Badge colorPalette='gray' variant='subtle'>
                      {previewItem?.mediaType}
                    </Badge>
                    {previewItem?.featured && (
                      <Badge colorPalette='yellow' variant='subtle'>
                        Featured
                      </Badge>
                    )}
                  </HStack>

                  <Text fontSize='sm' color='gray.500'>
                    Display Order: {previewItem?.order}
                  </Text>
                </VStack>
              </Drawer.Body>

              <Drawer.CloseTrigger asChild>
                <CloseButton size='sm' />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Box>
  );
}
