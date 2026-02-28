'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
  Avatar,
  Card,
  SimpleGrid,
  Badge,
  Field,
  Image,
} from '@chakra-ui/react';

import {
  LuUser,
  LuMail,
  LuPhone,
  LuGlobe,
  LuSave,
  LuUpload,
  LuX,
} from 'react-icons/lu';
import { useUpdateProfile, useUserProfile } from '@/hooks';
import { LoadingState } from '@/components/ui/LoadingState';

export default function SettingPage() {
  const { data: profileResponse, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userData = profileResponse?.data;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Sync data when fetched
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        country: userData.country || '',
      });
      setImagePreview(userData.image || '');
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(userData?.image || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('country', formData.country);

    if (imageFile) {
      formDataToSend.append('media', imageFile);
    }

    updateProfile.mutate(formDataToSend);
  };

  if (isLoading) return <LoadingState message='Loading profile...' />;

  return (
    <Container maxW='4xl' py={10}>
      <Stack gap={8}>
        {/* Header Section */}
        <Box>
          <Heading size='2xl'>Account Settings</Heading>
          <Text color='fg.muted'>
            Manage your profile information and preferences.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          {/* Left Side: Stats & Preview */}
          <Stack gap={6}>
            <Card.Root>
              <Card.Body py={8}>
                <Flex direction='column' align='center'>
                  <Avatar.Root size='2xl' mb={4}>
                    <Avatar.Fallback name={userData?.name} />
                    <Avatar.Image src={imagePreview} />
                  </Avatar.Root>
                  <Heading size='md'>{userData?.name}</Heading>
                  <Badge variant='subtle' colorPalette='blue' mt={2}>
                    {userData?.role}
                  </Badge>
                  <Text fontSize='sm' color='fg.muted' mt={1}>
                    {userData?.email}
                  </Text>
                </Flex>
              </Card.Body>
            </Card.Root>

            <Card.Root>
              <Card.Header>
                <Heading size='xs'>Quick Stats</Heading>
              </Card.Header>
              <Card.Body gap={3}>
                <HStack justify='space-between'>
                  <Text fontSize='sm'>Referrals</Text>
                  <Text fontWeight='bold'>
                    {userData?.stats?.totalReferrals}
                  </Text>
                </HStack>
                <HStack justify='space-between'>
                  <Text fontSize='sm'>Reviews</Text>
                  <Text fontWeight='bold'>{userData?.stats?.totalReviews}</Text>
                </HStack>
              </Card.Body>
            </Card.Root>
          </Stack>

          {/* Right Side: Edit Form */}
          <Card.Root gridColumn={{ md: 'span 2' }}>
            <Card.Header>
              <Heading size='md'>Profile Information</Heading>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit}>
                <Stack gap={5}>
                  <Field.Root>
                    <Field.Label>Full Name</Field.Label>
                    <HStack w='full'>
                      <Icon as={LuUser} color='fg.muted' />
                      <Input
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='John Doe'
                      />
                    </HStack>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Phone Number</Field.Label>
                    <HStack w='full'>
                      <Icon as={LuPhone} color='fg.muted' />
                      <Input
                        name='phone'
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder='+1 234 567 890'
                      />
                    </HStack>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Country</Field.Label>
                    <HStack w='full'>
                      <Icon as={LuGlobe} color='fg.muted' />
                      <Input
                        name='country'
                        value={formData.country}
                        onChange={handleChange}
                        placeholder='e.g. Nigeria'
                      />
                    </HStack>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Profile Image</Field.Label>
                    <Stack gap={3}>
                      <Input
                        ref={fileInputRef}
                        type='file'
                        accept='image/*'
                        onChange={handleFileChange}
                        display='none'
                        id='image-upload'
                      />

                      {imagePreview && (
                        <Box position='relative' w='fit-content'>
                          <Image
                            src={imagePreview}
                            alt='Preview'
                            borderRadius='md'
                            maxH='200px'
                            objectFit='cover'
                          />
                          {imageFile && (
                            <Button
                              position='absolute'
                              top={2}
                              right={2}
                              size='sm'
                              colorPalette='red'
                              onClick={handleRemoveImage}
                            >
                              <LuX />
                            </Button>
                          )}
                        </Box>
                      )}

                      <Button
                        variant='outline'
                        onClick={() => fileInputRef.current?.click()}
                        w='fit-content'
                      >
                        <LuUpload />
                        {imageFile ? 'Change Image' : 'Upload Image'}
                      </Button>

                      {imageFile && (
                        <Text fontSize='sm' color='fg.muted'>
                          Selected: {imageFile.name} (
                          {(imageFile.size / 1024).toFixed(2)} KB)
                        </Text>
                      )}
                    </Stack>
                    <Field.HelperText>
                      Accepts JPG, PNG, GIF. Max size: 5MB
                    </Field.HelperText>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Email Address</Field.Label>
                    <HStack w='full' opacity={0.6}>
                      <Icon as={LuMail} />
                      <Input
                        value={userData?.email}
                        readOnly
                        variant='subtle'
                      />
                    </HStack>
                    <Field.HelperText>Email cannot be changed</Field.HelperText>
                  </Field.Root>

                  <Flex justify='flex-end' pt={4}>
                    <Button
                      type='submit'
                      bg='primary'
                      color='white'
                      loading={updateProfile.isPending}
                      loadingText='Saving...'
                    >
                      <LuSave /> Save Changes
                    </Button>
                  </Flex>
                </Stack>
              </form>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
