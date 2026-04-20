"use client";

import { Box, Flex, Field, Text, HStack, Separator } from "@chakra-ui/react";
import { MapPin, SwatchBook, Tag, User, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { PostResponseDto, TripTypeLabels } from "@roamify/types";
import { SearchBar } from "../ui/search/Search";
import { SelectInput } from "../ui/input/SelectInput";
import { getCountryOptions } from "@/utils/Countries";
import { useCommunityStore } from "@/store/use-community-store";
import Button from "../ui/button/Button";

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
  const [location, setLocation] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

      const matchesTitle = selectedTitle === "" || post.title === selectedTitle;

      const matchesLocation = location === "" || post.user.country === location;

      return matchesSearch && matchesTitle && matchesLocation;
    });

    onFilterResults(filtered);
  }, [searchQuery, selectedTitle, location, posts]);

  return (
    <Flex
      w="full"
      p={2}
      bg="rgba(255, 255, 255, 0.8)"
      backdropFilter="blur(10px)"
      borderRadius="full"
      border="1px solid"
      borderColor="white"
      boxShadow="sm"
      justify="space-between"
      align="center"
    >
      <HStack flex={1} px={4}>
        <MapPin size={16} color="purple" />
        <SelectInput
          value={location}
          placeholder="Location"
          options={countryOptions}
          onChange={setLocation}
        />
      </HStack>

      <Separator orientation="vertical" h="20px" />

      <Box flex={1} px={4}>
        <SearchBar placeholder="Search stories..." onSearch={setSearchQuery} />
      </Box>

      <Button
        variant="solid"
        bg="primary"
        color="white"
        borderRadius="full"
        px={8}
        size="sm"
      >
        Filter
      </Button>
    </Flex>
  );
}
