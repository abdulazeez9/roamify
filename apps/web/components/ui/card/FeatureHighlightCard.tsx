'use client';
import { ResponsiveImage } from '@/components/media/ResponsiveImage';
import {
  Box,
  Text,
  Stack,
  Heading,
  Flex,
  Center,
  Icon,
} from '@chakra-ui/react';
import { LucideIcon, MoveUpRight } from 'lucide-react';

interface FeatureHighlightCardProps {
  imageSrc: string;
  title: string;
  description: string;
  rightIcon: LucideIcon;
}

export const FeatureHighlightCard = ({
  imageSrc,
  title,
  description,
  rightIcon: RightIcon,
}: FeatureHighlightCardProps) => {
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      bg='surface'
      borderRadius='xl'
      overflow='hidden'
      border='1px solid'
      borderColor='gray.100'
      align='stretch'
      width='full'
      boxShadow='sm'
      gap={{ base: 0, md: 3 }}
      maxW={{ md: '450px' }}
    >
      <Box
        width={{ base: '100%', md: '35%' }}
        minW={{ md: '120px' }}
        order={{ base: 2, md: 0 }}
      >
        <ResponsiveImage
          src={imageSrc}
          alt={title}
          height={{ base: '180px', md: '100%' }}
          width='100%'
          objectFit='cover'
        />
      </Box>

      <Stack
        p={5}
        flex='1'
        gap={5}
        justify='center'
        textAlign={{ base: 'center', md: 'left' }}
        align={{ base: 'center', md: 'stretch' }}
        order={1}
      >
        <Flex
          justify={{ base: 'center', md: 'space-between' }}
          align='center'
          width='full'
          order={{ base: 0, md: 1 }}
        >
          <Center
            p={2}
            borderRadius='md'
            borderWidth='1px'
            borderColor='primary'
            color='primary'
            display={{ base: 'none', md: 'flex' }}
          >
            <Icon as={MoveUpRight} size='md' />
          </Center>

          <Center
            p={2}
            bg={{ base: 'primary', md: 'gray.50' }}
            borderRadius='md'
            color={{ base: 'gray.50', md: 'primary' }}
          >
            <RightIcon size={18} />
          </Center>
        </Flex>

        <Box>
          <Heading size='sm' fontWeight='bold' color='primary' mb={1}>
            {title}
          </Heading>

          <Text fontSize='xs' color='gray.600' lineHeight='tall'>
            {description}
          </Text>
        </Box>
      </Stack>
    </Flex>
  );
};
