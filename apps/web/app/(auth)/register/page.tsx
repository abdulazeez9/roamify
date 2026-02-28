'use client';
import { Box, Container, Flex } from '@chakra-ui/react';
import { useRegistrationLogic } from '@/hooks/settings/use-registration-logic';
import { ResponsiveImage } from '@/components/media/ResponsiveImage';
import dynamic from 'next/dynamic';

const RegistrationForm = dynamic(
  () => import('@/components/auth/registration/form/RegistrationForm'),
  {
    ssr: false,
    loading: () => (
      <Box
        bg='white'
        p={{ base: 5, md: 7 }}
        borderRadius='lg'
        boxShadow='sm'
        width={{ base: '100%', md: 'md' }}
        height='570px'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        Loading form...
      </Box>
    ),
  },
);

export default function Register() {
  const { selectedCategory } = useRegistrationLogic();

  //Display image base on role
  const getImageSource = () => {
    switch (selectedCategory) {
      case 'ADVENTURER':
        return '/images/forms/adventure-form-bg.webp';
      case 'AFFILIATE':
        return '/images/forms/affiliate-form-bg.webp';
      default:
        return '/images/forms/ind-agent-form-bg.webp';
    }
  };

  return (
    <Container
      maxW={{ base: '100%', md: 'container.xl' }}
      p={{ base: 0, md: 5 }}
      display='flex'
      justifyContent='center'
      alignItems='center'
    >
      <Flex
        position='relative'
        width='full'
        justify={{ base: 'center', md: 'center' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Box
          width='700px'
          maxH='1000px'
          height='600px'
          bg='primary'
          p={5}
          borderRadius='2xl'
          display={{ base: 'none', md: 'block' }}
          transform={{ md: 'translateX(-150px)' }}
        >
          <ResponsiveImage
            src={getImageSource()}
            alt='Form background image'
            width='70%'
            height='100%'
            sizes='(max-width: 768px) 0vw, 490px'
            objectFit='cover'
          />
        </Box>

        {/* Form - Overlays right side of image */}
        <Box
          position={{ base: 'relative', md: 'absolute' }}
          top={{ base: 'auto', md: '50%' }}
          right={{ base: 'auto', md: '8%' }}
          transform={{ base: 'none', md: 'translateY(-50%)' }}
          width={{ base: '100%', md: '40%' }}
          maxWidth={{ base: '100%', md: 'none' }}
          px={{ base: 4, md: 0 }}
          my={{ base: 9, md: 0 }}
          zIndex='1'
        >
          <RegistrationForm />
        </Box>
      </Flex>
    </Container>
  );
}
