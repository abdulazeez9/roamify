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
            Terms & Conditions
          </Heading>
          <Text fontWeight='bold' color='gray.600'>
            Zago Tours Ltd
          </Text>
          <Text fontSize='sm' color='gray.500' mb={6}>
            Effective Date: 01/01/2026
          </Text>

          <Box
            bg='gray.50'
            p={5}
            borderRadius='md'
            mb={8}
            border='1px solid'
            borderColor='gray.100'
          >
            <Heading as='h4' size='xs' mb={2} textTransform='uppercase'>
              Preamble
            </Heading>
            <Text {...bodyTextStyle} fontSize='sm'>
              These Terms govern your use of Zago Tours’ platform and services.
              By booking or using our services, you agree to comply with them.
            </Text>
          </Box>

          <Stack gap={8}>
            <Box>
              <Heading {...sectionHeaderProps}>1. Introduction</Heading>
              <Text {...bodyTextStyle}>
                Zago Tours Ltd (“Zago”, “we”, “our”) is a UK-registered
                adventure travel marketplace connecting verified suppliers with
                travelers globally.
              </Text>
            </Box>

            <Box>
              <Heading {...sectionHeaderProps}>2. Safety Guarantee</Heading>
              <List.Root gap={2} {...bodyTextStyle} variant='marker'>
                <List.Item>
                  We guarantee safety under our QSS Framework (Quality, Safety,
                  Sustainability).
                </List.Item>
                <List.Item>
                  Trips may be rescheduled, rerouted, or extended for safety
                  reasons.
                </List.Item>
                <List.Item>
                  Travelers must follow instructions, disclose health info, and
                  report hazards.
                </List.Item>
              </List.Root>
            </Box>

            <Box>
              <Heading {...sectionHeaderProps}>3. Booking & Payment</Heading>
              <List.Root gap={2} {...bodyTextStyle} variant='marker'>
                <List.Item>
                  Deposits secure bookings; balance due 20 days before
                  departure.
                </List.Item>
                <List.Item>
                  Flights and hotels are on-demand; Zago is not liable for
                  third-party issues.
                </List.Item>
                <List.Item>
                  Payments processed securely via third-party providers.
                </List.Item>
              </List.Root>
            </Box>

            <Box>
              <Heading {...sectionHeaderProps}>
                4. Cancellation & Refunds
              </Heading>
              <List.Root gap={2} {...bodyTextStyle} variant='marker'>
                <List.Item>
                  Deposits refundable if canceled within 7–10 days of booking.
                </List.Item>
                <List.Item>
                  Refunds available if canceled 20 days before departure, except
                  safety-rescheduled trips.
                </List.Item>
                <List.Item>
                  Optional flexible cancellation add-on may extend refund
                  eligibility.
                </List.Item>
              </List.Root>
            </Box>

            <Box>
              <Heading {...sectionHeaderProps}>
                5. Traveler Responsibilities
              </Heading>
              <List.Root gap={1} {...bodyTextStyle} variant='marker'>
                <List.Item>Accurate health and fitness disclosure</List.Item>
                <List.Item>Follow supplier safety instructions</List.Item>
                <List.Item>Report hazards promptly</List.Item>
              </List.Root>
            </Box>

            <Box>
              <Heading {...sectionHeaderProps}>
                6. Supplier Responsibilities
              </Heading>
              <List.Root gap={1} {...bodyTextStyle} variant='marker'>
                <List.Item>Follow QSS Framework</List.Item>
                <List.Item>
                  Conduct safety assessments and pre-trip briefings
                </List.Item>
                <List.Item>
                  Immediate response to emergencies and notify Zago within 12
                  hours
                </List.Item>
              </List.Root>
            </Box>

            <Box>
              <Heading {...sectionHeaderProps}>7. Liability</Heading>
              <Text {...bodyTextStyle}>
                Adventure travel involves inherent risks. Zago and suppliers
                manage safety but cannot control natural/unforeseeable events.
                Not liable for third-party flights or hotels.
              </Text>
            </Box>

            <Box>
              <Heading {...sectionHeaderProps}>
                8. Intellectual Property
              </Heading>
              <Text {...bodyTextStyle}>
                Content belongs to Zago or licensed partners. No unauthorized
                reproduction.
              </Text>
            </Box>

            <Box>
              <Heading {...sectionHeaderProps}>
                9. Governing Law & Emergency
              </Heading>
              <Text {...bodyTextStyle}>
                UK law applies for UK travelers; other jurisdictions may apply
                internationally.
              </Text>
              <Text {...bodyTextStyle} mt={2} fontWeight='bold'>
                Emergency: contact supplier first, then Zago (
                <Link
                  color='blue.600'
                  textDecoration='underline'
                  href='mailto:partnerships@zagotours.com'
                >
                  partnerships@zagotours.com
                </Link>
                ).
              </Text>
            </Box>
          </Stack>
        </Box>

        <Separator borderColor='gray.200' />

        {/* SECTION 2: CANCELLATION & REFUND POLICY */}
        <Box>
          <Heading as='h2' size='2xl' mb={2}>
            Cancellation & Refund Policy
          </Heading>
          <Text fontSize='sm' color='gray.500' mb={6}>
            Effective Date: 01/01/2026
          </Text>

          <Stack gap={6}>
            <Box>
              <Heading {...sectionHeaderProps}>1. General Principles</Heading>
              <Text {...bodyTextStyle}>
                Zago guarantees safety; trips may be delayed or rerouted for
                safety.
              </Text>
            </Box>
            <Box>
              <Heading {...sectionHeaderProps}>2. Deposits</Heading>
              <Text {...bodyTextStyle}>
                Required to secure bookings. Refundable within 7–10 days of
                booking.
              </Text>
            </Box>
            <Box>
              <Heading {...sectionHeaderProps}>3. Refund Eligibility</Heading>
              <Text {...bodyTextStyle}>
                Full refunds if canceled 20 days before departure. Partial or no
                refunds after 20 days unless covered by insurance or safety
                rescheduling.
              </Text>
            </Box>
            <Box>
              <Heading {...sectionHeaderProps}>
                6. Insurance Recommendation
              </Heading>
              <Text {...bodyTextStyle} fontStyle='italic'>
                Travelers are strongly encouraged to obtain insurance covering
                medical emergencies, cancellations, and adventure activities.
              </Text>
            </Box>
          </Stack>
        </Box>

        <Separator borderColor='gray.200' />

        {/* SECTION 3: TRAVELLER RIGHTS */}
        <Box>
          <Heading as='h2' size='2xl' mb={2}>
            Traveller Rights (UK & Non-UK)
          </Heading>
          <Text fontSize='sm' color='gray.500' mb={6}>
            Effective Date: 01/01/2026
          </Text>

          <Stack gap={6}>
            <Box>
              <Heading {...sectionHeaderProps}>4. Cancellation Rights</Heading>
              <List.Root gap={2} {...bodyTextStyle} variant='marker'>
                <List.Item>
                  <strong>UK travelers:</strong> Rights under Package Travel
                  Regulations 2018.
                </List.Item>
                <List.Item>
                  <strong>Non-UK travelers:</strong> Rights under EU Package
                  Travel Directive 2015/2302 or local law.
                </List.Item>
              </List.Root>
            </Box>
            <Box>
              <Heading {...sectionHeaderProps}>
                6. Insolvency / Financial Protection
              </Heading>
              <Text {...bodyTextStyle}>
                Zago is a member of ATTA/ABTA. Since flights and hotels are
                on-demand, ABTA/ATOL bonding does not apply. Travelers are
                advised to obtain private travel insurance.
              </Text>
            </Box>
            <Box>
              <Heading {...sectionHeaderProps}>8. Contact</Heading>
              <Link
                color='blue.600'
                fontWeight='bold'
                textDecoration='underline'
                href='mailto:partnerships@zagotours.com'
              >
                partnerships@zagotours.com
              </Link>
            </Box>
          </Stack>
        </Box>
      </VStack>
    </Container>
  );
};

export default TermsAndConditions;
