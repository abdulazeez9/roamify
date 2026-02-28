'use client';

import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { CirclePlay, Image as ImageIcon } from 'lucide-react';
import Button from '../ui/button/Button';
import { usePostModalStore } from '@/store/usePostModalStore';

export function PostCreator({
  userName,
  userImage,
}: {
  userName: string;
  userImage?: string;
}) {
  const { openModal } = usePostModalStore();

  return (
    <Box
      my={6}
      bg='white'
      borderRadius='lg'
      borderWidth='1px'
      borderColor='gray.100'
      p={4}
      boxShadow='sm'
    >
      <Flex gap={3} align='center'>
        <Box flex={1} onClick={openModal} cursor='pointer'>
          <Text color='dark' fontSize='lg'>
            Share your experience
          </Text>
        </Box>

        <HStack borderTop='1px solid' borderColor='gray.50' align='center'>
          <HStack gap={4}>
            <ImageIcon size={32} cursor='pointer' onClick={openModal} />
            <CirclePlay size={32} cursor='pointer' onClick={openModal} />
          </HStack>

          <Button
            size='sm'
            bg='black'
            color='white'
            px={6}
            borderRadius='full'
            onClick={openModal}
          >
            Post
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}
