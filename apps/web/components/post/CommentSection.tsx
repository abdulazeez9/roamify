'use client';

import { Box, Flex, Text, VStack, HStack, chakra } from '@chakra-ui/react';
import { AvatarImage } from '../media/AvatarImage';
import { useComments, useCreateComment } from '../../hooks/api/use-posts';
import { formatDate } from '@/utils/DateFormat';
import { useState } from 'react';

const CommentItem = ({
  name,
  content,
  time,
  image,
}: {
  name: string;
  content: string;
  time: string;
  image?: string;
}) => (
  <Flex gap={4} w='full'>
    <AvatarImage size='sm' name={name} src={image} />
    <VStack align='flex-start' gap={0} flex={1}>
      <Flex justify='space-between' w='full'>
        <Text fontSize='sm' fontWeight='bold' color='gray.900'>
          {name}
        </Text>
        <Text fontSize='xs' color='gray.400'>
          {time}
        </Text>
      </Flex>
      <Text fontSize='sm' color='gray.600' mt={1}>
        {content}
      </Text>
      <HStack gap={4} mt={2}>
        <Text
          fontSize='xs'
          fontWeight='semibold'
          color='primary.500'
          cursor='pointer'
        >
          Like
        </Text>
        <Text
          fontSize='xs'
          fontWeight='semibold'
          color='gray.400'
          cursor='pointer'
        >
          Reply
        </Text>
      </HStack>
    </VStack>
  </Flex>
);

// Main Comment Section
export const CommentSection = ({ postId }: { postId: string }) => {
  const { data: response, isLoading } = useComments(postId);
  const createComment = useCreateComment();
  const comments = response?.data || [];

  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && commentText.trim()) {
      createComment.mutate(
        { postId, data: { content: commentText } },
        {
          onSuccess: () => setCommentText(''),
        },
      );
    }
  };

  return (
    <VStack spaceY={4} align='flex-start' mt={2}>
      {/* Comment Input */}
      <Flex gap={3} w='full' align='center'>
        <AvatarImage src='' size='xs' name='Current User' />
        <Box flex={1} position='relative'>
          <chakra.input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleSubmit}
            disabled={createComment.isPending}
            placeholder='Write a public comment...'
            w='full'
            bg='gray.50'
            px={4}
            py={2}
            borderRadius='full'
            fontSize='sm'
            borderWidth='1px'
            borderColor='gray.200'
            _focus={{
              outline: 'none',
              borderColor: 'primary.500',
              bg: 'white',
            }}
          />
        </Box>
      </Flex>

      {/* Loading State */}
      {isLoading && (
        <Text fontSize='sm' color='gray.500' pl={12}>
          Loading comments...
        </Text>
      )}

      {/* Comments List */}
      {!isLoading && comments.length > 0 && (
        <VStack spaceY={4} w='full' align='flex-start' pt={2}>
          {comments.map((comment: any) => (
            <CommentItem
              key={comment.id}
              name={comment.user.name}
              content={comment.content}
              time={formatDate(comment.createdAt)}
              image={comment.user.image}
            />
          ))}
        </VStack>
      )}

      {/* Empty State */}
      {!isLoading && comments.length === 0 && (
        <Text fontSize='sm' color='gray.500' pl={12}>
          No comments yet. Be the first to comment!
        </Text>
      )}

      {/* View More (if there are many comments) */}
      {comments.length > 3 && (
        <Text
          fontSize='xs'
          color='primary.600'
          fontWeight='bold'
          cursor='pointer'
          pl={12}
        >
          View all {comments.length} comments
        </Text>
      )}
    </VStack>
  );
};
