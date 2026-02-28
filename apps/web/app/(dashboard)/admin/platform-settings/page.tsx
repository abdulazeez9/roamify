'use client';
import Button from '@/components/ui/button/Button';
import {
  useCreatePlatformSettings,
  usePlatformSettings,
  useUpdatePlatformSettings,
} from '@/hooks';
import {
  Box,
  Container,
  Field,
  Flex,
  Heading,
  Image,
  Input,
  Skeleton,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';

type Mode = 'view' | 'edit' | 'create';

export default function PlatformSettingsPage() {
  const { data: response, isLoading } = usePlatformSettings();
  const settings = response?.data;

  const { mutate: create, isPending: isCreating } = useCreatePlatformSettings();
  const { mutate: update, isPending: isUpdating } = useUpdatePlatformSettings();
  const isPending = isCreating || isUpdating;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('view');
  const [form, setForm] = useState({
    siteName: '',
    description: '',
    contactEmail: '',
  });

  const openForm = () => {
    setForm({
      siteName: settings?.siteName || '',
      description: settings?.description || '',
      contactEmail: settings?.contactEmail || '',
    });
    setPreview(null);
    setMode(settings ? 'edit' : 'create');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    const data = new FormData();
    data.append('siteName', form.siteName);
    data.append('description', form.description);
    data.append('contactEmail', form.contactEmail);

    const file = fileInputRef.current?.files?.[0];
    if (file) data.append('media', file);

    const action = settings ? update : create;
    action(data, { onSuccess: () => setMode('view') });
  };

  const isFormMode = mode === 'edit' || mode === 'create';

  return (
    <Container maxW='3xl' py={8}>
      <Flex justify='space-between' align='center' mb={6}>
        <Heading size='md'>Platform Settings</Heading>
        {!isFormMode && (
          <Button bg='primary' color='white' size='sm' onClick={openForm}>
            {settings ? 'Edit Settings' : 'Create Settings'}
          </Button>
        )}
      </Flex>

      {/* ── Loading ── */}
      {isLoading && (
        <Stack gap={4}>
          <Skeleton height='200px' rounded='md' />
          <Skeleton height='24px' w='60%' />
          <Skeleton height='16px' />
          <Skeleton height='16px' w='80%' />
        </Stack>
      )}

      {/* ── View mode ── */}
      {!isLoading && !isFormMode && (
        <>
          {settings ? (
            <Box borderWidth='1px' rounded='lg' overflow='hidden'>
              {settings.coverImage && (
                <Image
                  src={settings.coverImage}
                  alt='Cover'
                  w='full'
                  h='200px'
                  objectFit='cover'
                />
              )}
              <Box p={6}>
                <Heading size='md' mb={1}>
                  {settings.siteName}
                </Heading>
                {settings.contactEmail && (
                  <Text fontSize='sm' color='gray.500' mb={3}>
                    {settings.contactEmail}
                  </Text>
                )}
                {settings.description && (
                  <Text color='gray.600'>{settings.description}</Text>
                )}
              </Box>
            </Box>
          ) : (
            <Box textAlign='center' py={16} borderWidth='1px' rounded='lg'>
              <Text color='gray.500' mb={4}>
                No platform settings configured yet.
              </Text>
              <Button bg='primary' color='white' onClick={openForm}>
                Get Started
              </Button>
            </Box>
          )}
        </>
      )}

      {/* ── Form mode (edit / create) ── */}
      {isFormMode && (
        <Box borderWidth='1px' rounded='lg' p={6}>
          <Stack gap={5}>
            <Field.Root required>
              <Field.Label>
                Site Name
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={form.siteName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, siteName: e.target.value }))
                }
                placeholder='e.g. Zagotours'
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Contact Email</Field.Label>
              <Input
                type='email'
                value={form.contactEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contactEmail: e.target.value }))
                }
                placeholder='hello@zagotours.com'
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Description</Field.Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder='A short description of your platform...'
                rows={3}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Cover Image</Field.Label>
              <Input
                type='file'
                accept='image/*'
                ref={fileInputRef}
                onChange={handleFileChange}
                p={1}
              />
              {(preview || settings?.coverImage) && (
                <Image
                  src={preview || settings?.coverImage}
                  alt='Preview'
                  mt={3}
                  h='140px'
                  w='full'
                  objectFit='cover'
                  rounded='md'
                />
              )}
            </Field.Root>

            <Flex justify='flex-end' gap={3} pt={2}>
              <Button variant='ghost' onClick={() => setMode('view')}>
                Cancel
              </Button>
              <Button
                bg='primary'
                color='white'
                loading={isPending}
                onClick={handleSubmit}
              >
                {mode === 'edit' ? 'Save Changes' : 'Create'}
              </Button>
            </Flex>
          </Stack>
        </Box>
      )}
    </Container>
  );
}
