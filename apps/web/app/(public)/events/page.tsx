'use client';

import { Box, Text } from '@chakra-ui/react';
import { EventHero } from '@/components/event/EventHero';
import Benefits from '@/components/event/Benefits';
import EventSection from '@/components/event/EventSection';
import FeaturedEvent from '@/components/event/FeaturedEvent';
import CTASection from '@/components/event/CTASection';

export default function EventsPage() {
  return (
    <Box>
      <EventHero />

      {/* Quick Stats Banner */}
      <Box bg='white' py={8} borderBottom='1px solid' borderColor='gray.200'>
        {/* Stats are now in hero */}
      </Box>

      {/* Featured Event */}
      <FeaturedEvent />

      {/* Main Content */}
      <EventSection />

      {/* Benefits Section */}
      <Benefits />

      {/* Call to Action */}
      <CTASection />

      {/* Portfolio Note */}
      <Box
        as='footer'
        py={4}
        textAlign='center'
        bg='gray.900'
        color='white'
        fontSize='sm'
      >
        <Text opacity={0.7}>
          Project showcase • Design and development by Abdulazeez Muritador
        </Text>
      </Box>
    </Box>
  );
}
