'use client';
import { Box, Text, Stack, Heading, Icon } from '@chakra-ui/react';
import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/button/Button';
import { AppLink } from '../ui/link/AppLink';

export const CommunityHero = () => {
  return (
    <Box
      bg='primary'
      color='textPrimary'
      px={{ base: 5, md: 10 }}
      py={{ base: 2, md: 10 }}
      mb={9}
      borderBottomRadius='3xl'
      position='relative'
    >
      <Stack textAlign='center' gap={5} align='center' py='50px'>
        <Heading size={{ base: '2xl', md: '4xl' }} lineHeight='1.2'>
          The community for <br /> those who travel boldly
        </Heading>

        <Text fontSize={{ base: 'md', md: 'lg' }} opacity={0.9}>
          Where people who take adventure seriously come to <br /> learn,
          connect, and travel smarter.
        </Text>

        <Button asChild bg='secondary' color='dark'>
          <AppLink href='/posts'>
            Join the community
            <Icon as={ArrowRight} ml={2} />
          </AppLink>
        </Button>
      </Stack>
    </Box>
  );
};
