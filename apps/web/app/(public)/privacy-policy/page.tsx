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
            Privacy Policy
          </Heading>
          <Text fontWeight='bold' color='gray.600'>
            Zago Tours Ltd (UK Registered)
          </Text>
          <Text fontSize='sm' color='gray.500'>
            Effective Date: 01/01/2026
          </Text>
        </Box>

        <Box>
          <Heading as='h2' size='md' mb={3}>
            Preamble
          </Heading>
          <Text color='gray.700' lineHeight='tall'>
            This document explains how Zago Tours collects, uses, and protects
            your personal data. We are committed to keeping your information
            safe while providing adventure travel services worldwide.
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
            Zago Tours Ltd, United Kingdom, is responsible for your personal
            data.
          </Text>
          <Text mt={1}>
            Contact:{' '}
            <Link color='blue.600' href='mailto:partnerships@zagotours.com'>
              partnerships@zagotours.com
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
            2. Information We Collect
          </Heading>
          <List.Root gap={1} pl={4} color='gray.700'>
            <List.Item>Contact and identity details</List.Item>
            <List.Item>Travel preferences and itinerary requests</List.Item>
            <List.Item>
              Payment information via secure third-party processors
            </List.Item>
            <List.Item>
              Health, fitness, and medical information for safety purposes
            </List.Item>
            <List.Item>Photos and videos shared during trips</List.Item>
            <List.Item>Website usage and cookies</List.Item>
          </List.Root>
        </Box>

        {/* 3. How We Use Your Data */}
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
            <List.Item>To provide and manage bookings</List.Item>
            <List.Item>
              To communicate trip details and safety instructions
            </List.Item>
            <List.Item>To improve our services</List.Item>
            <List.Item>For marketing communications (with consent)</List.Item>
            <List.Item>To comply with legal obligations</List.Item>
          </List.Root>
        </Box>

        {/* 4. Data Sharing */}
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
          <List.Root gap={1} pl={4} color='gray.700'>
            <List.Item>
              Verified adventure suppliers for trip delivery
            </List.Item>
            <List.Item>Payment processors</List.Item>
            <List.Item>Platform service providers</List.Item>
          </List.Root>
        </Box>

        {/* 5. Legal Basis */}
        <Box>
          <Heading
            as='h3'
            size='sm'
            mb={2}
            textTransform='uppercase'
            letterSpacing='wide'
          >
            5. Legal Basis
          </Heading>
          <List.Root gap={1} pl={4} color='gray.700'>
            <List.Item>Performance of contract</List.Item>
            <List.Item>
              Legitimate interest (safety, platform improvements)
            </List.Item>
            <List.Item>Consent (marketing communications)</List.Item>
          </List.Root>
        </Box>

        {/* 6. Data Retention */}
        <Box>
          <Heading
            as='h3'
            size='sm'
            mb={2}
            textTransform='uppercase'
            letterSpacing='wide'
          >
            6. Data Retention
          </Heading>
          <Text color='gray.700'>
            Kept only as long as necessary or legally required.
          </Text>
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
            7. Your Rights
          </Heading>
          <Text color='gray.700' mb={2}>
            Access, correction, deletion, portability, objection, and
            withdrawing consent.
          </Text>
          <Text>
            Contact:{' '}
            <Link color='blue.600' href='mailto:partnerships@zagotours.com'>
              partnerships@zagotours.com
            </Link>
          </Text>
        </Box>

        {/* 8. Security & International Transfers */}
        <Box>
          <Heading
            as='h3'
            size='sm'
            mb={2}
            textTransform='uppercase'
            letterSpacing='wide'
          >
            8. Security & International Transfers
          </Heading>
          <Text color='gray.700'>
            We maintain safeguards and may transfer data internationally with
            appropriate protections.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default PrivacyPolicy;
