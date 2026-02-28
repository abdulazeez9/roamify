'use client';

import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  VStack,
  HStack,
  Text,
  IconButton,
  Image,
  SimpleGrid,
  Spinner,
  Center,
  Field,
  Badge,
  Portal,
  Drawer,
  CloseButton,
} from '@chakra-ui/react';
import { useRouter, useParams } from 'next/navigation';
import { useState, useRef } from 'react';
import {
  FiUpload,
  FiTrash2,
  FiEdit,
  FiChevronLeft,
  FiImage,
} from 'react-icons/fi';
import {
  useAdventure,
  useGallery,
  useBulkUploadGallery,
  useUpdateGalleryImage,
  useDeleteGalleryImage,
} from '@/hooks';

export default function GalleryPage() {
  const router = useRouter();
  const params = useParams();
  const adventureId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ altText: '', order: 0 });

  const { data: adventureRes, isLoading: loadingAdventure } =
    useAdventure(adventureId);
  const { data: galleryRes, isLoading: loadingGallery } =
    useGallery(adventureId);

  const uploadMutation = useBulkUploadGallery();
  const updateMutation = useUpdateGalleryImage();
  const deleteMutation = useDeleteGalleryImage();

  const adventure = adventureRes?.data;
  const gallery = (galleryRes?.data || [])
    .filter((item: any) => !item.deletedAt)
    .sort((a: any, b: any) => a.order - b.order);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ altText: item.altText || '', order: item.order });
    setIsOpen(true);
  };

  const handleUpdateImage = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(
      { adventureId, galleryId: editingItem.id, data: formData },
      { onSuccess: () => setIsOpen(false) },
    );
  };

  if (loadingAdventure || loadingGallery)
    return (
      <Center h='60vh'>
        <Spinner size='xl' />
      </Center>
    );

  return (
    <Container maxW='container.xl' py={8}>
      <HStack justify='space-between' mb={6}>
        <VStack align='start' gap={1}>
          <Button variant='ghost' size='sm' onClick={() => router.back()}>
            <FiChevronLeft /> Back
          </Button>
          <Heading size='lg'>Adventure Gallery</Heading>
          <Text color='fg.muted'>{adventure?.title}</Text>
        </VStack>
        <Button
          bg='primary'
          color='white'
          onClick={() => fileInputRef.current?.click()}
          loading={uploadMutation.isPending}
        >
          <FiUpload style={{ marginRight: '8px' }} /> Upload
        </Button>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          multiple
          style={{ display: 'none' }}
          onChange={(e) => {
            const files = e.target.files;
            if (files)
              uploadMutation.mutate({ adventureId, files: Array.from(files) });
          }}
        />
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
        {gallery.map((item: any) => (
          <Box
            key={item.id}
            bg='bg.panel'
            shadow='sm'
            rounded='lg'
            overflow='hidden'
            borderWidth='1px'
          >
            <Box position='relative' h='220px'>
              <Image
                src={item.mediaUrl}
                alt={item.altText || ''}
                h='full'
                w='full'
                objectFit='cover'
              />
              <Badge
                position='absolute'
                top={2}
                left={2}
                colorPalette='blackAlpha'
              >
                Order: {item.order}
              </Badge>
            </Box>
            <Box p={4}>
              <HStack justify='space-between'>
                <Text fontSize='sm'>{item.altText || 'No description'}</Text>
                <HStack gap={1}>
                  <IconButton
                    aria-label='Edit'
                    variant='ghost'
                    size='xs'
                    onClick={() => handleEdit(item)}
                  >
                    <FiEdit />
                  </IconButton>
                  <IconButton
                    aria-label='Delete'
                    size='xs'
                    colorPalette='red'
                    variant='ghost'
                    onClick={() =>
                      deleteMutation.mutate({ galleryId: item.id, adventureId })
                    }
                  >
                    <FiTrash2 />
                  </IconButton>
                </HStack>
              </HStack>
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      <Drawer.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <form onSubmit={handleUpdateImage}>
                <Drawer.Header>
                  <Drawer.Title>Edit Image Details</Drawer.Title>
                </Drawer.Header>

                <Drawer.Body>
                  <VStack gap={5} py={4}>
                    <Image
                      src={editingItem?.mediaUrl}
                      rounded='md'
                      h='200px'
                      w='full'
                      objectFit='cover'
                    />
                    <Field.Root>
                      <Field.Label>Alt Text</Field.Label>
                      <Input
                        value={formData.altText}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            altText: e.target.value,
                          }))
                        }
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Order</Field.Label>
                      <Input
                        type='number'
                        value={formData.order}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            order: Number(e.target.value),
                          }))
                        }
                      />
                    </Field.Root>
                  </VStack>
                </Drawer.Body>

                <Drawer.Footer>
                  <Button variant='outline' onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    bg='primary'
                    color='white'
                    loading={updateMutation.isPending}
                  >
                    Save
                  </Button>
                </Drawer.Footer>

                <Drawer.CloseTrigger asChild>
                  <CloseButton size='sm' />
                </Drawer.CloseTrigger>
              </form>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Container>
  );
}
