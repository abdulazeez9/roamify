'use client';
import React from 'react';
import {
  Container,
  Heading,
  Text,
  VStack,
  Box,
  Separator,
  Link,
  List,
} from '@chakra-ui/react';

const PrivacyPolicy = () => {
  return (
    <Container maxW='3xl' py={12} px={6}>
      <VStack gap={8} align='stretch'>
        {/* Header Section */}
        <Box>
          <Heading as='h1' size='xl' mb={2}>
            Privacy & Data Policy
          </Heading>
          <Text fontWeight='bold' color='gray.600'>
            Roamify Adventures Ltd (UK Registered)
          </Text>
          <Text fontSize='sm' color='gray.500'>
            Effective Date: March 03, 2026
          </Text>
        </Box>

        <Box>
          <Heading as='h2' size='md' mb={3}>
            Our Commitment
          </Heading>
          <Text color='gray.700' lineHeight='tall'>
            At Roamify, we believe your data is as personal as your travel
            journey. This policy outlines how we handle, protect, and utilize
            your information to provide safe, vetted adventure experiences
            globally.
          </Text>
        </Box>

        <Separator />

        {/* 1. Data Controller */}
        <Box>
          <Heading
            as='h3'
            size='sm'
            mb={2}
            textTransform='uppercase'
            letterSpacing='wide'
          >
            1. Data Controller
          </Heading>
          <Text color='gray.700'>
            Roamify Adventures Ltd, registered in the United Kingdom, is the
            primary controller of your personal data. Managed by Abdulazeez
            Muritador.
          </Text>
          <Text mt={1}>
            Legal Inquiries:{' '}
            <Link color='blue.600' href='mailto:hello@roamify.com'>
              hello@roamify.com
            </Link>
          </Text>
        </Box>

        {/* 2. Information We Collect */}
        <Box>
          <Heading
            as='h3'
            size='sm'
            mb={2}
            textTransform='uppercase'
            letterSpacing='wide'
          >
            2. Data Collection Points
          </Heading>
          <List.Root gap={1} pl={4} color='gray.700'>
            <List.Item>Personal identity and contact verification</List.Item>
            <List.Item>Adventure preferences and travel history</List.Item>
            <List.Item>
              Secure transaction data (via encrypted third-party processors)
            </List.Item>
            <List.Item>
              Safety-critical medical and fitness disclosures
            </List.Item>
            <List.Item>
              User-generated content (reviews, photos, and community posts)
            </List.Item>
            <List.Item>
              Technical logs and cookie-based site analytics
            </List.Item>
          </List.Root>
        </Box>

        {/* 3. Purpose of Processing */}
        <Box>
          <Heading
            as='h3'
            size='sm'
            mb={2}
            textTransform='uppercase'
            letterSpacing='wide'
          >
            3. How We Use Your Data
          </Heading>
          <List.Root gap={1} pl={4} color='gray.700'>
            <List.Item>Fulfilling and managing trip bookings</List.Item>
            <List.Item>Real-time safety alerts and itinerary updates</List.Item>
            <List.Item>Improving the Roamify platform experience</List.Item>
            <List.Item>
              Community engagement and personalized marketing
            </List.Item>
            <List.Item>
              Compliance with international travel regulations
            </List.Item>
          </List.Root>
        </Box>

        {/* 4. Trusted Partners */}
        <Box>
          <Heading
            as='h3'
            size='sm'
            mb={2}
            textTransform='uppercase'
            letterSpacing='wide'
          >
            4. Data Sharing
          </Heading>
          <Text color='gray.700' mb={2}>
            We only share data with vetted partners necessary for your trip:
          </Text>
          <List.Root gap={1} pl={4} color='gray.700'>
            <List.Item>Verified local tour operators and guides</List.Item>
            <List.Item>Secure payment gateways</List.Item>
            <List.Item>Essential platform infrastructure providers</List.Item>
          </List.Root>
        </Box>

        {/* 7. Your Rights */}
        <Box>
          <Heading
            as='h3'
            size='sm'
            mb={2}
            textTransform='uppercase'
            letterSpacing='wide'
          >
            5. Your Global Rights
          </Heading>
          <Text color='gray.700' mb={2}>
            You hold the right to access, rectify, or delete your data at any
            time. For data portability or consent withdrawal, contact our
            privacy team.
          </Text>
          <Text>
            Support:{' '}
            <Link color='blue.600' href='mailto:hello@roamify.com'>
              hello@roamify.com
            </Link>
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default PrivacyPolicy;
