'use client';
import { Box, Stack, Text, Center, SimpleGrid } from '@chakra-ui/react';
import { Handshake, Map, ShieldCheck, UserCheck } from 'lucide-react';
import { SelectableCard } from '../ui/card/SelectableCard';
import { useState } from 'react';

//Card-data
const cardData = [
  {
    heading: 'Safety',
    icon: ShieldCheck,
    description:
      'We use a safety-first verification approach for adventure experiences. Adventure is supposed to be thrilling not risky in the wrong ways',
  },
  {
    heading: 'Partnership',
    icon: Handshake,
    description:
      'We believe trust is built when respect is mutual. In our world responsible operators guide travelers to safety',
  },
  {
    heading: 'Travel that Gives Back',
    icon: Map,
    description:
      'Adventure must uplift culture, nature, and local communities not harm them',
  },
  {
    heading: 'Proactive not Reactive',
    icon: UserCheck,
    description:
      'A hill we live on? Some adventure mishaps are needless. Honesty, clear expectations and genuine transparency lead to better experiences for everyone',
  },
];

export default function PurposeSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <Box>
      <Stack textAlign='center' spaceY={5}>
        <Text
          fontSize={{ base: 'xl', md: '3xl' }}
          lineHeight='1.2'
          color='primary'
          fontWeight='bolder'
        >
          Why We Do What We Do
        </Text>
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          justifyItems='center'
          justifyContent='center'
          gap={{ base: 6, md: 8 }}
          maxW='container.lg'
          mx='auto'
        >
          {cardData.map((data, idx) => (
            <SelectableCard
              key={idx}
              icon={data.icon}
              heading={data.heading}
              description={data.description}
              isActive={activeIndex === idx}
              onClick={() => setActiveIndex(idx)}
            />
          ))}
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
