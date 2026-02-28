'use client';

import { Text, Button, VStack, Heading, Icon, HStack } from '@chakra-ui/react';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <VStack gap={2} textAlign='center' width='100%' py={10}>
      {/* Error Code */}
      <Text fontSize='8xl' fontWeight='600' color='gray.300' lineHeight='1'>
        404
      </Text>

      {/* Content */}
      <VStack gap={3}>
        <Heading as='h1' size='xl' fontWeight='600' color='gray.800'>
          Page Not Found
        </Heading>

        <Text fontSize='md' color='gray.600' maxW='sm'>
          The page you're looking for doesn't exist or has been moved.
        </Text>
      </VStack>

      {/* Actions */}
      <HStack gap={3} pt={4}>
        <Button bg='primary' size='md' onClick={() => router.push('/')}>
          <Icon as={FiHome} mr={2} />
          Homepage
        </Button>

        <Button variant='outline' size='md' onClick={() => router.back()}>
          <Icon as={FiArrowLeft} mr={2} />
          Go Back
        </Button>
      </HStack>

      {/* Additional Help */}
      <Text fontSize='sm' color='gray.500' pt={2}>
        Need help?{' '}
        <Text
          as='span'
          color='primary'
          cursor='pointer'
          _hover={{ textDecoration: 'underline' }}
          onClick={() => router.push('#')}
        >
          Contact Support
        </Text>
      </Text>
    </VStack>
  );
}
