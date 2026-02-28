'use client';
import { Box } from '@chakra-ui/react';
import React from 'react';
import UpcomingAndCompletedAdventuresPage from '../../_components/dataDisplay/UpcomingAndCompletedAdventure';

export default function DashboardAdventure() {
  return (
    <Box>
      <UpcomingAndCompletedAdventuresPage />
    </Box>
  );
}
