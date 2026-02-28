'use client';

import { useState } from 'react';
import {
  chakra,
  Box,
  Card,
  Flex,
  Text,
  Heading,
  Image,
  HStack,
} from '@chakra-ui/react';
import { LuHeart, LuMessageCircle, LuShare2 } from 'react-icons/lu';
import { PostResponseDto } from '@zagotours/types';
import { AvatarImage } from '@/components/media/AvatarImage';
import Button from '../button/Button';
import { CommentSection } from '@/components/post/CommentSection';
import { formatDate } from '@/utils/DateFormat';
import {
  useDeletePost,
  useSharePost,
  useToggleLikePost,
  useUpdatePost,
} from '@/hooks';

interface PostCardProps {
  post: PostResponseDto;
}

export const PostCard = ({ post }: PostCardProps) => {
  const [showFull, setShowFull] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const toggleLike = useToggleLikePost();
  const sharePost = useSharePost();

  //=========== SHORTEN DESCRIPTION LENGTH =============
  const maxLength = 150;
  const isLong = post.description.length > maxLength;
  const displayDescription =
    showFull || !isLong
      ? post.description
      : `${post.description.substring(0, maxLength)}...`;

  //=====HANDLESHARE=======
  const handleShare = async () => {
    sharePost.mutate(post.id);

    const shareData = {
      title: post.title,
      text: `Check out this post by ${post.user.name} on Zago Voice`,
      url: `${window.location.origin}/posts/${post.id}`,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard!');
    }
  };

  const handleLike = () => {
    toggleLike.mutate(post.id);
  };

  return (
    <Card.Root
      width='100%'
      maxW='600px'
      variant='elevated'
      mx='auto'
      mb={6}
      bg='white'
      overflow='hidden'
      borderWidth='1px'
      borderColor='gray.100'
      boxShadow='0 2px 12px rgba(0, 0, 0, 0.05)'
      transition='transform 0.2s ease'
      _hover={{ transform: { md: 'translateY(-2px)' } }}
    >
      {/* 1. HEADER: Profile & Context */}
      <Box p={4}>
        <Flex justify='space-between' align='start'>
          <Flex align='center' gap={3}>
            <AvatarImage
              src={post.user.image}
              name={post.user.name}
              size='md'
            />
            <Box>
              <Heading size='sm' fontWeight='600' color='gray.800'>
                {post.user.name}
              </Heading>
              <Text fontSize='xs' color='gray.500' fontWeight='medium'>
                {post.user.country} | {post.title}
              </Text>
              <Text fontSize='xs' color='gray.500' fontWeight='medium'>
                {formatDate(post.createdAt)}
              </Text>
            </Box>
          </Flex>
        </Flex>

        {/* Post Title */}
        <Heading
          size='md'
          mt={4}
          mb={1}
          color='gray.900'
          letterSpacing='tight'
          lineHeight='1.3'
        >
          {post.title}
        </Heading>
      </Box>

      {/* 2. MEDIA: Image or Video - FIXED HEIGHT */}
      {post.mediaUrl && (
        <Box
          bg='gray.900'
          overflow='hidden'
          width='100%'
          height='400px'
          position='relative'
        >
          {post.mediaType === 'VIDEO' ? (
            <chakra.video
              src={post.mediaUrl}
              controls
              width='100%'
              height='100%'
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <Image
              src={post.mediaUrl}
              alt={post.title}
              width='100%'
              height='100%'
              objectFit='cover'
              loading='lazy'
              transition='scale 0.3s ease'
              _hover={{ scale: '1.05' }}
            />
          )}
        </Box>
      )}

      {/* 3. BODY: Content */}
      <Box px={4} py={3}>
        <Text
          fontSize='sm'
          color='gray.700'
          whiteSpace='pre-wrap'
          lineHeight='1.6'
        >
          {displayDescription}
          {isLong && (
            <chakra.span
              cursor='pointer'
              color='primary.600'
              fontWeight='bold'
              ml={1}
              fontSize='xs'
              textTransform='uppercase'
              onClick={() => setShowFull(!showFull)}
              _hover={{ color: 'primary.700' }}
            >
              {showFull ? ' Show Less' : ' Read More'}
            </chakra.span>
          )}
        </Text>
      </Box>

      {/* 4. FOOTER: Interactive Actions */}
      <Box px={2} py={2} borderTop='1px solid' borderColor='gray.50'>
        <HStack gap={1} width='100%'>
          {/* Like Button */}
          {/* Like Button */}
          <Button
            variant='ghost'
            size='sm'
            flex={1}
            gap={2}
            onClick={handleLike}
            color={post.isLikedByUser ? 'red.500' : 'gray.600'}
            _hover={{ bg: 'red.50', color: 'red.600' }}
          >
            <LuHeart fill={post.isLikedByUser ? 'red' : 'none'} size={18} />
            <Text fontSize='sm' fontWeight='semibold'>
              {post._count.likes} {/* Show actual count */}
            </Text>
          </Button>

          {/* Comment Button */}
          <Button
            variant='ghost'
            size='sm'
            flex={1}
            gap={2}
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            color={isCommentsOpen ? 'primary.600' : 'gray.600'}
            _hover={{ bg: 'gray.50', color: 'primary.600' }}
          >
            <LuMessageCircle size={18} />
            <Text fontSize='sm' fontWeight='semibold'>
              {post._count.comments}
            </Text>
          </Button>

          {/* Share Button */}
          <Button
            variant='ghost'
            size='sm'
            flex={1}
            gap={2}
            onClick={handleShare}
            color={post.isSharedByUser ? 'blue.500' : 'gray.600'}
            _hover={{ bg: 'blue.50', color: 'blue.600' }}
          >
            <LuShare2 size={18} />
            <Text fontSize='sm' fontWeight='semibold'>
              {post._count.shares}
            </Text>
          </Button>
        </HStack>
      </Box>
      {/* EXPANDABLE COMMENTS */}
      {isCommentsOpen && (
        <Box px={4} pb={4} pt={2} borderTop='1px solid' borderColor='gray.50'>
          <CommentSection postId={post.id} />
        </Box>
      )}
    </Card.Root>
  );
};
