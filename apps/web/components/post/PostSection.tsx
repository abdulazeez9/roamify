'use client';

import {
  Box,
  HStack,
  Stack,
  Text,
  Icon,
  Heading,
  Grid,
  Image,
  Spinner,
  Center,
} from '@chakra-ui/react';
import React from 'react';
import { PostCard } from '../ui/card/PostCard';
import { PostResponseDto } from '@zagotours/types';
import Button from '../ui/button/Button';
import { Users, SwatchBook, Info, Calendar, BadgeCheck } from 'lucide-react';
import { useCommunityStore } from '@/store/use-community-store';
import { useGalleries } from '@/hooks';

interface PostSectionProps {
  posts: PostResponseDto[];
}

export default function PostSection({ posts }: PostSectionProps) {
  const { activeTab, setActiveTab } = useCommunityStore();

  const { data: galleryData, isLoading: galleryLoading } = useGalleries({
    page: 1,
    limit: 12,
  });

  return (
    <Box display={{ base: 'block', md: 'flex' }} gap='50px'>
      {/* Sidebar */}
      <Stack
        bg='white'
        display={{ base: 'none', md: 'flex' }}
        flexDirection='column'
        w='300px'
        height='fit-content'
        p={5}
        borderWidth='1px'
        borderColor='gray.100'
        borderRadius='xl'
        boxShadow='sm'
        gap={5}
      >
        <Button
          width='100%'
          justifyContent='flex-start'
          bg={activeTab === 'about' ? 'primary' : 'gray.50'}
          color={activeTab === 'about' ? 'white' : 'black'}
          onClick={() => setActiveTab('about')}
        >
          <HStack gap={4}>
            <Users size={18} />
            <Text>About Community</Text>
          </HStack>
        </Button>
        <Button
          width='100%'
          justifyContent='flex-start'
          bg={activeTab === 'posts' ? 'primary' : 'gray.50'}
          color={activeTab === 'posts' ? 'white' : 'black'}
          onClick={() => setActiveTab('posts')}
        >
          <HStack gap={4}>
            <SwatchBook size={18} />
            <Text>Posts</Text>
          </HStack>
        </Button>
      </Stack>

      {/* Content Area */}
      <Box flex={1}>
        {activeTab === 'posts' ? (
          <Stack gap={4}>
            {posts.length > 0 ? (
              posts.map((post, idx) => (
                <PostCard key={post.id || idx} post={post} />
              ))
            ) : (
              <Box
                p={10}
                textAlign='center'
                bg='gray.50'
                borderRadius='xl'
                border='1px dashed'
                borderColor='gray.200'
              >
                <Text color='gray.500'>
                  No posts found matching your filters!
                </Text>
              </Box>
            )}
          </Stack>
        ) : (
          <Stack gap={6}>
            {/* About Section */}
            <Stack
              p={6}
              bg='white'
              borderRadius='xl'
              border='1px solid'
              borderColor='gray.100'
              gap={6}
            >
              <HStack align='flex-start' gap={4}>
                <Icon asChild color='primary.500' boxSize={6} mt={1}>
                  <Info />
                </Icon>
                <Stack gap={0}>
                  <Text fontWeight='bold'>About The Community</Text>
                  <Text fontSize='sm' color='gray.600'>
                    Connecting passionate travelers to share hidden gems and
                    local secrets. Our goal is to make every journey more
                    authentic and community-driven.
                  </Text>
                </Stack>
              </HStack>

              <HStack align='flex-start' gap={4}>
                <Icon asChild color='primary.500' boxSize={6} mt={1}>
                  <Calendar />
                </Icon>
                <Stack gap={0}>
                  <Text fontWeight='bold'>Date Created</Text>
                  <Text fontSize='sm' color='gray.600'>
                    Founded in 2024. Part of the global Zagotours network of
                    explorers.
                  </Text>
                </Stack>
              </HStack>

              <HStack align='flex-start' gap={4}>
                <Icon asChild color='primary.500' boxSize={6} mt={1}>
                  <BadgeCheck />
                </Icon>
                <Stack gap={0}>
                  <Text fontWeight='bold'>Verified</Text>
                  <Text fontSize='sm' color='gray.600'>
                    This is a moderated community ensuring all travel stories
                    and recommendations meet our quality standards.
                  </Text>
                </Stack>
              </HStack>
            </Stack>

            {/* Gallery Section */}
            <Box
              p={6}
              bg='white'
              borderRadius='xl'
              border='1px solid'
              borderColor='gray.100'
              mb={20}
            >
              <Box
                maxH='500px'
                overflowY='auto'
                pr={2}
                css={{
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-track': { background: 'transparent' },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#cbd5e0',
                    borderRadius: '24px',
                  },
                }}
              >
                <Heading fontSize='lg' fontWeight='bold' mb={4}>
                  Gallery
                </Heading>

                {galleryLoading ? (
                  <Center py={10}>
                    <Spinner color='primary.500' />
                  </Center>
                ) : galleryData?.data?.length > 0 ? (
                  <Grid
                    templateColumns={{
                      base: 'repeat(2, 1fr)',
                      md: 'repeat(auto-fill, minmax(160px, 1fr))',
                    }}
                    gap={3}
                  >
                    {galleryData.data.map((item: any) => (
                      <Box
                        key={item.id}
                        borderRadius='lg'
                        overflow='hidden'
                        border='1px solid'
                        borderColor='gray.100'
                        w='100%'
                      >
                        {item.mediaType === 'VIDEO' ? (
                          <video
                            src={item.mediaUrl}
                            controls
                            style={{
                              width: '100%',
                              height: '140px',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        ) : (
                          <Image
                            src={item.mediaUrl}
                            alt={item.title || 'Gallery item'}
                            h='140px'
                            w='full'
                            objectFit='cover'
                          />
                        )}

                        <Box px={2} py={1} bg='white'>
                          <Text fontSize='xs' color='gray.600'>
                            {item.title || 'Untitled'}
                          </Text>
                        </Box>
                      </Box>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    p={8}
                    textAlign='center'
                    bg='gray.50'
                    borderRadius='xl'
                    border='1px dashed'
                    borderColor='gray.200'
                  >
                    <Text color='gray.400' fontSize='sm'>
                      No gallery items yet.
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
