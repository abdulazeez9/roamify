import { Box } from "@chakra-ui/react";
import { CommunityHero } from "@/components/community/CommunityHero";
import GettingStartedSection from "@/components/community/GettingStartedSection";
import CommunityFooter from "@/components/community/CommunityFooter";
import RoamifyDifference from "@/components/community/RoamifyDifference";

export default function Community() {
  return (
    <Box>
      <CommunityHero />
      <RoamifyDifference />
      <GettingStartedSection />
      <CommunityFooter />
    </Box>
  );
}
