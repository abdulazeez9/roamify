'use client';
import { Box, Flex, HStack } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { Logo } from '../../logo/Logo';
import { AppLink } from '@/components/ui/link/AppLink';
import { navlinks } from './nav.config';
import { NavbarAuthActions } from './NavbarAuthActions';

export const DesktopNav = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <Box
      bg='textInverse'
      px={8}
      py={4}
      borderBottom='1px solid'
      borderColor='dark'
      display={{ base: 'none', md: 'block' }}
      width='full'
    >
      <Flex justify='space-between' align='center' maxW='1400px' mx='auto'>
        <Logo />

        <HStack gap={10}>
          {navlinks.map((link, index) => (
            <AppLink
              key={index}
              href={link.href}
              fontSize='sm'
              textTransform='uppercase'
              fontWeight={isActive(link.href) ? 'medium' : 'sm'}
              textDecor='none'
            >
              {link.label}
            </AppLink>
          ))}
        </HStack>

        <NavbarAuthActions />
      </Flex>
    </Box>
  );
};
