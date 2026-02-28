'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Heading,
  Text,
  Stack,
  HStack,
  Flex,
  Badge,
  Separator,
  Grid,
  GridItem,
  AvatarGroup,
} from '@chakra-ui/react';
import { ResponsiveImage } from '@/components/media/ResponsiveImage';
import { AvatarImage } from '@/components/media/AvatarImage';
import { EventResponseDto } from '@zagotours/types';
import { Calendar, MapPin, Timer, Users, Info } from 'lucide-react';
import Button from '../ui/button/Button';
import { formatDate } from '@/utils/DateFormat';
import {
  useCancelEventRegistration,
  useJoinEvent,
  usePermissions,
} from '@/hooks';
import { formatTime } from '@/utils/TimeFormat';
import { FiTag } from 'react-icons/fi';

interface EventDetailPageProps {
  event: EventResponseDto;
}

export const EventDetailPage = ({ event }: EventDetailPageProps) => {
  const joinEvent = useJoinEvent();
  const cancelRegistration = useCancelEventRegistration();
  const { isAuthenticated } = usePermissions();
  const router = useRouter();

  const handleJoinEvent = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    joinEvent.mutate(event.id);
  };
  const handleCancelRegistration = () => {
    cancelRegistration.mutate(event.id);
  };

  const attendees =
    event.registrations?.map((reg) => ({
      name: reg.user.name,
      src: reg.user.image || undefined,
    })) || [];

  return (
    <Box bg='gray.50' minH='100vh' pb={20}>
      {/* --- HEADER START --- */}
      <Box
        bg='primary'
        color='textPrimary'
        borderRadius={{ base: 'none', md: '3xl' }}
        px={{ base: 5, md: 10 }}
        pt={{ base: '20px', md: '120px' }}
        mb={{ base: 0, md: '250px' }}
        position='relative'
      >
        <Stack
          textAlign='center'
          gap={5}
          align='center'
          pb={{ base: 10, md: '280px' }}
        >
          <Heading
            size={{ base: '2xl', md: '4xl' }}
            lineHeight='1.2'
            color='white'
            mb={{ base: 4, md: 16 }}
          >
            {event.title}
          </Heading>

          <Box
            width={{ base: '100%', md: '80%', lg: '70%' }}
            position={{ base: 'relative', md: 'absolute' }}
            bottom={{ base: '0', md: '-150px' }}
            left='50%'
            transform='translateX(-50%)'
            zIndex={10}
            mt={{ base: 6, md: 0 }}
          >
            <ResponsiveImage
              src={event?.mediaUrl || ''}
              alt={event.title}
              width='100%'
              loading='eager'
              height={{ base: '250px', md: '450px' }}
              borderRadius='2xl'
              boxShadow='2xl'
            />
          </Box>
        </Stack>
      </Box>
      {/* --- HEADER END --- */}

      <Container maxW='container.xl' mt={{ base: 10, md: 24 }}>
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={10}>
          {/* Main Content Area */}
          <GridItem>
            <Stack
              spaceY={8}
              bg='white'
              p={{ base: 6, md: 10 }}
              borderRadius='2xl'
              shadow='sm'
            >
              <Stack spaceY={2}>
                <Badge
                  colorPalette={event.isSignature ? 'green.200' : 'dark'}
                  alignSelf='start'
                  size='lg'
                >
                  {event.isSignature ? '✨ Signature Event' : 'Community Event'}
                </Badge>
                <Heading size='3xl' color='primary'>
                  About Event
                </Heading>
              </Stack>

              <Flex wrap='wrap' gap={8} py={2} color='gray.600'>
                <HStack>
                  <Calendar size={20} color='var(--chakra-colors-primary)' />
                  <Text fontWeight='semibold'>{formatDate(event.date)}</Text>
                </HStack>
                <HStack>
                  <Timer size={20} color='var(--chakra-colors-primary)' />
                  <Text fontWeight='semibold'>
                    {formatTime(event.date, true)}
                  </Text>
                </HStack>
                <HStack>
                  <MapPin size={20} color='var(--chakra-colors-primary)' />
                  <Text fontWeight='semibold'>{event.location}</Text>
                </HStack>

                <HStack>
                  <FiTag size={20} color='var(--chakra-colors-primary)' />
                  <Badge
                    bg='gray.100'
                    px={2}
                    py={0.5}
                    borderRadius='md'
                    fontSize='9px'
                    fontWeight='bold'
                    color='gray.700'
                  >
                    {event?.pricing}
                  </Badge>
                </HStack>
              </Flex>

              <Separator />

              <Text fontSize='lg' color='gray.700' lineHeight='tall'>
                {event.description}
              </Text>

              <Stack
                spaceY={4}
                p={6}
                bg='orange.50'
                borderRadius='xl'
                borderLeft='4px solid'
                borderColor='orange.400'
              >
                <HStack color='orange.800'>
                  <Info size={20} />
                  <Text fontWeight='bold'>Cancellation Policy</Text>
                </HStack>
                <Text fontSize='sm' color='orange.900'>
                  {event.cancellationTerms}
                </Text>
              </Stack>
            </Stack>
          </GridItem>

          {/* Sidebar Action Card */}
          <GridItem>
            <Stack spaceY={6} position={{ lg: 'sticky' }} top='40px'>
              <Box
                bg='white'
                p={8}
                borderRadius='2xl'
                shadow='xl'
                borderWidth='1px'
              >
                <Stack spaceY={6}>
                  <Box>
                    <Text
                      color='gray.500'
                      fontSize='sm'
                      fontWeight='bold'
                      mb={1}
                    >
                      REGISTRATION STATUS
                    </Text>
                    {event.isFull ? (
                      <Badge colorPalette='red' variant='solid'>
                        Sold Out
                      </Badge>
                    ) : (
                      <Badge colorPalette='green' variant='subtle'>
                        Open Now
                      </Badge>
                    )}
                  </Box>

                  <HStack justify='space-between'>
                    <Flex align='center' gap={2}>
                      <Users size={20} />
                      <Text fontWeight='medium'>Available Spots</Text>
                    </Flex>
                    <Text
                      fontSize='xl'
                      fontWeight='bold'
                      color={event.spotLeft < 5 ? 'red.500' : 'primary'}
                    >
                      {event.spotLeft}
                    </Text>
                  </HStack>
                  <Button
                    size='lg'
                    width='full'
                    bg='primary'
                    color='white'
                    disabled={
                      event.isFull ||
                      event.isExpired ||
                      joinEvent.isPending ||
                      cancelRegistration.isPending
                    }
                    py={7}
                    fontSize='md'
                    onClick={
                      event.hasJoined
                        ? handleCancelRegistration
                        : handleJoinEvent
                    }
                    loading={
                      joinEvent.isPending || cancelRegistration.isPending
                    }
                  >
                    {event.hasJoined
                      ? 'Cancel Registration'
                      : 'Reserve My Spot'}
                  </Button>

                  <Text fontSize='xs' textAlign='center' color='gray.400'>
                    Deadline: {formatDate(event.joinTill)}
                  </Text>

                  <Separator />

                  <Box>
                    <Text fontWeight='bold' fontSize='sm' mb={3}>
                      Who's coming?
                    </Text>
                    <Flex align='center' gap={4}>
                      <AvatarGroup size='sm'>
                        {attendees.map((person, i) => (
                          <AvatarImage
                            key={i}
                            name={person.name}
                            src={person.src || ''}
                          />
                        ))}
                      </AvatarGroup>
                      <Text fontSize='xs' color='gray.500' fontWeight='medium'>
                        {attendees.length > 0
                          ? `${attendees.length} members joined`
                          : 'No participants yet'}
                      </Text>
                    </Flex>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};
