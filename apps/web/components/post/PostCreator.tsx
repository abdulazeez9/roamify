'use client';

import { Box, Flex, HStack, IconButton, Text } from '@chakra-ui/react';
import { CirclePlay, Image as ImageIcon } from 'lucide-react';
import Button from '../ui/button/Button';
import { usePostModalStore } from '@/store/usePostModalStore';
import { AvatarImage } from '../media/AvatarImage';

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
      onClick={openModal}
      cursor='pointer'
      bg='white'
      p={3}
      borderRadius='24px'
      border='1px solid'
      borderColor='gray.100'
      transition='all 0.3s ease'
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 20px -10px rgba(128, 0, 128, 0.15)',
        borderColor: 'primary.200',
      }}
    >
      <HStack spaceX={4}>
        <AvatarImage src={userImage} name={userName} size='sm' />
        <Box flex={1}>
          <Text color='gray.400' fontSize='md'>
            What's on your mind, {userName.split(' ')[0]}?
          </Text>
        </Box>
        <HStack spaceX={2}>
          <IconButton
            variant='ghost'
            color='primary.500'
            aria-label='Add Image'
          >
            <ImageIcon size={20} />
          </IconButton>
          <Button
            bg='primary.500'
            color='white'
            px={6}
            borderRadius='full'
            _hover={{ bg: 'primary.600' }}
          >
            Post
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}
