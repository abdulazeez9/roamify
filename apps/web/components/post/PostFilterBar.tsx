'use client';

import { Box, Flex, Field, Text, HStack, Separator } from '@chakra-ui/react';
import { MapPin, SwatchBook, Tag, User, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PostResponseDto, TripTypeLabels } from '@zagotours/types';
import { SearchBar } from '../ui/search/Search';
import { SelectInput } from '../ui/input/SelectInput';
import { getCountryOptions } from '@/utils/Countries';
import { useCommunityStore } from '@/store/use-community-store';

interface FilterProps {
  posts: PostResponseDto[];
  userName?: string;
  onFilterResults: (filtered: PostResponseDto[]) => void;
}

export function PostFilterBar({
  posts,
  userName,
  onFilterResults,
}: FilterProps) {
  const [location, setLocation] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { activeTab, setActiveTab } = useCommunityStore();

  const [countryOptions, setCountryOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    getCountryOptions().then(setCountryOptions);
  }, []);

  useEffect(() => {
    const filtered = posts.filter((post) => {
      const matchesSearch =
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTitle = selectedTitle === '' || post.title === selectedTitle;

      const matchesLocation = location === '' || post.user.country === location;

      return matchesSearch && matchesTitle && matchesLocation;
    });

    onFilterResults(filtered);
  }, [searchQuery, selectedTitle, location, posts]);

  return (
    <Box
      w='full'
      p={4}
      bg='white'
      borderRadius='xl'
      borderWidth='1px'
      borderColor='gray.100'
      my={6}
    >
      <Flex align={{ base: 'center', md: 'flex-end' }} justify='space-between'>
        <HStack gap={6} display={{ base: 'none', md: 'flex' }}>
          {/* Username Display */}
          <Box flex={1}>
            <Field.Root>
              <Field.Label fontSize='xs' fontWeight='bold' mb={0}>
                Username
              </Field.Label>
              <Text
                display='flex'
                alignItems='center'
                gap={1}
                fontSize='xs'
                fontWeight='medium'
                py={1}
              >
                <User size={14} /> {userName}
              </Text>
            </Field.Root>
          </Box>

          {/* Location Filter with your Country List */}
          <Box flex={1}>
            <Field.Root>
              <Field.Label
                fontSize='xs'
                fontWeight='bold'
                display='flex'
                alignItems='center'
                gap={1}
                mb={0}
              >
                Location
              </Field.Label>
              <HStack>
                <MapPin size={14} />
                <SelectInput
                  value={location}
                  onChange={setLocation}
                  placeholder='All Locations'
                  width='150px'
                  options={countryOptions}
                />
              </HStack>
            </Field.Root>
          </Box>

          <Separator orientation='vertical' h='50px' />

          {/* Interest Filter */}
          {/* Interest Filter */}
          <Box flex={1}>
            <Field.Root>
              <Field.Label
                fontSize='xs'
                fontWeight='bold'
                display='flex'
                alignItems='center'
                gap={1}
                mb={0}
              >
                Interest
              </Field.Label>
              <HStack>
                <Tag size={14} />
                <SelectInput
                  value={selectedTitle}
                  onChange={setSelectedTitle}
                  placeholder='All Interests'
                  width='150px'
                  options={Object.entries(TripTypeLabels).map(
                    ([value, label]) => ({
                      label,
                      value,
                    }),
                  )}
                />
              </HStack>
            </Field.Root>
          </Box>
        </HStack>

        {/* Mobile Icons */}
        <HStack gap={4} display={{ base: 'flex', md: 'none' }}>
          <Box
            p={2}
            borderRadius='md'
            bg={activeTab === 'about' ? 'primary' : 'transparent'}
            color={activeTab === 'about' ? 'white' : 'gray.600'}
            onClick={() => setActiveTab('about')}
            cursor='pointer'
          >
            <Users size={28} />
          </Box>
          <Box
            p={2}
            borderRadius='md'
            bg={activeTab === 'posts' ? 'primary' : 'transparent'}
            color={activeTab === 'posts' ? 'white' : 'gray.600'}
            onClick={() => setActiveTab('posts')}
            cursor='pointer'
          >
            <SwatchBook size={28} />
          </Box>
        </HStack>
        {/* Search Input */}
        <Box>
          <SearchBar
            placeholder='Search stories...'
            width={{ base: '130px', md: '200px' }}
            onSearch={(val) => setSearchQuery(val)}
          />
        </Box>
      </Flex>
    </Box>
  );
}
