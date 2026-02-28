'use client';
import {
  Box,
  Center,
  Text,
  Stack,
  Heading,
  Flex,
  SimpleGrid,
} from '@chakra-ui/react';
import React from 'react';
import { Globe, Ribbon, ShieldUser, Vegan } from 'lucide-react';
import { FeatureHighlightCard } from '../ui/card/FeatureHighlightCard';

const cardData = [
  {
    title: 'SAFE',
    image: '/images/home/home-why-choose-sect-1.webp',
    desc: 'With Zago tours, every option is verified before you even see it.',
    rightIcon: ShieldUser,
  },
  {
    title: 'SPONTANEOUS',
    image: '/images/home/home-why-choose-sect-2.webp',
    desc: 'We know what it’s like to want out, right now. That’s why we built a system that lets you select and go, stress-free. We get the rush of wanting out right now',
    rightIcon: Ribbon,
  },
  {
    title: 'SUSTAINABLE',
    image: '/images/home/home-why-choose-sect-3.webp',
    desc: 'We make sure every detail meets our standard before it ever meets you. Only quality adventures, only trusted operators.',
    rightIcon: Vegan,
  },
  {
    title: 'QUALITY',
    image: '/images/home/home-why-choose-sect-4.webp',
    desc: 'We partner with operators who protect nature and culture. Travel that respects the places we love.',
    rightIcon: Globe,
  },
];

export const Benefits = () => {
  return (
    <Box py={{ base: 10, md: 20 }}>
      <Stack
        position='relative'
        textAlign='center'
        gap={16}
        align='center'
        maxW='container.xl'
        mx='auto'
        px={4}
      >
        <Stack gap={3} align='center'>
          <Center>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              px={4}
              py={1}
              border='1px solid'
              borderColor='gray.300'
              borderRadius='full'
              letterSpacing='widest'
              textTransform='uppercase'
              fontWeight='medium'
            >
              Safety First Adventure
            </Text>
          </Center>

          <Heading
            size={{ base: '2xl', md: '4xl' }}
            lineHeight='1.2'
            color='primary'
            fontWeight='bolder'
          >
            Why Choose Zago Tours
          </Heading>
        </Stack>

        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={10}
          align='center'
          justify='center'
          width='full'
        >
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            gap={6}
            width={{ base: 'full', lg: '1000px' }} // Slightly wider for better balance
          >
            {cardData.map((card, index) => (
              <FeatureHighlightCard
                key={index}
                title={card.title}
                description={card.desc}
                imageSrc={card.image}
                rightIcon={card.rightIcon}
              />
            ))}
          </SimpleGrid>
        </Flex>
      </Stack>
    </Box>
  );
};
