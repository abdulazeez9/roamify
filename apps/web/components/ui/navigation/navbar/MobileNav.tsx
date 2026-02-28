'use client';
import {
  Box,
  Flex,
  VStack,
  Portal,
  IconButton,
  CloseButton,
  Text,
} from '@chakra-ui/react';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Drawer } from '@chakra-ui/react';
import { Logo } from '../../logo/Logo';
import { AppLink } from '@/components/ui/link/AppLink';
import { navlinks } from './nav.config';
import { NavbarAuthActions } from '@/components/ui/navigation/navbar/NavbarAuthActions';
import ClientOnly from '@/components/shared/ClientOnly';

export const MobileNav = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (path: string) => pathname === path;

  return (
    <Box
      p={4}
      bg='primary'
      color='white'
      display={{ base: 'block', md: 'none' }}
      borderBottom='1px solid'
      borderColor='gray.50'
    >
      <Flex justify='space-between' align='center'>
        <Logo />

        <ClientOnly
          fallback={
            <IconButton aria-label='Loading menu' variant='ghost'>
              <Menu color='white' />
            </IconButton>
          }
        >
          <Drawer.Root
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
            placement='end'
            size='xs'
          >
            <Drawer.Trigger asChild>
              <IconButton aria-label='Open menu' variant='ghost'>
                <Menu color='white' />
              </IconButton>
            </Drawer.Trigger>

            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content
                  position='relative'
                  css={{
                    transition:
                      'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
                  }}
                  bg='primary'
                  color='white'
                >
                  <Drawer.CloseTrigger
                    asChild
                    position='absolute'
                    top='2'
                    right='2'
                    zIndex='skipLink'
                  >
                    <CloseButton size='sm' color='white' />
                  </Drawer.CloseTrigger>

                  <Drawer.Body>
                    <VStack align='stretch' gap={6} mt={12}>
                      {navlinks.map((link, index) => (
                        <AppLink
                          key={index}
                          href={link.href}
                          variant='plain'
                          fontWeight={isActive(link.href) ? 'bold' : 'normal'}
                          onClick={() => setOpen(false)}
                        >
                          <Text color='white'>{link.label}</Text>
                        </AppLink>
                      ))}

                      <NavbarAuthActions onClose={() => setOpen(false)} />
                    </VStack>
                  </Drawer.Body>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
        </ClientOnly>
      </Flex>
    </Box>
  );
};
