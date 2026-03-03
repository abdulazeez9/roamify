'use client';
import React from 'react';
import {
  Container,
  Heading,
  Text,
  VStack,
  Box,
  Separator,
  List,
  Link,
  Stack,
} from '@chakra-ui/react';

const TermsAndConditions = () => {
  const sectionHeaderProps = {
    as: 'h3' as const,
    size: 'sm' as const,
    mb: 3,
    textTransform: 'uppercase' as const,
    letterSpacing: 'wider',
    color: 'gray.800',
  };
  const bodyTextStyle = {
    color: 'gray.700',
    lineHeight: 'tall',
    fontSize: 'md',
  };

  return (
    <Container maxW='3xl' py={16} px={6}>
      <VStack gap={12} align='stretch'>
        {/* SECTION 1: TERMS & CONDITIONS */}
        <Box>
          <Heading as='h1' size='3xl' mb={2}>
            Service Terms
          </Heading>
          <Text fontWeight='bold' color='gray.600'>
            Roamify Adventures Ltd
          </Text>
          <Text fontSize='sm' color='gray.500' mb={6}>
            Effective Date: March 03, 2026
          </Text>

          <Box
            bg='blue.50'
            p={5}
            borderRadius='md'
            mb={8}
            border='1px solid'
            borderColor='blue.100'
          >
            <Heading
              as='h4'
              size='xs'
              mb={2}
              textTransform='uppercase'
              color='blue.800'
            >
              The Roamify Agreement
            </Heading>
            <Text {...bodyTextStyle} fontSize='sm' color='blue.900'>
              These Terms govern your access to the Roamify ecosystem. By using
              our platform or booking an adventure, you agree to these legal
              standards designed to keep our community safe and vibrant.
            </Text>
          </Box>

          <Stack gap={8}>
            <Box>
              <Heading {...sectionHeaderProps}>1. Our Role</Heading>
              <Text {...bodyTextStyle}>
                Roamify Adventures Ltd (“Roamify”, “we”) acts as a curated
                marketplace connecting independent travelers with verified
                global tour operators. We facilitate the connection; the
                contract for service delivery exists between you and the
                supplier.
              </Text>
            </Box>

            <Box>
              <Heading {...sectionHeaderProps}>
                2. Roamify Secure™ Protocol
              </Heading>
              <List.Root gap={2} {...bodyTextStyle} variant='marker'>
                <List.Item>
                  All trips must adhere to our Roamify Secure™ safety and
                  sustainability standards.
                </List.Item>
                <List.Item>
                  We reserve the right to reroute or alter itineraries if
                  real-time safety assessments indicate risk.
                </List.Item>
                <List.Item>
                  Travelers are required to provide honest health disclosures to
                  ensure group safety.
                </List.Item>
              </List.Root>
            </Box>

            <Box>
              <Heading {...sectionHeaderProps}>3. Booking & Finance</Heading>
              <List.Root gap={2} {...bodyTextStyle} variant='marker'>
                <List.Item>
                  A deposit is required to lock in your spot; the final balance
                  must be settled 20 days prior to departure.
                </List.Item>
                <List.Item>
                  Roamify is not liable for changes or cancellations in
                  third-party flight or hotel bookings.
                </List.Item>
                <List.Item>
                  All transactions are handled through PCI-compliant encryption
                  services.
                </List.Item>
              </List.Root>
            </Box>

            <Box>
              <Heading {...sectionHeaderProps}>4. Cancellations</Heading>
              <List.Root gap={2} {...bodyTextStyle} variant='marker'>
                <List.Item>
                  "Change of Heart" Grace Period: Deposits are fully refundable
                  within 7 days of booking.
                </List.Item>
                <List.Item>
                  Standard Window: Full refunds (less deposit) are available up
                  to 20 days before departure.
                </List.Item>
              </List.Root>
            </Box>

            <Box>
              <Heading {...sectionHeaderProps}>5. Liability & Risk</Heading>
              <Text {...bodyTextStyle}>
                Adventure travel has inherent risks. While Roamify vets every
                partner, we cannot be held liable for natural events or
                unforeseeable external circumstances. Private travel insurance
                is mandatory for all participants.
              </Text>
            </Box>
          </Stack>
        </Box>

        <Separator borderColor='gray.200' />

        {/* SECTION 2: REFUND POLICY */}
        <Box>
          <Heading as='h2' size='2xl' mb={2}>
            Refund Standards
          </Heading>
          <Stack gap={6} mt={4}>
            <Box>
              <Heading {...sectionHeaderProps}>1. Eligibility</Heading>
              <Text {...bodyTextStyle}>
                Refunds are processed to the original payment method. Trips
                rescheduled due to safety protocols are typically offered as
                credit unless otherwise stated.
              </Text>
            </Box>
            <Box>
              <Heading {...sectionHeaderProps}>2. Insurance Notice</Heading>
              <Text {...bodyTextStyle} fontStyle='italic'>
                Roamify strongly advises all travelers to secure comprehensive
                adventure-grade insurance.
              </Text>
            </Box>
          </Stack>
        </Box>

        <Separator borderColor='gray.200' />

        {/* SECTION 3: CONTACT */}
        <Box>
          <Heading as='h2' size='2xl' mb={4}>
            Support & Legal
          </Heading>
          <Text {...bodyTextStyle} mb={4}>
            If you have questions regarding your rights under UK Package Travel
            Regulations or local laws, contact our legal desk:
          </Text>
          <Link
            color='blue.600'
            fontWeight='bold'
            textDecoration='underline'
            href='mailto:hello@roamify.com'
          >
            hello@roamify.com
          </Link>
        </Box>
      </VStack>
    </Container>
  );
};

export default TermsAndConditions;
