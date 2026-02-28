'use client';

import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Textarea,
  VStack,
  HStack,
  Text,
  IconButton,
  Drawer,
  CloseButton,
  Image,
  AspectRatio,
  Portal,
  Field,
} from '@chakra-ui/react';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiChevronLeft } from 'react-icons/fi';
import {
  useAdventure,
  useItineraries,
  useUpdateItinerary,
  useDeleteItinerary,
  useCreateItinerary,
} from '@/hooks';
import { LoadingState } from '@/components/ui/LoadingState';
import { UpdateItineraryDto, ItineraryResponseDto } from '@zagotours/types';

export default function ItineraryPage() {
  const router = useRouter();
  const params = useParams();
  const adventureId = params.id as string;

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Single state for both Create and Edit
  const [formData, setFormData] = useState<UpdateItineraryDto>({
    dayNumber: 1,
    title: '',
    activityDetails: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: adventureRes, isLoading: loadingAdventure } =
    useAdventure(adventureId);
  const { data: itineraryRes, isLoading: loadingItineraries } =
    useItineraries(adventureId);

  const createMutation = useCreateItinerary();
  const updateMutation = useUpdateItinerary();
  const deleteMutation = useDeleteItinerary();

  const itineraries = (itineraryRes?.data || []).sort(
    (a: ItineraryResponseDto, b: ItineraryResponseDto) =>
      a.dayNumber - b.dayNumber,
  );

  const handleOpenDrawer = (itinerary?: ItineraryResponseDto) => {
    if (itinerary) {
      setEditingId(itinerary.id);
      setFormData({
        dayNumber: itinerary.dayNumber,
        title: itinerary.title,
        activityDetails: itinerary.activityDetails,
        imageUrl: itinerary.imageUrl || undefined,
      });
      setImagePreview(itinerary.imageUrl || null);
    } else {
      setEditingId(null);
      setFormData({
        dayNumber: itineraries.length + 1,
        title: '',
        activityDetails: '',
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsOpen(true);
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(editingId ? formData.imageUrl || null : null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('dayNumber', String(formData.dayNumber));
    formDataToSend.append('title', formData.title || '');
    formDataToSend.append('activityDetails', formData.activityDetails || '');

    if (imageFile) {
      formDataToSend.append('media', imageFile);
    }

    if (editingId) {
      updateMutation.mutate(
        { adventureId, itineraryId: editingId, data: formDataToSend },
        { onSuccess: () => setIsOpen(false) },
      );
    } else {
      createMutation.mutate(
        { adventureId, data: formDataToSend },
        { onSuccess: () => setIsOpen(false) },
      );
    }
  };

  if (loadingAdventure || loadingItineraries) return <LoadingState />;

  return (
    <Container maxW='container.lg' py={8}>
      <HStack justify='space-between' mb={6}>
        <VStack align='start' gap={1}>
          <Button variant='ghost' size='sm' onClick={() => router.back()}>
            <FiChevronLeft /> Back
          </Button>
          <Heading size='lg'>Itineraries</Heading>
          <Text color='fg.muted'>{adventureRes?.data?.title}</Text>
        </VStack>
        <Button bg='primary' color='white' onClick={() => handleOpenDrawer()}>
          <FiPlus /> Add Day
        </Button>
      </HStack>

      {/* List of Itineraries */}
      <VStack gap={4} align='stretch'>
        {itineraries.map((item: any) => (
          <Box
            key={item.id}
            p={5}
            shadow='sm'
            rounded='md'
            borderWidth='1px'
            bg='bg.panel'
          >
            <HStack justify='space-between' align='start'>
              <VStack align='start' flex={1} gap={2}>
                <Heading size='md'>
                  Day {item.dayNumber}: {item.title}
                </Heading>
                {item.imageUrl && (
                  <AspectRatio ratio={16 / 9} w='full' maxW='400px'>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      rounded='md'
                      objectFit='cover'
                    />
                  </AspectRatio>
                )}
                <Text mt={2} color='fg.subtle' whiteSpace='pre-wrap'>
                  {item.activityDetails}
                </Text>
              </VStack>
              <HStack>
                <IconButton
                  aria-label='Edit'
                  variant='outline'
                  size='sm'
                  onClick={() => handleOpenDrawer(item)}
                >
                  <FiEdit />
                </IconButton>
                <IconButton
                  aria-label='Delete'
                  size='sm'
                  colorPalette='red'
                  variant='ghost'
                  onClick={() =>
                    deleteMutation.mutate({
                      itineraryId: item.id,
                      adventureId,
                      dayNumber: item.dayNumber,
                    })
                  }
                >
                  <FiTrash2 />
                </IconButton>
              </HStack>
            </HStack>
          </Box>
        ))}
      </VStack>

      {/* Single Drawer for Create & Edit */}
      <Drawer.Root
        open={isOpen}
        onOpenChange={(e) => setIsOpen(e.open)}
        size='lg'
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content overflowY='scroll'>
              <form onSubmit={handleSubmit}>
                <Drawer.Header>
                  <Drawer.Title>
                    {editingId ? 'Edit' : 'Add'} Itinerary Day
                  </Drawer.Title>
                </Drawer.Header>

                <Drawer.Body>
                  <VStack gap={5} py={4}>
                    <Field.Root required>
                      <Field.Label>Day Number</Field.Label>
                      <Input
                        type='number'
                        value={formData.dayNumber}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            dayNumber: Number(e.target.value),
                          }))
                        }
                      />
                    </Field.Root>

                    <Field.Root required>
                      <Field.Label>Title</Field.Label>
                      <Input
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, title: e.target.value }))
                        }
                        placeholder='e.g. Arrival & Briefing'
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Image</Field.Label>
                      {imagePreview && (
                        <AspectRatio ratio={16 / 9} w='full' mb={2}>
                          <Image
                            src={imagePreview}
                            alt='Preview'
                            rounded='md'
                            objectFit='cover'
                          />
                        </AspectRatio>
                      )}
                      <Input
                        type='file'
                        accept='image/*'
                        onChange={(e) =>
                          handleImageChange(e.target.files?.[0] || null)
                        }
                      />
                    </Field.Root>

                    <Field.Root required>
                      <Field.Label>Activities</Field.Label>
                      <Textarea
                        rows={10}
                        value={formData.activityDetails}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            activityDetails: e.target.value,
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
                    loading={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    {editingId ? 'Update' : 'Create'} Day
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
