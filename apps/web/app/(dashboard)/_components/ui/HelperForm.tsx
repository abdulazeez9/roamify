'use client';

import React, { useState } from 'react';
import {
  Stack,
  Button,
  Box,
  Heading,
  VStack,
  Text,
  SimpleGrid,
  HStack,
  Flex,
} from '@chakra-ui/react';
import { LuSend, LuMail, LuPhone, LuMapPin } from 'react-icons/lu';
import { useCreateInquiry } from '@/hooks';
import { CreateGeneralInquiryDto } from '@zagotours/types';
import { FormInput } from '@/components/ui/input/FormInput';

export default function HelperForm() {
  const enquiry = useCreateInquiry();

  const [values, setValues] = useState<CreateGeneralInquiryDto>({
    email: '',
    phone: '',
    address: '',
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
          address: '',
          message: '',
        });
      },
    });
  };

  return (
    <>
      <Box textAlign='center'>
        <Flex justify='center' align='center' gap={3}>
          <Text fontSize='md' color='primary' fontWeight='bold'>
            Contact Information
          </Text>
          <LuSend style={{ marginRight: '10px' }} />
        </Flex>
        <Heading
          size={{ base: 'md', md: '3xl' }}
          fontWeight='bold'
          color='primary'
          mb={2}
        >
          Can't find what you <br /> looking for?
        </Heading>
      </Box>
      <Box
        as='form'
        onSubmit={handleSubmit}
        w='full'
        maxW={{ base: '100%', md: '530px' }}
        mx='auto'
        mb={6}
        px={{ base: 4, md: 6 }}
        py={7}
        bg='surface'
        borderRadius='3xl'
        my={9}
      >
        <VStack spaceY={3} align='stretch'>
          <Stack spaceY={3}>
            {/* Email and Phone side-by-side */}
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
              <Box position='relative'>
                <HStack mb={2} color='primary'>
                  <Text fontSize='md' fontWeight='medium' lineClamp={3}>
                    Your Email
                  </Text>
                  <LuMail size={18} color='primary' />
                </HStack>
                <FormInput
                  label=''
                  name='email'
                  type='email'
                  placeholder='example@mail.com'
                  value={values.email}
                  onChange={handleChange}
                  required
                />
              </Box>

              <Box position='relative'>
                <HStack mb={2} color='primary'>
                  <Text fontSize='md' fontWeight='medium' lineClamp={3}>
                    Your Phone
                  </Text>
                  <LuPhone size={18} color='primary' />
                </HStack>
                <FormInput
                  label=''
                  name='phone'
                  type='tel'
                  placeholder='+234...'
                  value={values.phone}
                  onChange={handleChange}
                />
              </Box>
            </SimpleGrid>

            {/* Address below Email/Phone */}
            <Box position='relative'>
              <HStack mb={2} color='primary'>
                <Text fontSize='md' fontWeight='medium' lineClamp={3}>
                  Your Address
                </Text>
                <LuMapPin color='primary' size={18} />
              </HStack>
              <FormInput
                label=''
                name='address'
                type='text'
                placeholder='Street, City, Country'
                value={values.address}
                onChange={handleChange}
              />
            </Box>

            {/* Message at the bottom */}
            <Box position='relative'>
              <HStack mb={2} color='primary'>
                <Text fontSize='md' fontWeight='medium' lineClamp={3}>
                  Message
                </Text>
              </HStack>
              <FormInput
                isTextArea
                label=''
                name='message'
                placeholder='Tell us about your travel plans...'
                value={values.message}
                onChange={handleChange}
                required
                rows={5}
              />
            </Box>
          </Stack>

          <Button
            type='submit'
            bg='primary'
            color='white'
            size='xl'
            width='full'
            loading={enquiry.isPending}
            borderRadius='2xl'
            fontSize='md'
            _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
            transition='all 0.2s'
          >
            Send Message
          </Button>
        </VStack>
      </Box>
    </>
  );
}
