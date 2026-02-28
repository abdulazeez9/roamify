'use client';

import React, { useState } from 'react';
import { Stack, Button, Box, Heading, VStack, Text } from '@chakra-ui/react';
import { LuSend } from 'react-icons/lu';
import { FormInput } from '../input/FormInput';
import { useCreateInquiry } from '@/hooks';

interface EnquiryFormValues {
  email: string;
  phone: string;
  message: string;
}

export default function GeneralEnquiryForm() {
  const enquiry = useCreateInquiry();

  const [values, setValues] = useState<EnquiryFormValues>({
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // basic safety check
    if (!values.email || !values.message) return;

    enquiry.mutate(values, {
      onSuccess: () => {
        setValues({
          email: '',
          phone: '',
          message: '',
        });
      },
    });
  };

  return (
    <Box
      as='form'
      onSubmit={handleSubmit}
      w='full'
      maxW={{ base: '100%', md: '500px' }}
      mx='auto'
      p={{ base: 6, md: 10 }}
      bg='surface'
      borderRadius='3xl'
    >
      <VStack spaceY={8} align='stretch'>
        <Box textAlign='center'>
          <Heading size='lg' color='primary' mb={2}>
            Get in Touch
          </Heading>
          <Text fontSize='sm' color='gray.600'>
            Have questions about an adventure? We're here to help.
          </Text>
        </Box>

        <Stack spaceY={5}>
          <FormInput
            label='Email Address'
            name='email'
            type='email'
            placeholder='example@mail.com'
            value={values.email}
            onChange={handleChange}
            required
            helperText="We'll respond to this email."
          />

          <FormInput
            label='Phone Number'
            name='phone'
            type='tel'
            placeholder='+234...'
            value={values.phone}
            onChange={handleChange}
          />

          <FormInput
            isTextArea
            label='Your Message'
            name='message'
            placeholder='Tell us about your travel plans...'
            value={values.message}
            onChange={handleChange}
            required
            rows={5}
          />
        </Stack>

        <Button
          type='submit'
          bg='secondary'
          color='dark'
          size='xl'
          width='full'
          loading={enquiry.isPending}
          borderRadius='2xl'
          fontSize='md'
          _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
          transition='all 0.2s'
        >
          <LuSend style={{ marginRight: '10px' }} />
          Send Message
        </Button>
      </VStack>
    </Box>
  );
}
