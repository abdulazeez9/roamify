'use client';

import { useState } from 'react';
import { AvatarImage } from '@/components/media/AvatarImage';
import Button from '@/components/ui/button/Button';
import { Box, Flex, HStack, IconButton } from '@chakra-ui/react';
import { LuMenu } from 'react-icons/lu';
import { SearchBar } from '@/components/ui/search/Search';
import { TripRequestDialog } from '../dialogs/trip-request-dialog';
import { usePermissions, useUserProfile } from '@/hooks';
import { PlanningCallDialog } from '../dialogs/PlanningCallDialog';
import { PhoneCall } from 'lucide-react';

interface NavbarProps {
  onOpen: () => void;
}

export const Navbar = ({ onOpen }: NavbarProps) => {
  const [isTripDialogOpen, setIsTripDialogOpen] = useState(false);
  const [isPlanningCallDialogOpen, setIsPlanningCallDialogOpen] =
    useState(false);

  const { data: userProfile } = useUserProfile();
  const { isAnyAdmin } = usePermissions();

  const userData = userProfile?.data;
  const userName = userData?.name || 'User';
  const userImage = userData?.image;

  return (
    <>
      <Flex
        h='70px'
        align='center'
        justify='space-between'
        px={{ base: 4, md: 8 }}
        py={{ base: 4, md: 5 }}
        bg='white'
        borderBottom='1px solid'
        borderColor='gray.200'
      >
        <HStack gap={4}>
          <IconButton
            aria-label='Open Menu'
            display={{ base: 'flex', md: 'none' }}
            variant='ghost'
            onClick={onOpen}
          >
            <LuMenu />
          </IconButton>
          <Box display={{ base: 'none', md: 'flex' }}>
            <SearchBar />
          </Box>
        </HStack>

        <HStack gap={4}>
          {!isAnyAdmin && (
            <Button
              bg='primary'
              color='white'
              onClick={() => setIsTripDialogOpen(true)}
            >
              Request a trip
            </Button>
          )}
          {!isAnyAdmin && (
            <>
              <Box display={{ base: 'inline', md: 'none' }}>
                <PhoneCall
                  fill='primary'
                  color='white'
                  onClick={() => setIsPlanningCallDialogOpen(true)}
                />
              </Box>
              <Button
                bg='primary'
                color='white'
                display={{ base: 'none', md: 'inline' }}
                onClick={() => setIsPlanningCallDialogOpen(true)}
              >
                Book your trip-planning call
              </Button>
            </>
          )}

          <AvatarImage src={userImage} name={userName} />
        </HStack>
      </Flex>

      <TripRequestDialog
        open={isTripDialogOpen}
        onOpenChange={(e) => setIsTripDialogOpen(e.open)}
      />

      <PlanningCallDialog
        open={isPlanningCallDialogOpen}
        onOpenChange={(e) => setIsPlanningCallDialogOpen(e.open)}
      />
    </>
  );
};
