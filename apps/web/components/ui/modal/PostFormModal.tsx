'use client';

import { AvatarImage } from '@/components/media/AvatarImage';
import { useUserProfile, useCreatePost } from '@/hooks';
import { usePostModalStore } from '@/store/usePostModalStore';
import {
  Dialog,
  Portal,
  Button,
  Textarea,
  CloseButton,
  HStack,
  IconButton,
  Box,
  Text,
  Image,
  Input,
  Flex,
  VStack,
} from '@chakra-ui/react';
import { Image as ImageIcon, X, CirclePlay } from 'lucide-react';
import { useRef, useState } from 'react';
import { SelectInput } from '../input/SelectInput';
import { TripTypeLabels } from '@zagotours/types';

export function PostFormModal() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isOpen, closeModal } = usePostModalStore();
  const { data } = useUserProfile();
  const createPost = useCreatePost();

  const profileImage = data?.data?.image;
  const name = data?.data?.name;
  const country = data?.data?.country;

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!description.trim() || !title.trim()) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (selectedFile) {
      formData.append('media', selectedFile);

      const mediaType = selectedFile.type.startsWith('video/')
        ? 'VIDEO'
        : 'IMAGE';
      formData.append('mediaType', mediaType);
    }

    createPost.mutate(formData, {
      onSuccess: () => {
        setTitle('');
        setDescription('');
        setSelectedFile(null);
        setPreviewUrl(null);
        closeModal();
      },
    });
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && closeModal()}
      lazyMount
      size='lg'
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius='xl'>
            <Dialog.Header
              borderBottomWidth='1px'
              position='relative'
              width='full'
            >
              <Text textAlign='center' fontSize='xl' fontWeight='semibold'>
                Create post
              </Text>
              <Dialog.CloseTrigger asChild>
                <CloseButton pos='absolute' top='2' right='2' />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body py={4}>
              <Flex align='center' gap={2} mb={4}>
                <AvatarImage src={profileImage} name={name} />
                <VStack align='start' gap={0}>
                  <Text fontWeight='medium'>{name}</Text>
                  <Text fontSize='sm' color='gray.600'>
                    {country}
                  </Text>
                </VStack>
              </Flex>
              <Box mb={3}>
                <SelectInput
                  value={title}
                  onChange={setTitle}
                  placeholder='Select trip type'
                  options={Object.entries(TripTypeLabels).map(
                    ([value, label]) => ({
                      label,
                      value,
                    }),
                  )}
                />
              </Box>

              <Textarea
                placeholder={`What's on your mind, ${name?.split(' ')[0]}?`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                minH='100px'
                variant='flushed'
                fontSize='lg'
                autoFocus
              />

              <input
                type='file'
                accept='image/*,video/*'
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {previewUrl && (
                <Box
                  position='relative'
                  mt={2}
                  borderRadius='md'
                  overflow='hidden'
                >
                  <IconButton
                    size='xs'
                    colorScheme='blackAlpha'
                    position='absolute'
                    top={2}
                    right={2}
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    aria-label='Remove media'
                  >
                    <X size={14} />
                  </IconButton>
                  <Image
                    src={previewUrl}
                    alt='Preview'
                    maxH='300px'
                    w='full'
                    objectFit='cover'
                  />
                </Box>
              )}
            </Dialog.Body>

            <Dialog.Footer borderTopWidth='1px' pt={3}>
              <Flex justify='space-between' align='center' w='full'>
                <Button
                  bg='primary'
                  color='white'
                  size='md'
                  flex={1}
                  mr={2}
                  onClick={handleSubmit}
                  loading={createPost.isPending}
                  disabled={!description.trim() || !title.trim()}
                >
                  Post
                </Button>
                <HStack gap={1}>
                  <IconButton
                    variant='ghost'
                    aria-label='Add Image'
                    size='sm'
                    onClick={handleIconClick}
                  >
                    <ImageIcon size={32} />
                  </IconButton>
                  <IconButton
                    variant='ghost'
                    aria-label='Add Video'
                    size='sm'
                    onClick={handleIconClick}
                  >
                    <CirclePlay size={32} />
                  </IconButton>
                </HStack>
              </Flex>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
