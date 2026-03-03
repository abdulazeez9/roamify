'use client';
import { Icon, Stack, Text } from '@chakra-ui/react';
import Button from '../ui/button/Button';
import { ArrowRight } from 'lucide-react';
import { AppLink } from '../ui/link/AppLink';

export default function CommunityFooter() {
  return (
    <Stack gap={8} align='center' textAlign='center' px={4} py={20}>
      <Text fontSize='2xl' fontWeight='bold'>
        Don't just watch the world. Move through it.
      </Text>

      <Text maxW='600px' color='gray.600'>
        Roamify is built by travelers like <strong>Abdulazeez</strong> for
        travelers like you. If you're ready to trade the "tourist" label for
        "explorer," you're in the right place.
      </Text>

      <Button asChild bg='primary' color='white' size='lg'>
        <AppLink href='/posts'>
          Get Started Now
          <Icon as={ArrowRight} ml={2} />
        </AppLink>
      </Button>
    </Stack>
  );
}
