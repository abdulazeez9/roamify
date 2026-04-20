"use client";
import { PostCreator } from "@/components/post/PostCreator";
import { PostFilterBar } from "@/components/post/PostFilterBar";
import PostHero from "@/components/post/PostHero";
import { PostPageSkeleton } from "@/components/post/Postpageskeleton";
import PostSection from "@/components/post/PostSection";
import { ErrorState } from "@/components/ui/ErrorState";
import { PostFormModal } from "@/components/ui/modal/PostFormModal";
import { useCurrentUser, usePosts } from "@/hooks";
import { Box, Flex, Container, Text, VStack } from "@chakra-ui/react";
import React, { useState, useMemo } from "react";

export default function Post() {
  const { data, isLoading, isError } = usePosts();
  const { data: userData } = useCurrentUser();
  const [displayPosts, setDisplayPosts] = useState<any[]>([]);

  const posts = useMemo(() => data?.data || [], [data]);

  React.useEffect(() => {
    if (posts.length > 0) setDisplayPosts(posts);
  }, [posts]);

  if (isLoading) return <PostPageSkeleton />;
  if (isError) return <ErrorState />;

  return (
    <Box bg="gray.50" minH="100vh">
      <PostHero />

      {/* Container provides better breathing room than a simple Box */}
      <Container maxW="1200px" py={8}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={8}
          align="flex-start"
        >
          {/* Main Feed */}
          <VStack flex={2} spaceY={6} align="stretch" w="full">
            <PostFilterBar
              posts={posts}
              userName={userData?.data?.name || "Explorer"}
              onFilterResults={setDisplayPosts}
            />

            <PostCreator
              userName={userData?.data?.name || "User"}
              userImage={userData?.data?.image}
            />

            {displayPosts.length === 0 ? (
              <Flex
                bg="white"
                p={20}
                borderRadius="3xl"
                justify="center"
                align="center"
                border="1px solid"
                borderColor="gray.100"
              >
                <Text color="gray.400" fontWeight="medium">
                  No stories found. Start the journey!
                </Text>
              </Flex>
            ) : (
              <PostSection posts={displayPosts} />
            )}
          </VStack>
        </Flex>
      </Container>

      <PostFormModal />
    </Box>
  );
}
