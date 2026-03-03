import { FeaturedAdventures } from '@/components/home/FeaturedAdventures';
import { HeroSection } from '@/components/home/HeroSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { PopularDestinations } from '@/components/home/PopularDestinations';
import { WhyRoamify } from '@/components/home/WhyRoamify';
import { Stack } from '@chakra-ui/react';

export default function Home() {
  return (
    <Stack py={5}>
      <HeroSection />
      <HowItWorks />
      <WhyRoamify />
      <FeaturedAdventures />
      <PopularDestinations />
    </Stack>
  );
}
