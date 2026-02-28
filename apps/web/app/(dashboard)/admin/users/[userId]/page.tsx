'use client';

import React from 'react';
import {
  Box,
  Heading,
  HStack,
  Text,
  Badge,
  VStack,
  Stack,
  Grid,
  GridItem,
  Button,
  Separator,
  Card,
} from '@chakra-ui/react';
import { useRouter, useParams } from 'next/navigation';
import {
  useUser,
  useUpdateUserStatus,
  usePromoteSafetyAmbassador,
  usePermissions,
} from '@/hooks';
import { AvatarImage } from '@/components/media/AvatarImage';
import { LoadingState } from '@/components/ui/LoadingState';
import { ArrowLeft, Edit, Shield, Ban, CheckCircle } from 'lucide-react';
import { formatDate } from '@/utils/DateFormat';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;

  const { isAdventurer } = usePermissions();
  const { data: response, isLoading, isError } = useUser(userId);
  const updateStatusMutation = useUpdateUserStatus();
  const promoteSafetyAmbassadorMutation = usePromoteSafetyAmbassador();
  const user = response?.data;

  const handleStatusToggle = async () => {
    if (!user) return;
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    await updateStatusMutation.mutateAsync({ id: userId, status: newStatus });
  };

  const handlePromoteSafetyAmbassador = async () => {
    await promoteSafetyAmbassadorMutation.mutateAsync({
      id: userId,
      safetyAmbassador: !user.safetyAmbassador,
    });
  };

  if (isLoading) {
    return <LoadingState message='Loading user details...' />;
  }

  if (isError || !user) {
    return (
      <Box p={8}>
        <Text color='red.500'>Failed to load user details.</Text>
      </Box>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    const colorMap: Record<string, string> = {
      SUPER_ADMIN: 'purple',
      ADMIN: 'orange',
      AFFILIATE: 'cyan',
      ADVENTURER: 'green',
      INDEPENDENT_AGENT: 'blue',
      COOPERATE_AGENT: 'teal',
    };
    return colorMap[role] || 'gray';
  };

  return (
    <Box p={8} bg='bg.canvas' minH='100vh'>
      {/* Header */}
      <HStack justify='space-between' mb={6}>
        <HStack gap={4}>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => router.push('/admin/users')}
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <Heading size='lg'>User Details</Heading>
        </HStack>
        <HStack gap={3}>
          {isAdventurer && !user.safetyAmbassador && (
            <Button
              colorPalette='purple'
              onClick={handlePromoteSafetyAmbassador}
              loading={promoteSafetyAmbassadorMutation.isPending}
            >
              <Shield size={16} />
              Promote to Safety Ambassador
            </Button>
          )}
          {user.role !== 'SUPER_ADMIN' && (
            <Button
              colorPalette={user.status === 'ACTIVE' ? 'red' : 'green'}
              onClick={handleStatusToggle}
              loading={updateStatusMutation.isPending}
            >
              {user.status === 'ACTIVE' ? (
                <>
                  <Ban size={16} />
                  Suspend User
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Activate User
                </>
              )}
            </Button>
          )}
          <Button
            colorPalette='blue'
            onClick={() => router.push(`/admin/users/${userId}/edit`)}
          >
            <Edit size={16} />
            Edit User
          </Button>
        </HStack>
      </HStack>

      {/* User Profile Card */}
      <Card.Root mb={6}>
        <Card.Body>
          <HStack gap={6} align='start'>
            <AvatarImage src={user.image} name={user.name} size='2xl' />
            <VStack align='start' flex={1} gap={3}>
              <Box>
                <Heading size='xl'>{user.name}</Heading>
                <Text color='fg.muted' fontSize='lg'>
                  {user.email}
                </Text>
              </Box>
              <HStack gap={2}>
                <Badge
                  variant='subtle'
                  colorPalette={getRoleBadgeColor(user.role)}
                >
                  {user.role}
                </Badge>
                <Badge
                  variant='solid'
                  colorPalette={user.status === 'ACTIVE' ? 'green' : 'red'}
                >
                  {user.status}
                </Badge>
                {user.safetyAmbassador && (
                  <Badge variant='solid' colorPalette='purple'>
                    <Shield size={12} />
                    Safety Ambassador
                  </Badge>
                )}
              </HStack>
            </VStack>
          </HStack>
        </Card.Body>
      </Card.Root>

      {/* User Information Grid */}
      <Grid templateColumns='repeat(2, 1fr)' gap={6}>
        {/* Basic Information */}
        <GridItem>
          <Card.Root>
            <Card.Header>
              <Heading size='md'>Basic Information</Heading>
            </Card.Header>
            <Card.Body>
              <Stack gap={4}>
                <Box>
                  <Text fontSize='sm' color='fg.muted' mb={1}>
                    Phone
                  </Text>
                  <Text fontWeight='medium'>{user.phone || 'N/A'}</Text>
                </Box>
                <Box>
                  <Text fontSize='sm' color='fg.muted' mb={1}>
                    Country
                  </Text>
                  <Text fontWeight='medium'>{user.country || 'N/A'}</Text>
                </Box>
                <Box>
                  <Text fontSize='sm' color='fg.muted' mb={1}>
                    Referral Code
                  </Text>
                  <Text fontWeight='medium' fontFamily='mono'>
                    {user.referralCode}
                  </Text>
                </Box>
                {user.referredById && (
                  <Box>
                    <Text fontSize='sm' color='fg.muted' mb={1}>
                      Referred By
                    </Text>
                    <Text fontWeight='medium'>{user.referredById}</Text>
                  </Box>
                )}
              </Stack>
            </Card.Body>
          </Card.Root>
        </GridItem>

        {/* Account Information */}
        <GridItem>
          <Card.Root>
            <Card.Header>
              <Heading size='md'>Account Information</Heading>
            </Card.Header>
            <Card.Body>
              <Stack gap={4}>
                <Box>
                  <Text fontSize='sm' color='fg.muted' mb={1}>
                    Created At
                  </Text>
                  <Text fontWeight='medium'>{formatDate(user.createdAt)}</Text>
                </Box>
                <Box>
                  <Text fontSize='sm' color='fg.muted' mb={1}>
                    Last Updated
                  </Text>
                  <Text fontWeight='medium'>{formatDate(user.updatedAt)}</Text>
                </Box>
                {user.deletedAt && (
                  <Box>
                    <Text fontSize='sm' color='fg.muted' mb={1}>
                      Deleted At
                    </Text>
                    <Text fontWeight='medium' color='red.500'>
                      {formatDate(user.deletedAt)}
                    </Text>
                  </Box>
                )}
              </Stack>
            </Card.Body>
          </Card.Root>
        </GridItem>

        {/* Role-Specific Details */}
        {user.independentDetails && (
          <GridItem colSpan={2}>
            <Card.Root>
              <Card.Header>
                <Heading size='md'>Independent Agent Details</Heading>
              </Card.Header>
              <Card.Body>
                <Stack gap={4}>
                  <Box>
                    <Text fontSize='sm' color='fg.muted' mb={1}>
                      Certifications
                    </Text>
                    <HStack gap={2}>
                      {user.independentDetails.certifications.map(
                        (cert: any) => (
                          <Badge key={cert} colorPalette='blue'>
                            {cert}
                          </Badge>
                        ),
                      )}
                    </HStack>
                  </Box>
                  <Box>
                    <Text fontSize='sm' color='fg.muted' mb={1}>
                      How Did You Hear
                    </Text>
                    <Text fontWeight='medium'>
                      {user.independentDetails.howDidYouHear || 'N/A'}
                    </Text>
                  </Box>
                </Stack>
              </Card.Body>
            </Card.Root>
          </GridItem>
        )}

        {user.cooperateDetails && (
          <GridItem colSpan={2}>
            <Card.Root>
              <Card.Header>
                <Heading size='md'>Corporate Agent Details</Heading>
              </Card.Header>
              <Card.Body>
                <Stack gap={4}>
                  <Box>
                    <Text fontSize='sm' color='fg.muted' mb={1}>
                      Company Name
                    </Text>
                    <Text fontWeight='medium'>
                      {user.cooperateDetails.companyName}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize='sm' color='fg.muted' mb={1}>
                      Travel Business Description
                    </Text>
                    <Text fontWeight='medium'>
                      {user.cooperateDetails.travelBusinessDescription}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize='sm' color='fg.muted' mb={1}>
                      How Did You Hear
                    </Text>
                    <Text fontWeight='medium'>
                      {user.cooperateDetails.howDidYouHear || 'N/A'}
                    </Text>
                  </Box>
                </Stack>
              </Card.Body>
            </Card.Root>
          </GridItem>
        )}

        {user.affiliateDetails && (
          <GridItem colSpan={2}>
            <Card.Root>
              <Card.Header>
                <Heading size='md'>Affiliate Details</Heading>
              </Card.Header>
              <Card.Body>
                <Stack gap={4}>
                  <Box>
                    <Text fontSize='sm' color='fg.muted' mb={1}>
                      Community Brand
                    </Text>
                    <Text fontWeight='medium'>
                      {user.affiliateDetails.communityBrand}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize='sm' color='fg.muted' mb={1}>
                      Social Links
                    </Text>
                    <VStack align='start' gap={1}>
                      {user.affiliateDetails.socialLinks.map(
                        (link: string, idx: number) => (
                          <Text key={idx} fontWeight='medium' color='blue.500'>
                            {link}
                          </Text>
                        ),
                      )}
                    </VStack>
                  </Box>
                  <Box>
                    <Text fontSize='sm' color='fg.muted' mb={1}>
                      How Did You Hear
                    </Text>
                    <Text fontWeight='medium'>
                      {user.affiliateDetails.howDidYouHear || 'N/A'}
                    </Text>
                  </Box>
                </Stack>
              </Card.Body>
            </Card.Root>
          </GridItem>
        )}
      </Grid>
    </Box>
  );
}
