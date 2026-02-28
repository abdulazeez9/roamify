'use client';

import { AvatarImage } from '@/components/media/AvatarImage';
import { ResponsiveImage } from '@/components/media/ResponsiveImage';
import { usePermissions, usePlatformSettings, useUserProfile } from '@/hooks';
import { Box, Flex, Heading, Icon, Text, Stack } from '@chakra-ui/react';
import { Heart, ImagePlay, Share } from 'lucide-react';
import React from 'react';
import Button from '../ui/button/Button';

export default function PostHero() {
  const { data } = useUserProfile();
  const { data: res } = usePlatformSettings();
  const { isAnyAdmin } = usePermissions();
  const profileImage = data?.data?.image;
  const coverImage = res?.data?.coverImage;
  const description = res?.data?.description;
  const siteName = res?.data?.siteName;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Zago Voice Community',
          text: 'Check out these amazing travel stories on Zago Voice!',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Community link copied!');
      }
    } catch (error) {
      console.log('Share failed', error);
    }
  };

  return (
    <Box w='full' bg='white' borderBottom='1px solid' borderColor='gray.200'>
      {/* Cover Image */}
      <Box w='full' h={{ base: '220px', md: '350px' }} position='relative'>
        <ResponsiveImage
          src={coverImage ?? '/images/forms/coop-agent-form-bg.webp'}
          alt='community banner'
          sizes='100vw'
          priority={true}
          loading='eager'
          borderRadius='none'
        />

        {/* Button on top of cover image - bottom right */}
        {isAnyAdmin && (
          <Button
            position='absolute'
            bottom={4}
            right={4}
            variant='solid'
            bg='primary'
            color='white'
            borderRadius='xl'
            size={{ base: 'sm', md: 'md' }}
            boxShadow='md'
            display={{ base: 'none', md: 'flex' }}
          >
            <Icon as={ImagePlay} mr={1} /> Edit cover
          </Button>
        )}

        <Box
          bg='white'
          borderRadius='full'
          p={{ base: 2, md: 5 }}
          boxShadow='sm'
          position='absolute'
          bottom={{ base: '-20px', md: '-50px' }}
          left={{ base: '50%', md: '20%' }}
          transform={{ base: 'translateX(-50%)', md: 'none' }}
        >
          <AvatarImage src={profileImage} name={data?.data?.name} size='2xl' />
        </Box>
      </Box>

      {/* Text Content Section */}
      <Stack
        px={4}
        pt={{ base: 5, md: 4 }}
        pb={8}
        gap={2}
        align={{ base: 'center', md: 'flex-start' }}
        ml={{ base: 0, md: '20%' }}
        pl={{ base: 0, md: '120px' }}
      >
        <Flex
          w='full'
          direction={{ base: 'column', md: 'row' }}
          justify='space-between'
          align={{ base: 'center', md: 'center' }}
          gap={2}
        >
          <Heading
            fontSize={{ base: 'xl', md: '3xl' }}
            fontWeight='bold'
            display='flex'
            alignItems='center'
            gap={2}
            textAlign={{ base: 'center', md: 'left' }}
          >
            Welcome to {siteName}
            <Box display={{ base: 'none', md: 'block' }}>
              <Heart size={32} fill='red' />
            </Box>
          </Heading>

          <Button
            variant='ghost'
            border='1px solid'
            borderColor='gray.200'
            borderRadius='xl'
            size={{ base: 'sm', md: 'md' }}
            display={{ base: 'none', md: 'flex' }}
            onClick={handleShare}
          >
            <Icon as={Share} mr={1} /> Share
          </Button>
        </Flex>

        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          fontWeight='medium'
          color='gray.600'
          display={{ base: 'none', md: 'block' }}
          maxW='600px'
          textAlign='left'
        >
          {description}
        </Text>
      </Stack>
    </Box>
  );
}
