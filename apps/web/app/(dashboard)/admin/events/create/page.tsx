'use client';

import {
  Container,
  Heading,
  VStack,
  Input,
  Button,
  Textarea,
  SimpleGrid,
  Field,
  Box,
  Text,
  Image,
  IconButton,
  Checkbox,
  HStack,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiUploadCloud, FiX, FiCalendar, FiClock } from 'react-icons/fi';
import { useCreateEvent } from '@/hooks';
import { EventPricing } from '@zagotours/types';
import { SelectInput } from '@/components/ui/input/SelectInput';

export default function CreateEventPage() {
  const router = useRouter();
  const { mutate: createEvent, isPending } = useCreateEvent();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    joinTill: '',
    pricing: EventPricing.FREE,
    spotLeft: 20,
    isSignature: false,
    cancellationTerms: '',
  });

  const handleImageUpload = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Basic Validation
    if (
      !form.title ||
      !form.date ||
      !form.time ||
      !form.joinTill ||
      !form.description
    ) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();

    // 2. Append standard text fields
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('location', form.location);
    formData.append('pricing', form.pricing);
    formData.append('cancellationTerms', form.cancellationTerms || '');

    formData.append('spotLeft', form.spotLeft.toString());
    formData.append('isSignature', String(form.isSignature));

    // 5. Time and Dates
    const [hours, minutes] = form.time.split(':').map(Number);
    const combinedDate = new Date(form.date);
    if (hours !== undefined && minutes !== undefined) {
      combinedDate.setUTCHours(hours, minutes, 0, 0);
    }
    formData.append('date', combinedDate.toISOString());

    formData.append('joinTill', new Date(form.joinTill).toISOString());

    if (selectedFile) {
      formData.append('media', selectedFile);
    }

    createEvent(formData, {
      onSuccess: () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      },
    });
  };

  return (
    <Container maxW='container.md' py={8}>
      <Heading mb={6}>Create New Event</Heading>
      <form onSubmit={handleSubmit}>
        <VStack gap={6} align='stretch'>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            hidden
            onChange={handleFileChange}
          />

          <Box
            border='2px dashed'
            borderColor='border.muted'
            p={6}
            textAlign='center'
            rounded='lg'
            cursor='pointer'
            onClick={handleImageUpload}
            _hover={{ borderColor: 'cyan.500' }}
          >
            {previewUrl ? (
              <Box position='relative'>
                <Image
                  src={previewUrl}
                  alt='Preview'
                  maxH='200px'
                  mx='auto'
                  rounded='md'
                />
                <IconButton
                  size='xs'
                  position='absolute'
                  top={2}
                  right={2}
                  colorPalette='red'
                  onClick={handleRemoveImage}
                >
                  <FiX />
                </IconButton>
              </Box>
            ) : (
              <VStack gap={1}>
                <FiUploadCloud size={24} />
                <Text>Click to upload event banner</Text>
              </VStack>
            )}
          </Box>

          <Field.Root required>
            <Field.Label>Event Title</Field.Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field.Root>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            {/* DATE */}
            <Field.Root required>
              <Field.Label>Event Date</Field.Label>
              <HStack>
                <FiCalendar />
                <Input
                  type='date'
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </HStack>
            </Field.Root>

            {/* TIME */}
            <Field.Root required>
              <Field.Label>Event Time</Field.Label>
              <HStack>
                <FiClock />
                <Input
                  type='time'
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </HStack>
            </Field.Root>
          </SimpleGrid>

          <Field.Root required>
            <Field.Label>Registration Deadline (Date Only)</Field.Label>
            <Input
              type='date'
              value={form.joinTill}
              onChange={(e) => setForm({ ...form, joinTill: e.target.value })}
            />
          </Field.Root>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Field.Root required>
              <Field.Label>Location</Field.Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>Available Spots</Field.Label>
              <Input
                type='number'
                value={form.spotLeft}
                onChange={(e) =>
                  setForm({ ...form, spotLeft: Number(e.target.value) })
                }
              />
            </Field.Root>
          </SimpleGrid>

          <Field.Root required>
            <Field.Label>Pricing</Field.Label>
            <SelectInput
              value={form.pricing}
              onChange={(val) =>
                setForm({ ...form, pricing: val as EventPricing })
              }
              options={[
                { label: 'Free', value: EventPricing.FREE },
                { label: 'Paid', value: EventPricing.PAID },
              ]}
              placeholder='Select pricing type'
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>Description</Field.Label>
            <Textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Cancellation Terms</Field.Label>
            <Textarea
              rows={3}
              placeholder='Enter terms or leave blank...'
              value={form.cancellationTerms}
              onChange={(e) =>
                setForm({ ...form, cancellationTerms: e.target.value })
              }
            />
          </Field.Root>
          <Checkbox.Root
            checked={form.isSignature}
            onCheckedChange={(e) =>
              setForm({ ...form, isSignature: !!e.checked })
            }
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Mark as Signature Event</Checkbox.Label>
          </Checkbox.Root>

          <Button
            type='submit'
            colorPalette='cyan'
            size='lg'
            loading={isPending}
          >
            Publish Event
          </Button>
        </VStack>
      </form>
    </Container>
  );
}
