import { Benefits } from '@/components/home/Benefits';
import { DestinationCountries } from '@/components/home/DestinationCountries';
import { FeaturedAdventures } from '@/components/home/FeaturedAdventures';
import { HomeHero } from '@/components/home/HomeHero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { StatsHero } from '@/components/home/StatsHero';
import { Testimonials } from '@/components/home/Testimonials';
import { Stack } from '@chakra-ui/react';

export default function Home() {
  return (
    <Stack py={5}>
      <HomeHero />
      <StatsHero />
      <HowItWorks />
      <Benefits />
      <FeaturedAdventures />
      <Testimonials />
      <DestinationCountries />
    </Stack>
  );
}
