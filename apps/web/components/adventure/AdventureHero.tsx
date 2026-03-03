'use client';
import {
  Box,
  Text,
  Stack,
  Heading,
  Flex,
  HStack,
  createListCollection,
  Select,
  Portal,
  Badge,
} from '@chakra-ui/react';
import { SearchBar } from '../ui/search/Search';

const destinations = createListCollection({
  items: [
    { label: 'All countries', value: '' },
    { label: 'Chile', value: 'Chile' },
    { label: 'Peru', value: 'Peru' },
    { label: 'Nepal', value: 'Nepal' },
    { label: 'Mexico', value: 'Mexico' },
    { label: 'United States', value: 'United States' },
    { label: 'Ecuador', value: 'Ecuador' },
    { label: 'Puerto Rico', value: 'Puerto Rico' },
    { label: 'Tibet', value: 'Tibet' },
    { label: 'Bhutan', value: 'Bhutan' },
    { label: 'India', value: 'India' },
    { label: 'Tanzania', value: 'Tanzania' },
    { label: 'Uganda', value: 'Uganda' },
    { label: 'Mauritius', value: 'Mauritius' },
    { label: 'Kenya', value: 'Kenya' },
    { label: 'South Africa', value: 'South Africa' },
    { label: 'Panama', value: 'Panama' },
    { label: 'Philippines', value: 'Philippines' },
  ],
});

const dates = createListCollection({
  items: [
    { label: 'All dates', value: '' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'Next Month', value: 'next-month' },
  ],
});

interface AdventureHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedDestination: string;
  onDestinationChange: (value: string) => void;
  selectedDate: string;
  onDateChange: (value: string) => void;
}

export const AdventureHero = ({
  searchQuery,
  onSearchChange,
  selectedDestination,
  onDestinationChange,
  selectedDate,
  onDateChange,
}: AdventureHeroProps) => {
  return (
    <Box
      bg='primary'
      borderBottomRadius='4xl'
      borderTopRadius={{ base: 'none', md: '4xl' }}
      p={{ base: 2, md: 10 }}
      pt={{ base: 5, md: 10 }}
      mb={{ base: 0, md: '40px' }}
      position='relative'
      overflow='hidden'
    >
      {/* Decorative elements */}
      <Box
        position='absolute'
        top='-20%'
        right='-5%'
        width='300px'
        height='300px'
        borderRadius='full'
        bg='secondary'
        opacity={0.1}
        filter='blur(60px)'
      />
      <Box
        position='absolute'
        bottom='-20%'
        left='-5%'
        width='250px'
        height='250px'
        borderRadius='full'
        bg='textPrimary'
        opacity={0.1}
        filter='blur(60px)'
      />

      <Stack
        position='relative'
        textAlign='center'
        gap={{ base: 5, md: 8 }}
        align='center'
        maxW='container.xl'
        mx='auto'
        px={4}
        pb={{ base: 5, md: '100px' }}
      >
        <Badge
          bg='secondary'
          color='dark'
          px={4}
          py={2}
          borderRadius='full'
          fontSize='sm'
          fontWeight='medium'
        >
          Explore • Discover • Experience
        </Badge>

        <Heading
          size={{ base: '3xl', md: '5xl' }}
          lineHeight='1.1'
          color='white'
          fontWeight='bolder'
          maxW='800px'
        >
          Find Your Next Great Adventure
        </Heading>

        <Text
          fontSize={{ base: 'lg', md: 'xl' }}
          color='textPrimary'
          maxW='600px'
        >
          Browse through our collection of verified experiences from around the
          world
        </Text>

        <Box
          width={{ base: '100%', md: '90%', lg: '80%' }}
          position={{ base: 'relative', md: 'absolute' }}
          bottom={{ base: '0', md: '-80px' }}
          left='50%'
          transform='translateX(-50%)'
          zIndex={10}
          mt={{ base: 8, md: 0 }}
          bg='white'
          p={{ base: 4, md: 6 }}
          borderRadius='2xl'
          boxShadow='2xl'
        >
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'stretch', md: 'center' }}
            justify='space-between'
            gap={4}
            p={2}
            borderRadius={{ base: 'xl', md: 'full' }}
            border='1px solid'
            borderColor='gray.200'
            width='full'
            bg='white'
          >
            {/* LEFT SIDE: Select Buttons */}
            <Flex
              direction={{ base: 'column', sm: 'row' }}
              gap={{ base: 4, md: 6 }}
              flex='1'
              align='center'
              px={{ base: 2, md: 4 }}
            >
              {/* Where to Group */}
              <HStack
                gap={3}
                width={{ base: 'full', md: 'auto' }}
                justify='space-between'
              >
                <Select.Root
                  collection={destinations}
                  size='sm'
                  width={{ base: '100%', md: '140px' }}
                  value={selectedDestination ? [selectedDestination] : []}
                  onValueChange={(e) => onDestinationChange(e.value[0] || '')}
                >
                  <Select.Label
                    fontWeight='bold'
                    fontSize='sm'
                    whiteSpace='nowrap'
                    color='gray.700'
                  >
                    Where to
                  </Select.Label>
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder='Select Country' />
                      <Select.Indicator />
                    </Select.Trigger>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {destinations.items.map((item) => (
                          <Select.Item item={item} key={item.value}>
                            {item.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </HStack>

              {/* Vertical Separator - hidden on mobile */}
              <Box
                height='30px'
                width='1px'
                bg='gray.200'
                display={{ base: 'none', md: 'block' }}
              />

              {/* When Group */}
              <HStack
                gap={3}
                width={{ base: 'full', md: 'auto' }}
                justify='space-between'
              >
                <Select.Root
                  collection={dates}
                  size='sm'
                  width={{ base: '100%', md: '120px' }}
                  value={selectedDate ? [selectedDate] : []}
                  onValueChange={(e) => onDateChange(e.value[0] || '')}
                >
                  <Select.Label
                    fontWeight='bold'
                    fontSize='sm'
                    whiteSpace='nowrap'
                    color='gray.700'
                  >
                    When
                  </Select.Label>
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder='Anytime' />
                      <Select.Indicator />
                    </Select.Trigger>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {dates.items.map((item) => (
                          <Select.Item item={item} key={item.value}>
                            {item.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </HStack>
            </Flex>

            {/* RIGHT SIDE: Custom Search Bar */}
            <Box width={{ base: 'full', md: '320px' }}>
              <SearchBar
                placeholder='Search adventures...'
                width='full'
                value={searchQuery}
                onSearch={onSearchChange}
              />
            </Box>
          </Flex>
        </Box>
      </Stack>
    </Box>
  );
};
