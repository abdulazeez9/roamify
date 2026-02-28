'use client';

import { useParams, useRouter } from 'next/navigation';
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
  Image,
  IconButton,
  Text,
  Checkbox,
  HStack,
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { FiUploadCloud, FiX, FiCalendar, FiClock } from 'react-icons/fi';
import { useEvent, useUpdateEvent } from '@/hooks';
import { LoadingState } from '@/components/ui/LoadingState';
import { EventPricing } from '@zagotours/types';
import { SelectInput } from '@/components/ui/input/SelectInput';

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: response, isLoading } = useEvent(id);
  const { mutate: updateEvent, isPending } = useUpdateEvent();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState<any>(null);

  const formatTimeFromDate = (dateValue: string) => {
    if (!dateValue) return '';
    const d = new Date(dateValue);
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatToDateOnly = (dateValue: string) => {
    if (!dateValue) return '';
    return new Date(dateValue).toISOString().split('T')[0];
  };

  useEffect(() => {
    if (response?.data) {
      const event = response.data;

      setFormData({
        title: event.title,
        description: event.description,
        location: event.location,
        spotLeft: event.spotLeft,
        isSignature: event.isSignature,
        cancellationTerms: event.cancellationTerms || '',
        date: formatToDateOnly(event.date),
        time: formatTimeFromDate(event.date) || '',
        joinTill: formatToDateOnly(event.joinTill),
        pricing: event.pricing || EventPricing.FREE,
      });

      if (event.mediaUrl) {
        setPreviewUrl(event.mediaUrl);
      }
    }
  }, [response]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('location', formData.location);
    submitData.append('spotLeft', formData.spotLeft.toString());
    submitData.append('isSignature', formData.isSignature.toString());
    submitData.append('cancellationTerms', formData.cancellationTerms);
    submitData.append('pricing', formData.pricing);

    if (formData.date && formData.time) {
      const [hours, minutes] = formData.time.split(':').map(Number);
      const combinedDate = new Date(formData.date);
      combinedDate.setUTCHours(hours, minutes, 0, 0);
      submitData.append('date', combinedDate.toISOString());
    }
    if (formData.joinTill) {
      submitData.append('joinTill', new Date(formData.joinTill).toISOString());
    }

    if (selectedFile) {
      submitData.append('media', selectedFile);
    }

    updateEvent(
      { id, data: submitData },
      {
        onSuccess: () => {
          router.push('/admin/events');
          router.refresh();
        },
      },
    );
  };

  const handleImageUpload = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  if (isLoading || !formData) return <LoadingState />;

  return (
    <Container maxW='container.md' py={8}>
      <Heading mb={6}>Edit Event</Heading>
      <form onSubmit={handleSubmit}>
        <VStack gap={6} align='stretch'>
          {/* Image Section */}
          <Box
            border='2px dashed'
            borderColor='border.muted'
            p={6}
            textAlign='center'
            rounded='lg'
            onClick={handleImageUpload}
            cursor='pointer'
          >
            <input
              ref={fileInputRef}
              type='file'
              hidden
              onChange={handleFileChange}
              accept='image/*'
            />
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
                  colorPalette='red'
                  position='absolute'
                  top={2}
                  right={2}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewUrl('');
                    setSelectedFile(null);
                  }}
                >
                  <FiX />
                </IconButton>
              </Box>
            ) : (
              <Text>Click to change banner</Text>
            )}
          </Box>

          <Field.Root required>
            <Field.Label>Event Title</Field.Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </Field.Root>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            {/* DATE INPUT */}
            <Field.Root required>
              <Field.Label>Event Date</Field.Label>
              <HStack>
                <FiCalendar />
                <Input
                  type='date'
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </HStack>
            </Field.Root>

            {/* TIME INPUT */}
            <Field.Root required>
              <Field.Label>Start Time</Field.Label>
              <HStack>
                <FiClock />
                <Input
                  type='time'
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </HStack>
            </Field.Root>
          </SimpleGrid>

          <Field.Root required>
            <Field.Label>Registration Deadline (Date)</Field.Label>
            <Input
              type='date'
              value={formData.joinTill}
              onChange={(e) =>
                setFormData({ ...formData, joinTill: e.target.value })
              }
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>Available Spots</Field.Label>
            <Input
              type='number'
              value={formData.spotLeft}
              onChange={(e) =>
                setFormData({ ...formData, spotLeft: parseInt(e.target.value) })
              }
            />
          </Field.Root>

          {/* ADD THIS */}
          <Field.Root required>
            <Field.Label>Pricing</Field.Label>
            <SelectInput
              value={formData.pricing}
              onChange={(val) =>
                setFormData({ ...formData, pricing: val as EventPricing })
              }
              options={[
                { label: 'Free', value: EventPricing.FREE },
                { label: 'Paid', value: EventPricing.PAID },
              ]}
              placeholder='Select pricing type'
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Description</Field.Label>
            <Textarea
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </Field.Root>

          <Checkbox.Root
            checked={formData.isSignature}
            onCheckedChange={(e) =>
              setFormData({ ...formData, isSignature: !!e.checked })
            }
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Mark as Signature Event</Checkbox.Label>
          </Checkbox.Root>

          <Button
            type='submit'
            bg='primary'
            color='white'
            size='lg'
            loading={isPending}
          >
            Save Changes
          </Button>
        </VStack>
      </form>
    </Container>
  );
}
