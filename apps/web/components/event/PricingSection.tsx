import { Flex, Container, Stack, Heading, Text } from '@chakra-ui/react';
import { PricingCard } from '../ui/card/PricingCard';

export const PricingSection = () => {
  return (
    <Container maxW='6xl' my='16'>
      <Stack textAlign='center' my={24}>
        <Heading
          size={{ base: '2xl', md: '4xl' }}
          fontWeight='bold'
          color='primary'
        >
          Join the Safety Network
        </Heading>
        <Text fontSize='xl' textWrap='wrap'>
          Get 24/7 peace of mind wherever you travel. <br /> Our safety
          ambassadors are one call away, whether you need <br /> guidance,
          reassurance, or mediation.
        </Text>
      </Stack>
      <Flex
        gap={10}
        direction={{ base: 'column', md: 'row' }}
        alignItems='flex-end'
      >
        <PricingCard
          title='Explorer'
          buttonText='Subscribe'
          price='£5'
          description='Peace of mind in your pocket 1 Safety 
                  Call Credit / month (up to 10 minutes)'
          features={[
            'Unlimited safety guidance',
            'Access to safety library',
            'Monthly adventure safety digest (real stories, prevention tips)',
            'Purchase extra call credits (£5 per call)',
          ]}
          href='https://buy.stripe.com/3cI9AT78wb84dd56z9cfK03'
        />
        <PricingCard
          title='Adventurer Plus'
          buttonText='Subscribe'
          price='£15'
          description='You travel bold — we’ve got your
           back 3 Safety Call Credits / month (up to 
           10 minutes each).'
          isActive={true}
          features={[
            'All tier 1 benefits',
            'Light mediation',
            '24/7 priority line',
            'Optional safety check-in service',
            'Early access to verified safe experiences',
            'Purchase extra call credits (£5 per call)',
          ]}
          href='https://buy.stripe.com/dRm4gzcsQ5NKa0T6z9cfK05'
        />
        <PricingCard
          title='Global Guardians'
          buttonText='Subscribe'
          price='£30'
          description='Your dedicated safety team, 
             anywhere you go'
          features={[
            'Unlimited safety calls',
            'All Tier 1 + 2 benefits.',
            'Unlimited safety calls, with fair-use policy',
            'Full mediation support',
            'Assigned safety ambassador',
            'Emergency coordination support',
          ]}
          href='https://buy.stripe.com/28E00j50ogso0qj9LlcfK06'
        />
      </Flex>
    </Container>
  );
};
