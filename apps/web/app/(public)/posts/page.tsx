'use client';
import { PostCreator } from '@/components/post/PostCreator';
import { PostFilterBar } from '@/components/post/PostFilterBar';
import PostHero from '@/components/post/PostHero';
import { PostPageSkeleton } from '@/components/post/Postpageskeleton';
import PostSection from '@/components/post/PostSection';
import { ErrorState } from '@/components/ui/ErrorState';
import { PostFormModal } from '@/components/ui/modal/PostFormModal';
import { useCurrentUser, usePosts } from '@/hooks';
import { Box, Flex, Center, Text } from '@chakra-ui/react';
import React, { useState, useMemo } from 'react';

export default function Post() {
  const { data, isLoading, isError, error } = usePosts();
  const { data: userData } = useCurrentUser();

  const [displayPosts, setDisplayPosts] = useState<any[]>([]);

  const userName = userData?.data?.name || 'User';
  const userImage = userData?.data?.image;

  const posts = useMemo(() => {
    return data?.data || [];
  }, [data]);

  React.useEffect(() => {
    if (posts.length > 0 && displayPosts.length === 0) {
      setDisplayPosts(posts);
    }
  }, [posts]);

  if (isLoading) {
    return <PostPageSkeleton />;
  }

  if (isError) {
    return <ErrorState />;
  }

  return (
    <Box>
      <PostHero />
      <Flex direction='column' align='center' width='100%'>
        <Box width='100%' maxW='900px' px={4}>
          <PostFilterBar
            posts={posts}
            userName={userName}
            onFilterResults={(filtered) => setDisplayPosts(filtered)}
          />

          <PostCreator userName={userName} userImage={userImage} />

          {!isLoading && displayPosts.length === 0 ? (
            <Center minH='300px'>
              <Text color='gray.500' fontSize='lg'>
                No posts found yet! be the first to post
              </Text>
            </Center>
          ) : (
            <PostSection posts={displayPosts} />
          )}
        </Box>
      </Flex>

      <PostFormModal />
    </Box>
  );
}
