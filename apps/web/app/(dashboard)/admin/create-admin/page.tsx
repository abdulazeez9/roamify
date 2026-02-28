'use client';

import React from 'react';
import {
  Box,
  Card,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Stack,
  Heading,
  Field,
} from '@chakra-ui/react';
import { UserPlus, Mail, User, Phone, Globe, Lock } from 'lucide-react';
import { useAuth } from '@/hooks';
import { toaster } from '@/components/ui/toaster';
import { Role } from '@zagotours/types';

export default function CreateAdmin() {
  const { registerAdmin, isRegisteringAdmin } = useAuth();

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    country: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toaster.create({
        title: 'Validation Error',
        description: 'Name, email, and password are required',
        type: 'error',
      });
      return;
    }
    registerAdmin({
      ...formData,
      role: Role.ADMIN,
    });
  };

  return (
    <Box p={6}>
      <VStack align='stretch' gap={6} maxW='2xl' mx='auto'>
        {/* Header */}
        <HStack gap={3}>
          <UserPlus size={28} />
          <Heading size='xl'>Create Admin Account</Heading>
        </HStack>

        {/* Form Card */}
        <Card.Root>
          <Card.Body>
            <form onSubmit={handleSubmit}>
              <Stack gap={5}>
                {/* Name */}
                <Field.Root required>
                  <Field.Label>Full Name</Field.Label>
                  <HStack>
                    <User size={18} />
                    <Input
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder='Enter admin name'
                      flex='1'
                    />
                  </HStack>
                </Field.Root>

                {/* Email */}
                <Field.Root required>
                  <Field.Label>Email Address</Field.Label>
                  <HStack>
                    <Mail size={18} />
                    <Input
                      type='email'
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder='admin@example.com'
                      flex='1'
                    />
                  </HStack>
                </Field.Root>

                {/* Password */}
                <Field.Root required>
                  <Field.Label>Password</Field.Label>
                  <HStack>
                    <Lock size={18} />
                    <Input
                      type='password'
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder='Enter secure password'
                      flex='1'
                    />
                  </HStack>
                  <Field.HelperText>
                    Password must be at least 8 characters
                  </Field.HelperText>
                </Field.Root>

                {/* Phone (Optional) */}
                <Field.Root>
                  <Field.Label>Phone Number (Optional)</Field.Label>
                  <HStack>
                    <Phone size={18} />
                    <Input
                      type='tel'
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder='+1234567890'
                      flex='1'
                    />
                  </HStack>
                </Field.Root>

                {/* Country (Optional) */}
                <Field.Root>
                  <Field.Label>Country (Optional)</Field.Label>
                  <HStack>
                    <Globe size={18} />
                    <Input
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      placeholder='Enter country'
                      flex='1'
                    />
                  </HStack>
                </Field.Root>

                {/* Submit Button */}
                <Button
                  type='submit'
                  bg='primary'
                  color='white'
                  size='lg'
                  loading={isRegisteringAdmin}
                  width='full'
                  mt={4}
                >
                  <UserPlus size={18} />
                  Create Admin Account
                </Button>
              </Stack>
            </form>
          </Card.Body>
        </Card.Root>

        {/* Info Box */}
        <Box
          p={4}
          bg='blue.50'
          borderRadius='md'
          borderWidth='1px'
          borderColor='blue.200'
        >
          <Text fontSize='sm' color='blue.800'>
            ℹ️ The admin will receive a welcome email with their account
            details. They can log in immediately using the credentials you've
            set.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
