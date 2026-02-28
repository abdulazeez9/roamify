'use client';

import { AdventureHero } from '@/components/adventure/AdventureHero';
import FormSection from '@/components/adventure/FormSection';
import TripTypeSection from '@/components/adventure/TripTypeSection';
import VerifiedAdventureSection from '@/components/adventure/VerifiedAdventureSection';
import { ResponsiveImage } from '@/components/media/ResponsiveImage';
import { Stack, Box } from '@chakra-ui/react';
import React, { useState } from 'react';

export default function Adventures() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <Stack mb={16} spaceY={10}>
      <AdventureHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDestination={selectedDestination}
        onDestinationChange={setSelectedDestination}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      <TripTypeSection />

      <VerifiedAdventureSection
        searchQuery={searchQuery}
        selectedDestination={selectedDestination}
        selectedDate={selectedDate}
      />

      <FormSection />
    </Stack>
  );
}
