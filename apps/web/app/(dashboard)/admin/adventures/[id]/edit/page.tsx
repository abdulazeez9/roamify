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
  SimpleGrid,
  Field,
  createListCollection,
  Image,
  IconButton,
  Text,
} from '@chakra-ui/react';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@chakra-ui/react/select';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  FiSave,
  FiChevronLeft,
  FiList,
  FiImage,
  FiUpload,
  FiX,
} from 'react-icons/fi';

// Hooks and Constants
import { useAdventure, useUpdateAdventure } from '@/hooks';
import {
  AdventureLevelLabels,
  TripTypeLabels,
  AdventureStatusLabels,
  UpdateAdventureDto,
} from '@zagotours/types';
import { LoadingState } from '@/components/ui/LoadingState';

type FormDataWithImage = Omit<UpdateAdventureDto, 'rating'> & {
  imageFile?: File | null;
  imagePreview?: string | null;
  currentImage?: string | null;
  rating?: string;
};
export default function EditAdventurePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState<FormDataWithImage | null>(null);

  // Create collections for Select components
  const levelCollection = createListCollection({
    items: Object.entries(AdventureLevelLabels).map(([value, label]) => ({
      label,
      value,
    })),
  });

  const tripTypeCollection = createListCollection({
    items: Object.entries(TripTypeLabels).map(([value, label]) => ({
      label,
      value,
    })),
  });

  const statusCollection = createListCollection({
    items: Object.entries(AdventureStatusLabels).map(([value, label]) => ({
      label,
      value,
    })),
  });

  // 1. Fetch existing data
  const { data: response, isLoading: isFetching } = useAdventure(id);
  const { mutate: updateAdventure, isPending: isUpdating } =
    useUpdateAdventure();

  // 2. Sync fetched data to local state
  useEffect(() => {
    if (response?.data) {
      const adventure = response.data;
      setFormData({
        title: adventure.title,
        description: adventure.description,
        location: adventure.location,
        price: adventure.price,
        level: adventure.level,
        tripType: adventure.tripType,
        days: adventure.days,
        safetyScore: adventure.safetyScore,
        safetyTips: adventure.safetyTips || '',
        certification: adventure.certification || '',
        inclusions: adventure.inclusions || '',
        exclusions: adventure.exclusions || '',
        partnerDescription: adventure.partnerDescription || '',
        gear: adventure.gear || '',
        date: adventure.date
          ? new Date(adventure.date).toISOString().split('T')[0]
          : '',
        status: adventure.status,
        rating: String(adventure.rating || 0),
        currentImage: adventure.mediaUrl || null,
      });
    }
  }, [response]);

  const handleChange = (field: keyof FormDataWithImage, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleImageChange = (file: File | null) => {
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) =>
        prev
          ? {
              ...prev,
              imageFile: file,
              imagePreview: reader.result as string,
            }
          : null,
      );
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            imageFile: null,
            imagePreview: null,
            currentImage: null,
          }
        : null,
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const submitData = new FormData();

    // Append all fields
    if (formData.title) submitData.append('title', formData.title);
    if (formData.description)
      submitData.append('description', formData.description);
    if (formData.location) submitData.append('location', formData.location);
    if (formData.price) submitData.append('price', formData.price.toString());
    if (formData.level) submitData.append('level', formData.level);
    if (formData.tripType) submitData.append('tripType', formData.tripType);
    if (formData.days) submitData.append('days', formData.days.toString());
    if (formData.safetyScore)
      submitData.append('safetyScore', formData.safetyScore.toString());
    if (formData.safetyTips)
      submitData.append('safetyTips', formData.safetyTips);
    if (formData.inclusions)
      submitData.append('inclusions', formData.inclusions);
    if (formData.exclusions)
      submitData.append('exclusions', formData.exclusions);
    if (formData.partnerDescription)
      submitData.append('partnerDescription', formData.partnerDescription);

    if (formData.rating !== undefined)
      submitData.append('rating', Number(formData.rating).toString());
    if (formData.date) {
      const dateValue =
        typeof formData.date === 'string'
          ? formData.date
          : new Date(formData.date).toISOString().split('T')[0];
      if (dateValue) {
        submitData.append('date', dateValue);
      }
    }
    if (formData.status) submitData.append('status', formData.status);
    if (formData.certification)
      submitData.append('certification', formData.certification);
    if (formData.gear) submitData.append('gear', formData.gear);

    // Append image if new one selected
    if (formData.imageFile) {
      submitData.append('media', formData.imageFile);
    }

    updateAdventure(
      { id, data: submitData as any },
      {
        onSuccess: () => {
          router.push(`/admin/adventures/${id}`);
        },
      },
    );
  };

  if (isFetching || !formData) {
    return <LoadingState />;
  }

  const displayImage = formData.imagePreview || formData.currentImage;

  return (
    <Container maxW='container.md' py={8}>
      <HStack justify='space-between' mb={6}>
        <VStack align='start' gap={1}>
          <Button variant='ghost' size='sm' onClick={() => router.back()}>
            <FiChevronLeft style={{ marginRight: '8px' }} /> Back
          </Button>
          <Heading size='lg'>Edit Adventure</Heading>
        </VStack>
      </HStack>

      <Box bg='bg.panel' p={6} shadow='sm' rounded='md' borderWidth='1px'>
        <form onSubmit={handleSubmit}>
          <VStack gap={4} align='stretch'>
            {/* Image Upload Section */}
            <Field.Root>
              <Field.Label>Adventure Image</Field.Label>
              {displayImage ? (
                <Box position='relative' maxW='400px'>
                  <Image
                    src={displayImage}
                    alt='Adventure'
                    rounded='md'
                    objectFit='cover'
                    h='250px'
                    w='100%'
                  />
                  <IconButton
                    aria-label='Remove image'
                    position='absolute'
                    top={2}
                    right={2}
                    size='sm'
                    colorPalette='red'
                    onClick={removeImage}
                  >
                    <FiX />
                  </IconButton>
                  {formData.imagePreview && (
                    <Text fontSize='xs' color='green.500' mt={2}>
                      New image selected (save to upload)
                    </Text>
                  )}
                </Box>
              ) : (
                <Box
                  border='2px dashed'
                  borderColor='border.emphasized'
                  rounded='md'
                  p={8}
                  textAlign='center'
                  cursor='pointer'
                  _hover={{ bg: 'bg.muted' }}
                  onClick={() =>
                    document.getElementById('image-input')?.click()
                  }
                >
                  <FiUpload size={40} style={{ margin: '0 auto 12px' }} />
                  <Text fontSize='sm' color='fg.muted'>
                    Click to upload adventure image
                  </Text>
                  <Input
                    id='image-input'
                    type='file'
                    accept='image/*'
                    display='none'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageChange(file);
                    }}
                  />
                </Box>
              )}
            </Field.Root>

            <Field.Root required>
              <Field.Label>Title</Field.Label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>Description</Field.Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
              />
            </Field.Root>

            <SimpleGrid columns={2} gap={4}>
              <Field.Root required>
                <Field.Label>Location</Field.Label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Price ($)</Field.Label>
                <Input
                  type='number'
                  value={formData.price}
                  onChange={(e) =>
                    handleChange('price', Number(e.target.value))
                  }
                />
              </Field.Root>
            </SimpleGrid>

            <SimpleGrid columns={3} gap={4}>
              <Field.Root required>
                <Field.Label>Level</Field.Label>
                <SelectRoot
                  collection={levelCollection}
                  value={formData.level ? [formData.level] : []}
                  onValueChange={(e) => handleChange('level', e.value[0])}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder='Select level' />
                  </SelectTrigger>
                  <SelectContent>
                    {levelCollection.items.map((item) => (
                      <SelectItem key={item.value} item={item}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </Field.Root>

              <Field.Root required>
                <Field.Label>Trip Type</Field.Label>
                <SelectRoot
                  collection={tripTypeCollection}
                  value={formData.tripType ? [formData.tripType] : []}
                  onValueChange={(e) => handleChange('tripType', e.value[0])}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder='Select type' />
                  </SelectTrigger>
                  <SelectContent>
                    {tripTypeCollection.items.map((item) => (
                      <SelectItem key={item.value} item={item}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </Field.Root>

              <Field.Root required>
                <Field.Label>Status</Field.Label>
                <SelectRoot
                  collection={statusCollection}
                  value={formData.status ? [formData.status] : []}
                  onValueChange={(e) => handleChange('status', e.value[0])}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    {statusCollection.items.map((item) => (
                      <SelectItem key={item.value} item={item}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </Field.Root>
            </SimpleGrid>

            <SimpleGrid columns={4} gap={4}>
              <Field.Root required>
                <Field.Label>Days</Field.Label>
                <Input
                  type='number'
                  value={formData.days}
                  onChange={(e) => handleChange('days', Number(e.target.value))}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Safety Score</Field.Label>
                <Input
                  type='number'
                  value={formData.safetyScore}
                  onChange={(e) =>
                    handleChange('safetyScore', Number(e.target.value))
                  }
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Rating (0-5)</Field.Label>
                <Input
                  type='number'
                  min='0'
                  max='5'
                  step='0.1'
                  value={formData.rating}
                  onChange={(e) => handleChange('rating', e.target.value)}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Date</Field.Label>
                <Input
                  type='date'
                  value={typeof formData.date === 'string' ? formData.date : ''}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
              </Field.Root>
            </SimpleGrid>

            <Field.Root>
              <Field.Label>Certification Required</Field.Label>
              <Input
                value={formData.certification}
                onChange={(e) => handleChange('certification', e.target.value)}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Gear List</Field.Label>
              <Textarea
                value={formData.gear}
                onChange={(e) => handleChange('gear', e.target.value)}
                rows={3}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>Safety Tips</Field.Label>
              <Textarea
                value={formData.safetyTips}
                onChange={(e) => handleChange('safetyTips', e.target.value)}
                rows={4}
              />
            </Field.Root>
            <Field.Root required>
              <Field.Label>Inclusions</Field.Label>
              <Textarea
                value={formData.inclusions}
                onChange={(e) => handleChange('inclusions', e.target.value)}
                rows={4}
              />
            </Field.Root>
            <Field.Root required>
              <Field.Label>Exclusions</Field.Label>
              <Textarea
                value={formData.exclusions}
                onChange={(e) => handleChange('exclusions', e.target.value)}
                rows={4}
              />
            </Field.Root>
            <Field.Root required>
              <Field.Label>Partner</Field.Label>
              <Textarea
                value={formData.partnerDescription}
                onChange={(e) =>
                  handleChange('partnerDescription', e.target.value)
                }
                rows={4}
              />
            </Field.Root>

            <HStack gap={4} pt={4}>
              <Button variant='outline' onClick={() => router.back()} flex={1}>
                Cancel
              </Button>
              <Button
                type='submit'
                bg='primary'
                color='white'
                loading={isUpdating}
                flex={1}
              >
                <FiSave style={{ marginRight: '8px' }} /> Update Adventure
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>

      <SimpleGrid columns={2} gap={4} mt={6}>
        <Button
          variant='surface'
          colorPalette='gray'
          onClick={() => router.push(`/admin/adventures/${id}/itinerary`)}
        >
          <FiList style={{ marginRight: '8px' }} /> Manage Itineraries
        </Button>
        <Button
          variant='surface'
          colorPalette='gray'
          onClick={() => router.push(`/admin/adventures/${id}/gallery`)}
        >
          <FiImage style={{ marginRight: '8px' }} /> Manage Gallery
        </Button>
      </SimpleGrid>
    </Container>
  );
}
