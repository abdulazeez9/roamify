'use client';

import { Box, VStack, Text, List } from '@chakra-ui/react';
import { Check } from 'lucide-react';
import Button from '../button/Button';
import { AppLink } from '../link/AppLink';

interface PlanProps {
  title: string;
  price: string;
  buttonText: string;
  features: string[];
  isActive?: boolean;
  href?: string;
  description?: string;
}

export const PricingCard = ({
  title,
  price,
  features,
  isActive,
  buttonText,
  href,
  description,
}: PlanProps) => {
  return (
    <Box
      px={8}
      py={10}
      borderRadius='2xl'
      borderWidth='1px'
      bg={isActive ? 'primary' : 'white'}
      color={isActive ? 'white' : 'gray.800'}
      borderColor={isActive ? 'white' : 'gray.200'}
      shadow={isActive ? 'xl' : 'md'}
      transform={isActive ? 'scale(1.05)' : 'none'}
      transition='all 0.3s'
      height='100%'
      w='100%'
      maxW={{ base: '100%', md: '380px' }}
    >
      <VStack spaceY={4} align='start' height='100%'>
        <Text fontSize='xl' fontWeight='bold'>
          {title}
        </Text>
        <Text
          fontSize='4xl'
          fontWeight='extrabold'
          display='flex'
          alignItems='baseline'
        >
          {price}
          <Box as='sub' fontSize='xl' fontWeight='bold' ml={1}>
            /monthly
          </Box>
        </Text>
        <AppLink href={href || ''} width='100%'>
          <Button
            width='100%'
            bg={isActive ? 'white' : 'primary'}
            color={isActive ? 'dark' : 'white'}
            variant={isActive ? 'solid' : 'outline'}
          >
            {buttonText}
          </Button>
        </AppLink>

        <Text>{description}</Text>
        <List.Root variant='plain' gap='3' textAlign='start' py='4' flex='1'>
          {features.map((feature, index) => (
            <List.Item key={index} display='flex' alignItems='center'>
              <List.Indicator
                as={Check}
                color={isActive ? 'blue.200' : 'green.500'}
                me='2'
              />
              {feature}
            </List.Item>
          ))}
        </List.Root>
      </VStack>
    </Box>
  );
};
