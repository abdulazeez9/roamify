'use client';
import { Box, Heading, Text } from '@chakra-ui/react';
import GeneralEnquiryForm from '../ui/form/GeneralEnquiryForm';

export default function FormSection() {
  return (
    <Box textAlign='center'>
      <Text color='primary' fontSize='md'>
        CONTACT INFORMATION
      </Text>
      <Heading
        size={{ base: '2xl', md: '4xl' }}
        lineHeight='1.2'
        color='primary'
        mb={6}
      >
        Can't find what <br /> you looking for?
      </Heading>

      <GeneralEnquiryForm />
    </Box>
  );
}
