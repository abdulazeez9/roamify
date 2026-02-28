'use client';
import React, { useState } from 'react';
import { MediaType } from '@zagotours/types';
import {
  Box,
  Button,
  Input,
  Field,
  VStack,
  HStack,
  Image,
  Text,
  Switch,
} from '@chakra-ui/react';
import { useCreateGallery } from '@/hooks';
import { SelectInput } from '@/components/ui/input/SelectInput';

const CATEGORY_OPTIONS = [
  { label: 'Landing Hero', value: 'landing-hero' },
  { label: 'Adventure Showcase', value: 'adventure-showcase' },
  { label: 'Testimonials', value: 'testimonials' },
  { label: 'Partners', value: 'partners' },
  { label: 'Uncategorized', value: 'general' },
];

const MEDIA_TYPE_OPTIONS = [
  { label: 'Image', value: 'IMAGE' },
  { label: 'Video', value: 'VIDEO' },
];

export default function AdminGalleryUpload() {
  const { mutate: createMedia, isPending } = useCreateGallery();

  const [formData, setFormData] = useState({
    title: '',
    category: 'general',
    mediaType: 'IMAGE' as MediaType,
    featured: false,
    order: 0,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const data = new FormData();
    data.append('media', selectedFile);
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('mediaType', formData.mediaType);
    data.append('featured', String(formData.featured));
    data.append('order', String(formData.order));

    createMedia(data, {
      onSuccess: () => {
        setFormData({
          title: '',
          category: 'general',
          mediaType: 'IMAGE' as MediaType,
          featured: false,
          order: 0,
        });
        setSelectedFile(null);
        setPreviewUrl(null);
      },
    });
  };

  return (
    <Box
      as='form'
      onSubmit={handleSubmit}
      p={6}
      border='1px solid'
      borderColor='gray.200'
      borderRadius='md'
    >
      <VStack gap={5} align='stretch'>
        <Text fontSize='xl' fontWeight='bold'>
          Upload Platform Media
        </Text>

        {/* Image Preview Area */}
        <Box
          h='200px'
          bg='gray.50'
          borderRadius='md'
          border='2px dashed'
          borderColor='gray.300'
          display='flex'
          alignItems='center'
          justifyContent='center'
          overflow='hidden'
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt='Preview'
              h='full'
              w='full'
              objectFit='cover'
            />
          ) : (
            <Text color='gray.500'>No file selected</Text>
          )}
        </Box>

        <Field.Root required>
          <Field.Label>Media File</Field.Label>
          <Input
            type='file'
            accept='image/*,video/*'
            onChange={handleFileChange}
          />
        </Field.Root>

        <HStack gap={4}>
          <Field.Root flex={1}>
            <Field.Label>Title</Field.Label>
            <Input
              placeholder='e.g. Beautiful Sunset'
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </Field.Root>

          <Field.Root w='200px'>
            <Field.Label>Display Order</Field.Label>
            <Input
              type='number'
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: Number(e.target.value) })
              }
            />
          </Field.Root>
        </HStack>

        <HStack gap={4}>
          <Field.Root flex={1}>
            <Field.Label>Category</Field.Label>
            <SelectInput
              value={formData.category}
              onChange={(val) => setFormData({ ...formData, category: val })}
              options={CATEGORY_OPTIONS}
            />
          </Field.Root>

          <Field.Root w='150px'>
            <Field.Label>Media Type</Field.Label>
            <SelectInput
              value={formData.mediaType}
              onChange={(val) =>
                setFormData({ ...formData, mediaType: val as MediaType })
              }
              options={MEDIA_TYPE_OPTIONS}
            />
          </Field.Root>
        </HStack>

        {/* Fixed: proper Chakra v3 Switch anatomy */}
        <HStack justify='space-between' p={2} bg='green.50' borderRadius='md'>
          <Text fontWeight='medium'>Feature this on landing page?</Text>
          <Switch.Root
            colorPalette='green'
            checked={formData.featured}
            onCheckedChange={(e) =>
              setFormData({ ...formData, featured: !!e.checked })
            }
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
        </HStack>

        {/* Fixed: colorPalette instead of colorScheme (v3) */}
        <Button
          type='submit'
          bg='primary'
          color='white'
          loading={isPending}
          disabled={!selectedFile || isPending}
        >
          Upload to Gallery
        </Button>
      </VStack>
    </Box>
  );
}
