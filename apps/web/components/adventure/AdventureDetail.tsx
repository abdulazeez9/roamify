'use client';

import {
  Box,
  Heading,
  Text,
  Flex,
  Stack,
  Icon,
  Button,
  Container,
  Slider,
  HStack,
  IconButton,
  Badge,
  Separator,
  RatingGroup,
  VStack,
} from '@chakra-ui/react';
import { Itinerary } from '@zagotours/types';
import { LuClock, LuMapPin } from 'react-icons/lu';
import { ScrollProgressSteps } from '../ui/stepper/scroll-progress-step';
import AdventureSkeleton from './AdevntureSkeleton';
import { useAdventure, usePermissions, useToggleLikeAdventure } from '@/hooks';
import { ErrorState } from '../ui/ErrorState';
import {
  Verified,
  Share,
  BadgeCheck,
  Headset,
  ShieldCheck,
  AlarmClockOff,
  CircleGauge,
  Settings,
  ShieldPlus,
  CalendarDays,
  ShieldQuestionMark,
  CircleCheckBig,
  Heart,
  Lightbulb,
  CircleAlert,
  CircleX,
  CircleCheck,
} from 'lucide-react';
import { ResponsiveImage } from '../media/ResponsiveImage';
import ItineraryCard from '../ui/card/ItineraryCard';
import { AppLink } from '../ui/link/AppLink';
import { useRouter } from 'next/navigation';

interface AdventureDetailProps {
  adventureId: string;
}

export default function AdventureDetailPage({
  adventureId,
}: AdventureDetailProps) {
  const { data: response, isLoading, error } = useAdventure(adventureId);

  const { mutate: toggleLike } = useToggleLikeAdventure();
  const { isAuthenticated } = usePermissions();
  const router = useRouter();

  const adventure = response?.data;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    toggleLike(adventureId);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: adventure?.title,
          text: `Check out this adventure: ${adventure?.title}`,
          url: window.location.href,
        });
      } catch (error) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return <AdventureSkeleton />;
  }

  if (error || !adventure) {
    return <ErrorState />;
  }
  const hasDiscount = false;
  const discountPrice = adventure.price * 0.9;

  //=========ITINERARY ITEMS===========
  const itineraryItems = (adventure.itineraries || [])
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .map((step: Itinerary) => ({
      content: (
        <Box key={step.id} pb={10}>
          <Stack>
            <Heading size='xl' fontWeight='bold' color='primary.600'>
              Day {step.dayNumber}
            </Heading>
            <Text>{step.title}</Text>
          </Stack>
          <Box
            borderRadius='xl'
            boxShadow='sm'
            p={{ base: 4, md: 6 }}
            bg='gray.50'
            borderWidth='1px'
            width='full'
            maxW={{ base: '100%', md: '500px' }}
            minW={{ md: '500px' }}
          >
            <Text color='gray.600' lineHeight='tall'>
              {step.activityDetails}
            </Text>

            {step.imageUrl && (
              <Box mt={4} h='200px'>
                <ResponsiveImage
                  src={step.imageUrl}
                  alt={step.title}
                  borderRadius='md'
                  maxH='300px'
                  width='100%'
                  height='100%'
                  objectFit='cover'
                />
              </Box>
            )}
          </Box>
        </Box>
      ),
    }));

  return (
    <Container
      maxW='container.md'
      py={{ base: 4, md: 10 }}
      px={{ base: 4, md: 6 }}
    >
      <Box
        borderRadius='xl'
        boxShadow='sm'
        p={{ base: 2, md: 6 }}
        bg='gray.50'
        borderWidth='1px'
        mb={8}
      >
        <Stack gap={3}>
          <Heading
            size={{ base: 'md', md: '2xl' }}
            fontWeight='bold'
            textTransform='uppercase'
          >
            {adventure.title}
          </Heading>
          <HStack gap={2}>
            <Box bg='green.600' p={1} borderRadius='sm' display='inline-flex'>
              <RatingGroup.Root
                count={5}
                value={adventure?.rating}
                allowHalf
                readOnly
                size='xs'
              >
                <RatingGroup.HiddenInput />
                <RatingGroup.Control
                  css={{
                    '& svg': {
                      color: 'white !important',
                      fill: 'white !important',
                      stroke: 'white !important',
                    },
                    '& [data-part="item"]': { padding: '1px' },
                  }}
                />
              </RatingGroup.Root>
            </Box>
            <Text fontWeight='bold' fontSize='xs' ml='1' color='gray.600'>
              {' '}
              {adventure.rating.toFixed(1)}
            </Text>
          </HStack>
          <Flex
            align='center'
            gap={{ base: 2, md: 5 }}
            direction={{ base: 'column', md: 'row' }}
            w='full'
          >
            <Badge py={2} px={4} borderRadius='full'>
              <Icon as={BadgeCheck} boxSize={{ base: 4, md: 5 }} />
              <Text fontSize={{ base: 'xs', md: 'sm' }}>Certified Guides</Text>
            </Badge>
            <Badge py={2} px={4} borderRadius='full'>
              {' '}
              <Icon as={Headset} boxSize={{ base: 4, md: 5 }} />
              <Text fontSize={{ base: 'xs', md: 'sm' }}>Emergency Support</Text>
            </Badge>
            <Badge py={2} px={4} borderRadius='full'>
              <Icon as={ShieldCheck} boxSize={{ base: 4, md: 5 }} />
              <Text fontSize={{ base: 'xs', md: 'sm' }}>Safety Briefing</Text>
            </Badge>
          </Flex>
        </Stack>
      </Box>

      {/* 2. TITLE & SHARE SECTION */}
      <Flex
        justify='space-between'
        align='flex-start'
        mb={8}
        gap={4}
        direction={{ base: 'column', md: 'row' }}
      >
        <Box w='full'>
          <HStack gap={{ base: 2, md: 5 }} mb={2} flexWrap='wrap'>
            <Heading size={{ base: 'lg', md: '2xl' }}>
              {adventure.title}
            </Heading>
            <Badge
              display={{ base: 'none', md: 'flex' }}
              py={2}
              px={4}
              borderRadius='full'
            >
              <Icon
                as={Verified}
                fill='green.600'
                color='white'
                boxSize={{ base: 4, md: 6 }}
              />
              <Text fontSize={{ base: 'xs', md: 'sm' }}>Verified by Zago</Text>
            </Badge>
          </HStack>
          <Flex align='baseline' justify='space-between'>
            <HStack color='gray.600'>
              <Icon as={AlarmClockOff} boxSize={{ base: 4, md: 5 }} />
              <Text fontSize={{ base: 'sm', md: 'md' }}>
                {adventure.days} Days ● {adventure.days - 1} night{' '}
              </Text>
            </HStack>
            <Button
              onClick={handleShare}
              variant='ghost'
              border='1px solid'
              borderColor='gray.200'
              borderRadius='full'
              size={{ base: 'sm', md: 'md' }}
              w={{ base: 'fit', md: 'auto' }}
            >
              <Icon as={Share} mr={2} /> Share
            </Button>
          </Flex>
        </Box>
      </Flex>

      <Box position='relative' height='400px' my={6}>
        <ResponsiveImage
          src={adventure.mediaUrl || ''}
          alt={adventure.title}
          sizes='100vw'
          loading='eager'
          borderRadius='xl'
          objectFit='cover'
          objectPosition='50% 20%'
        />

        <IconButton
          aria-label='Like adventure'
          position='absolute'
          top={4}
          right={4}
          size='lg'
          variant={adventure?.isLiked ? 'solid' : 'outline'}
          colorScheme={adventure?.isLiked ? 'red' : 'gray'}
          onClick={handleLikeClick}
          bg='whiteAlpha.900'
          borderRadius='full'
          _hover={{ bg: 'white', transform: 'scale(1.1)' }}
          zIndex={2}
        >
          <Icon
            as={Heart}
            boxSize='5'
            color={adventure?.isLiked ? 'red.500' : 'gray.400'}
            fill={adventure?.isLiked ? 'red.500' : 'none'}
          />
        </IconButton>
      </Box>
      {/* 4. DESCRIPTION & DETAILS */}
      <Flex
        align='flex-start'
        justify='space-between'
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 6, md: 8 }}
      >
        <Box mb={{ base: 6, md: 12 }} w='full'>
          <Text fontSize={{ base: 'md', md: 'lg' }} color='gray.700' mb={8}>
            {adventure.description}
          </Text>

          <Stack gap={{ base: 3, md: 4 }}>
            <Heading size={{ base: 'sm', md: 'xl' }} fontWeight='bold' mb={4}>
              See adventure
            </Heading>
            <DetailItem
              icon={CircleGauge}
              label='Difficulty level'
              value={
                <HStack align='center'>
                  <Box height='40px' display='flex' alignItems='center'>
                    <Slider.Root
                      height='40px'
                      orientation='vertical'
                      min={0}
                      max={3}
                      step={1}
                      value={[
                        adventure.level.toLowerCase() === 'medium'
                          ? 1
                          : adventure.level.toLowerCase() === 'challenging'
                            ? 2
                            : 3,
                      ]}
                      readOnly
                    >
                      <Slider.Control>
                        <Slider.Track bg='gray.200' width='6px'>
                          <Slider.Range
                            bg={
                              adventure.level.toLowerCase() === 'medium'
                                ? 'green.500'
                                : adventure.level.toLowerCase() ===
                                    'challenging'
                                  ? 'orange.500'
                                  : 'red.500'
                            }
                          />
                        </Slider.Track>
                        <Slider.Thumb index={0} boxSize='8px' />
                      </Slider.Control>
                    </Slider.Root>
                  </Box>
                  <Text
                    fontSize='sm'
                    fontWeight='bold'
                    textTransform='capitalize'
                  >
                    {adventure.level.toLowerCase()}
                  </Text>
                </HStack>
              }
            />
            <DetailItem
              icon={LuClock}
              label='TripType'
              value={adventure.tripType}
            />
            <DetailItem
              icon={ShieldPlus}
              label='Safety Score'
              value={`${adventure.safetyScore}/100`}
            />
            <DetailItem
              icon={LuMapPin}
              label='Certification'
              value={
                adventure?.certification ? (
                  <Text
                    lineClamp={1}
                    maxW='200px'
                    title={adventure.certification}
                  >
                    {adventure.certification}
                  </Text>
                ) : (
                  <Icon as={BadgeCheck} />
                )
              }
            />
            <DetailItem
              icon={Settings}
              label='Gear'
              value={
                adventure?.gear ? (
                  <Text lineClamp={1} maxW='200px' title={adventure.gear}>
                    {adventure.gear}
                  </Text>
                ) : (
                  <Icon as={CircleCheckBig} />
                )
              }
            />

            <DetailItem
              icon={ShieldQuestionMark}
              label='Emergency plan'
              value={<Icon as={CircleCheckBig} />}
            />
            <DetailItem
              icon={CalendarDays}
              label='Last safety certification date'
              value={new Date(
                adventure?.lastSafetyCertDate || new Date(),
              ).toLocaleDateString()}
            />

            <VStack align='start' gap={3}>
              <HStack gap={2}>
                <Icon as={Lightbulb} />
                <Heading>Safety Tips</Heading>
              </HStack>
              <Text fontSize={{ base: 'sm', md: 'md' }} ml='-10px'>
                {adventure?.safetyTips}
              </Text>
            </VStack>
          </Stack>
        </Box>

        {/* BOOKING CARD - Sticky on mobile */}
        <Box
          p={{ base: 4, md: 6 }}
          borderRadius='2xl'
          borderWidth='1px'
          borderColor='primary.100'
          bg='white'
          boxShadow='xl'
          mb={10}
          position={{ base: 'sticky', md: 'relative' }}
          bottom={{ base: 0, md: 'auto' }}
          left={{ base: 0, md: 'auto' }}
          right={{ base: 0, md: 'auto' }}
          zIndex={{ base: 10, md: 'auto' }}
          overflow='hidden'
          w='full'
          maxW={{ base: 'full', md: '400px' }}
        >
          <Flex
            justify='space-between'
            align='center'
            wrap='wrap'
            gap={{ base: 3, md: 6 }}
          >
            <Stack gap={3} w='full'>
              <Heading size={{ base: 'sm', md: 'md' }}>
                {adventure.title}
              </Heading>
              <HStack color='gray.600'>
                <Icon as={AlarmClockOff} boxSize={{ base: 4, md: 5 }} />
                <Text fontSize={{ base: 'sm', md: 'md' }}>
                  {adventure.days} Days ● {adventure.days - 1} night{' '}
                </Text>
              </HStack>
              <HStack align='baseline' justify='space-between'>
                <Text fontSize={{ base: 'xs', md: 'sm' }}>FROM</Text>
                <HStack>
                  <Text color='primary' fontSize={{ base: 'sm', md: 'md' }}>
                    ${hasDiscount ? discountPrice : adventure.price}
                  </Text>
                  <Icon as={CircleAlert} size='sm' />
                </HStack>
                {hasDiscount && (
                  <Text
                    textDecoration='line-through'
                    color='gray.400'
                    fontSize={{ base: 'md', md: 'lg' }}
                  >
                    ${adventure.price}
                  </Text>
                )}
              </HStack>
            </Stack>
          </Flex>
          <Flex
            gap={3}
            mt={3}
            align='center'
            flex='1'
            justify='space-between'
            direction={{ base: 'row', md: 'row' }}
          >
            <IconButton
              aria-label='Like adventure'
              variant={adventure?.isLiked ? 'solid' : 'outline'}
              colorScheme={adventure?.isLiked ? 'red' : 'gray'}
              size={{ base: 'md', md: 'lg' }}
              borderRadius='full'
              onClick={handleLikeClick}
              _hover={{ bg: 'red.50', transform: 'scale(1.1)' }}
            >
              <Icon
                as={Heart}
                boxSize={{ base: 5, md: 6 }}
                color={adventure?.isLiked ? 'red.500' : 'gray.400'}
                fill={adventure?.isLiked ? 'red.500' : 'none'}
              />
            </IconButton>
            <AppLink href='https://wa.me/447418627748' target='_blank'>
              <Button
                bg='primary'
                color='white'
                size={{ base: 'md', md: 'lg' }}
                px={{ base: 6, md: 10 }}
                borderRadius='full'
                flex='1'
              >
                Book Now
              </Button>
            </AppLink>
          </Flex>
        </Box>
      </Flex>

      {/* 5. ITINERARY */}
      <Box display={{ base: 'none', md: 'block' }}>
        <ScrollProgressSteps items={itineraryItems} />
      </Box>
      <Box display={{ base: 'block', md: 'none' }}>
        <ItineraryCard adventure={adventure} />
      </Box>
      {adventure.gallery && adventure.gallery.length > 0 && (
        <Box my={8}>
          <Heading size={{ base: 'md', md: 'lg' }} mb={4}>
            Gallery
          </Heading>
          <Flex
            gap={4}
            overflowX='auto'
            pb={4}
            css={{
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#CBD5E0',
                borderRadius: '4px',
              },
            }}
          >
            {adventure.gallery
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <Box
                  key={item.id}
                  minW={{ base: '250px', md: '300px' }}
                  height='200px'
                  borderRadius='lg'
                  overflow='hidden'
                  flexShrink={0}
                >
                  <ResponsiveImage
                    src={item.mediaUrl}
                    alt={item.altText || `${adventure.title} gallery image`}
                    width='100%'
                    height='100%'
                    objectFit='cover'
                  />
                </Box>
              ))}
          </Flex>
        </Box>
      )}
      <Stack gap={8} w='full' my={10}>
        {/* 1. Inclusion/Exclusion Section */}
        <Box
          p={6}
          border='1px solid'
          borderColor='gray.100'
          borderRadius='2xl'
          bg='gray.50/30'
          maxW={{ md: '400px' }}
        >
          <Stack gap={6}>
            {/* Included */}
            <Stack gap={3}>
              <Text fontWeight='bold' fontSize='lg' color='gray.800'>
                What's included
              </Text>
              <HStack gap={3} align='start'>
                <Icon as={CircleCheck} color='green.500' mt={0.5} />
                <Text fontSize='sm' color='gray.600'>
                  {adventure?.inclusions}
                </Text>
              </HStack>
            </Stack>

            <Separator borderColor='gray.100' />

            {/* Not Included */}
            <Stack gap={3}>
              <Text fontWeight='bold' fontSize='lg' color='gray.800'>
                What's not included
              </Text>
              <HStack gap={3} align='start'>
                <Icon as={CircleX} color='red.400' mt={0.5} />
                <Text fontSize='sm' color='gray.600'>
                  {adventure?.exclusions}
                </Text>
              </HStack>
            </Stack>
          </Stack>
        </Box>

        {/* 2. Partner Profile Card */}
        <Box
          p={5}
          border='1px solid'
          borderColor='gray.200'
          borderRadius='2xl'
          boxShadow='sm'
          transition='all 0.2s'
          _hover={{ boxShadow: 'md', borderColor: 'blue.100' }}
          maxW={{ md: '400px' }}
        >
          <Stack gap={4}>
            <Heading size='md' fontWeight='bold' letterSpacing='tight'>
              Partner
            </Heading>

            <HStack gap={4} p={2} bg='blue.50/50' borderRadius='xl'>
              <Stack gap={0} flex='1'>
                <Text fontSize='xs' color='gray.500'>
                  {adventure?.partnerDescription}
                </Text>
              </Stack>
            </HStack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <Flex
      align='center'
      justify='space-between'
      maxW={{ base: 'full', md: '600px' }}
      gap={{ base: 2, md: 4 }}
    >
      <HStack gap={{ base: 2, md: 3 }} flex='1'>
        <Icon as={icon} boxSize={{ base: 5, md: 6 }} color='primary.500' />
        <Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500'>
          {label}
        </Text>
      </HStack>
      <Box fontSize={{ base: 'sm', md: 'md' }} textAlign='right'>
        {value}
      </Box>
    </Flex>
  );
}
