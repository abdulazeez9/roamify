'use client';

import { useCreateAdventure } from '@/hooks';
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
  SimpleGrid,
  Field,
  createListCollection,
  Image,
  IconButton,
} from '@chakra-ui/react';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@chakra-ui/react/select';
import {
  AdventureLevel,
  AdventureLevelLabels,
  TripType,
  TripTypeLabels,
} from '@zagotours/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiChevronLeft, FiUpload, FiX } from 'react-icons/fi';

const INITIAL_ADVENTURE = {
  title: '',
  description: '',
  location: '',
  price: 100,
  level: AdventureLevel.MEDIUM,
  tripType: TripType.HIKING,
  days: 7,
  safetyScore: 85,
  safetyTips: '',
  certification: '',
  inclusions: '',
  exclusions: '',
  partnerDescription: '',
  gear: '',
  date: '',
  rating: '0',
  imageFile: null as File | null,
  imagePreview: null as string | null,
};

type AdventureFormData = typeof INITIAL_ADVENTURE;

export default function CreateAdventurePage() {
  const router = useRouter();
  const [adventure, setAdventure] =
    useState<AdventureFormData>(INITIAL_ADVENTURE);
  const { mutate: createAdventure, isPending } = useCreateAdventure();

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

  const handleChange = <K extends keyof AdventureFormData>(
    field: K,
    value: AdventureFormData[K],
  ) => {
    setAdventure((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAdventure((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setAdventure((prev) => ({
      ...prev,
      imageFile: null,
      imagePreview: null,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    // Append all adventure fields
    formData.append('title', adventure.title);
    formData.append('description', adventure.description);
    formData.append('location', adventure.location);
    formData.append('price', adventure.price.toString());
    formData.append('level', adventure.level);
    formData.append('tripType', adventure.tripType);
    formData.append('days', adventure.days.toString());
    formData.append('safetyScore', adventure.safetyScore.toString());
    formData.append('safetyTips', adventure.safetyTips);

    if (adventure.rating) {
      formData.append('rating', Number(adventure.rating).toString());
    }

    formData.append('date', adventure.date);

    if (adventure.certification) {
      formData.append('certification', adventure.certification);
    }
    if (adventure.gear) {
      formData.append('gear', adventure.gear);
    }

    if (adventure.inclusions) {
      formData.append('inclusions', adventure.inclusions);
    }
    if (adventure.exclusions) {
      formData.append('exclusions', adventure.exclusions);
    }
    if (adventure.partnerDescription) {
      formData.append('partnerDescription', adventure.partnerDescription);
    }

    // Append image if exists
    if (adventure.imageFile) {
      formData.append('media', adventure.imageFile);
    }

    createAdventure(formData as any);
  };

  return (
    <Container maxW='container.lg' py={8}>
      <VStack align='start' gap={1} mb={8}>
        <Button variant='ghost' size='sm' onClick={() => router.back()}>
          <FiChevronLeft style={{ marginRight: '8px' }} /> Back
        </Button>
        <Heading size='xl'>Create New Adventure</Heading>
        <Text color='fg.muted'>
          Fill in the details to create a new adventure trip
        </Text>
      </VStack>

      <form onSubmit={handleSubmit}>
        <Box p={6} bg='bg.panel' shadow='md' rounded='lg' borderWidth='1px'>
          <VStack gap={4} align='stretch'>
            {/* Image Upload Section */}
            <Field.Root>
              <Field.Label>Adventure Image</Field.Label>
              {adventure.imagePreview ? (
                <Box position='relative' maxW='300px'>
                  <Image
                    src={adventure.imagePreview}
                    alt='Preview'
                    rounded='md'
                    objectFit='cover'
                    h='200px'
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
                </Box>
              ) : (
                <Box
                  border='2px dashed'
                  borderColor='border.emphasized'
                  rounded='md'
                  p={6}
                  textAlign='center'
                  cursor='pointer'
                  _hover={{ bg: 'bg.muted' }}
                  onClick={() =>
                    document.getElementById('image-upload')?.click()
                  }
                >
                  <FiUpload size={32} style={{ margin: '0 auto 8px' }} />
                  <Text fontSize='sm' color='fg.muted'>
                    Click to upload adventure image
                  </Text>
                  <Input
                    id='image-upload'
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
                value={adventure.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder='E.g. Everest Base Camp'
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>Description</Field.Label>
              <Textarea
                value={adventure.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder='Describe the adventure details...'
                rows={4}
              />
            </Field.Root>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Field.Root required>
                <Field.Label>Location</Field.Label>
                <Input
                  value={adventure.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder='E.g. Nepal'
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Price ($)</Field.Label>
                <Input
                  type='number'
                  value={adventure.price}
                  onChange={(e) =>
                    handleChange('price', Number(e.target.value))
                  }
                  min='0'
                />
              </Field.Root>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              <Field.Root required>
                <Field.Label>Level</Field.Label>
                <SelectRoot
                  collection={levelCollection}
                  value={[adventure.level]}
                  onValueChange={(e) =>
                    handleChange('level', e.value[0] as AdventureLevel)
                  }
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
                  value={[adventure.tripType]}
                  onValueChange={(e) =>
                    handleChange('tripType', e.value[0] as TripType)
                  }
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
                <Field.Label>Start Date</Field.Label>
                <Input
                  type='date'
                  value={adventure.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
              </Field.Root>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              <Field.Root required>
                <Field.Label>Days</Field.Label>
                <Input
                  type='number'
                  value={adventure.days}
                  onChange={(e) => handleChange('days', Number(e.target.value))}
                  min='1'
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Safety Score (0-100)</Field.Label>
                <Input
                  type='number'
                  min='0'
                  max='100'
                  value={adventure.safetyScore}
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
                  value={adventure.rating}
                  onChange={(e) => handleChange('rating', e.target.value)}
                />
              </Field.Root>
            </SimpleGrid>

            <Field.Root>
              <Field.Label>Certification Required</Field.Label>
              <Input
                value={adventure.certification}
                onChange={(e) => handleChange('certification', e.target.value)}
                placeholder='E.g. Advanced Scuba Diving'
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Gear List</Field.Label>
              <Textarea
                value={adventure.gear}
                onChange={(e) => handleChange('gear', e.target.value)}
                placeholder='List required gear...'
                rows={3}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>Safety Tips</Field.Label>
              <Textarea
                value={adventure.safetyTips}
                onChange={(e) => handleChange('safetyTips', e.target.value)}
                placeholder='Enter safety tips...'
                rows={4}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>Inclusions</Field.Label>
              <Textarea
                value={adventure.inclusions}
                onChange={(e) => handleChange('inclusions', e.target.value)}
                placeholder='What includes...'
                rows={4}
              />
            </Field.Root>
            <Field.Root required>
              <Field.Label>Exclusions</Field.Label>
              <Textarea
                value={adventure.exclusions}
                onChange={(e) => handleChange('exclusions', e.target.value)}
                placeholder='What excludes...'
                rows={4}
              />
            </Field.Root>
            <Field.Root required>
              <Field.Label>Partner</Field.Label>
              <Textarea
                value={adventure.partnerDescription}
                onChange={(e) =>
                  handleChange('partnerDescription', e.target.value)
                }
                placeholder='Enter partner details...'
                rows={4}
              />
            </Field.Root>
          </VStack>
        </Box>

        <HStack gap={4} justify='flex-end' mt={6}>
          <Button
            variant='outline'
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            bg='primary'
            color='white'
            size='lg'
            loading={isPending}
            minW='200px'
          >
            Create Adventure
          </Button>
        </HStack>
      </form>
    </Container>
  );
}
