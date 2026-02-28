'use client';
import { Box, Center, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { BadgeCheck, Shuffle } from 'lucide-react';
import { FeatureTileCard } from '../ui/card/FeatureTileCard';

//Card-data
const cardData = [
  {
    heading: 'Old Way',
    icon: Shuffle,
    description: 'Operator cut corners, travelers bear risk',
    rotateIcon: true,
  },
  {
    heading: 'Old Way',
    icon: Shuffle,
    description: 'Big promises, small delivery',
    rotateIcon: true,
  },
  {
    heading: 'Old Way',
    icon: Shuffle,
    description: 'Good insertions, no rewards',
    rotateIcon: true,
  },
  {
    heading: 'Zago Tours ',
    icon: BadgeCheck,
    description: 'Every trip verified through QSS',
    bg: 'primary',
  },
  {
    heading: 'Zago Tours ',
    icon: BadgeCheck,
    description: 'What you book is what you get',
    bg: 'primary',
  },
  {
    heading: 'Zago Tours ',
    icon: BadgeCheck,
    description: 'Travel better, earn rewards for impact',
    bg: 'primary',
  },
];

export default function TransformationSection() {
  return (
    <Box>
      <Stack textAlign='center' spaceY={5}>
        <Center>
          <Text
            fontSize={{ base: 'xs', md: 'sm' }}
            px={4}
            py={1}
            border='1px solid'
            borderColor='primary'
            borderRadius='full'
            letterSpacing='widest'
          >
            The Transformation
          </Text>
        </Center>
        <Text
          fontSize={{ base: 'xl', md: '3xl' }}
          lineHeight='1.2'
          color='primary'
          fontWeight='bolder'
        >
          From Outdated to Outstanding
        </Text>

        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          justifyItems='center'
          justifyContent='center'
          gap={{ base: 6, md: 8 }}
          maxW='container.lg'
          mx='auto'
        >
          {cardData.map((data, idx) => (
            <FeatureTileCard
              key={idx}
              icon={data.icon}
              heading={data.heading}
              description={data.description}
              bg={data.bg}
            />
          ))}
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
