'use client';
import {
  Box,
  Flex,
  Drawer,
  Portal,
  CloseButton,
  Heading,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Navbar } from './_components/navbar/navbar';
import { Sidebar } from './_components/sidebar/sidebar';
import { UserRole } from './_config/menu-config';
import { useAuthSession } from '@/hooks';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { user } = useAuthSession();

  const userRole = user?.role as UserRole;

  return (
    <Flex direction='column' h='100vh' bg='gray.50' overflow='hidden'>
      <Flex flex='1' overflow='hidden'>
        {/* DESKTOP SIDEBAR */}
        <Box
          w='280px'
          bg='primary'
          color='white'
          borderRight='1px solid'
          borderColor='gray.200'
          display={{ base: 'none', md: 'block' }}
          overflowY='auto'
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none',
          }}
        >
          <Sidebar role={userRole} />
        </Box>

        {/* MOBILE DRAWER */}
        <Drawer.Root
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
          placement='start'
          size='xs'
        >
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content bg='primary' position='relative'>
                <Drawer.CloseTrigger
                  position='absolute'
                  top='2'
                  right='2'
                  zIndex='skipLink'
                >
                  <CloseButton color='white' />
                </Drawer.CloseTrigger>
                <Drawer.Body>
                  <VStack align='stretch' gap={6} mt={4}>
                    <Sidebar role={userRole} onClose={() => setOpen(false)} />
                  </VStack>
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>

        {/* MAIN CONTENT */}
        <Flex direction='column' flex='1' overflow='hidden'>
          <Navbar onOpen={() => setOpen(true)} />

          {/* SCROLLABLE CONTENT AREA */}
          <Box
            flex='1'
            overflowY='auto'
            css={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              '-ms-overflow-style': 'none',
              'scrollbar-width': 'none',
            }}
          >
            <Box
              px={{ base: 4, md: 6 }}
              py={{ base: 4, md: 6 }}
              pb={{ base: 8, md: 12 }}
              maxW='100%'
            >
              {children}
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
