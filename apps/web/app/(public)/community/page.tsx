import BehindTheScenesSection from '@/components/community/BehindTheScenesSection';
import CommunityFooter from '@/components/community/CommunityFooter';
import { CommunityHero } from '@/components/community/CommunityHero';
import GettingStartedSection from '@/components/community/GettingStartedSection';
import WhatToExpectSection from '@/components/community/WhatToExpectSection';
import { Box } from '@chakra-ui/react';
import React from 'react';

export default function Community() {
  return (
    <Box>
      <CommunityHero />
      <WhatToExpectSection />
      <GettingStartedSection />
      <BehindTheScenesSection />
      <CommunityFooter />
    </Box>
  );
}
