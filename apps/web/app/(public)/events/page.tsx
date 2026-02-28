'use client';

import Benefits from '@/components/event/Benefits';
import { EventHero } from '@/components/event/EventHero';
import EventSection from '@/components/event/EventSection';
import { PricingSection } from '@/components/event/PricingSection';
import SignatureEventsSection from '@/components/event/SignatureEventsSection';
import { Box } from '@chakra-ui/react';

export default function Events() {
  return (
    <Box>
      <EventHero />
      <SignatureEventsSection />
      <Box bg='surface' py={16} my={9}>
        <Benefits />
        <EventSection />
      </Box>
      <PricingSection />
    </Box>
  );
}
