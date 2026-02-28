'use client';
import { Stack, Text, Icon, Box } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { AppLink } from '@/components/ui/link/AppLink';
import { MENU_CONFIG } from '../../_config/menu-config';
import { usePermissions } from '@/hooks';

export const Sidebar = ({
  role,
  onClose,
}: {
  role: string;
  onClose?: () => void;
}) => {
  const pathname = usePathname();
  const { isAffiliate, isAnyAdmin } = usePermissions();
  // ==== NAV ITEM ====
  const NavItem = ({ item }: any) => {
    const isActive = pathname === item.href;

    return (
      <AppLink
        href={item.href}
        onClick={onClose}
        p={3}
        borderRadius='md'
        bg={isActive ? 'textInverse' : 'transparent'}
        color={isActive ? 'dark' : 'textPrimary'}
        transition='0.2s'
        _hover={{ bg: isActive ? 'textPrimary' : 'whiteAlpha.200' }}
        textDecoration='none'
        display='flex'
        alignItems='center'
        gap={3}
      >
        <Icon as={item.icon} boxSize={5} />
        <Text fontSize='sm' fontWeight='medium'>
          {item.label}
        </Text>
      </AppLink>
    );
  };

  // ==== SECTION HEADING ====
  const SectionHeading = ({ children }: { children: string }) => (
    <Text
      fontSize='xs'
      fontWeight='bold'
      color='gray.400'
      mt={6}
      mb={2}
      px={2}
      letterSpacing='widest'
    >
      {children.toUpperCase()}
    </Text>
  );

  return (
    <Stack h='100vh' pb={5} overflow='hidden'>
      <Box flex='1' overflowY='auto' pr={1}>
        <SectionHeading>General Setting</SectionHeading>
        <Stack gap={1}>
          {MENU_CONFIG.roles[role as keyof typeof MENU_CONFIG.roles]?.map(
            (item) => (
              <NavItem key={item.href} item={item} />
            ),
          )}
          {!isAffiliate &&
            !isAnyAdmin &&
            MENU_CONFIG.common.main.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
        </Stack>

        {!isAnyAdmin && (
          <>
            <SectionHeading>Support</SectionHeading>
            <Stack gap={1}>
              {MENU_CONFIG.common.support.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </Stack>
          </>
        )}
      </Box>
    </Stack>
  );
};
