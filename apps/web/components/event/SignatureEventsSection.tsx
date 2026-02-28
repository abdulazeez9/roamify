'use client';

import { Container, Heading, SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { SignatureEventCard } from '../ui/card/SignatureEventCard';

const signatureEvents = [
  {
    url: '/images/events/sig-off-the-path.webp',
    title: 'Off the Path (Expert Edition)',
    description:
      'Meet verified travel advisors Learn from the pros what truly matters before you go',
  },
  {
    url: '/images/events/sig-ooo_stories.webp',
    title: 'OOO Stories (Traveler Edition)',
    description:
      'Hear real stories from travelers Gain insights that help you make better decisions on your own trips.',
  },
  {
    url: '/images/events/sig-happy-hour.webp',
    title: 'Happy Hour ',
    description:
      'See how Zago Tours works behind the scenes and get your questions answered.',
  },
  {
    url: '/images/events/sig-speed-networking.webp',
    title: 'Adventure Speed Networking',
    description:
      'Swap stories and connect with fellow explorers building their adventure lives.',
  },
];

export default function SignatureEventsSection() {
  return (
    <Container maxW='container.xl' justifyItems='center' my='16'>
      <Heading
        size={{ base: '2xl', md: '4xl' }}
        lineHeight='1.2'
        color='primary'
        my={10}
      >
        Our Signature Events
      </Heading>

      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        gap={9}
        width={{ base: 'full', md: '900px' }}
        justifyItems='center'
      >
        {signatureEvents.map((event, index) => (
          <SignatureEventCard
            key={index}
            url={event.url}
            title={event.title}
            description={event.description}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}
