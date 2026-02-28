'use client';
import {
  HStack,
  Icon,
  MenuContent,
  MenuRoot,
  MenuTrigger,
  Portal,
  MenuPositioner,
  Skeleton,
  RadioGroup,
  Stack,
  VStack,
  Text,
  Flex,
  useBreakpointValue,
  Collapsible,
  Box,
} from '@chakra-ui/react';
import { ArrowRight, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRoleStore } from '@/store/role-selector.store';
import Button from '@/components/ui/button/Button';
import { AppLink } from '@/components/ui/link/AppLink';
import { useAuth, useAuthSession } from '@/hooks';
import ClientOnly from '@/components/shared/ClientOnly';

const menuList = [
  { label: 'Adventurer', value: 'ADVENTURER' },
  { label: 'Affiliate', value: 'AFFILIATE' },
  { label: 'Agent', value: 'AGENT' },
];

export const NavbarAuthActions = ({ onClose }: { onClose?: () => void }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthSession();
  const { logout } = useAuth();
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);

  // Detect if mobile
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Store action
  const selectedRole = useRoleStore((state) => state.role);
  const setRole = useRoleStore((state) => state.setRole);

  const handleRoleSelect = (value: string) => {
    setRole(value);
    setCollapsibleOpen(false);
    onClose?.();
    router.push('/register');
  };

  // Your Skeleton UI
  const AuthSkeleton = () => (
    <HStack gap={4}>
      <Skeleton width='80px' height='40px' borderRadius='md' />
      <Skeleton width='120px' height='40px' borderRadius='full' />
    </HStack>
  );

  return (
    <ClientOnly fallback={<AuthSkeleton />}>
      {isAuthenticated ? (
        <Flex align='center' justify='space-between' gap={4}>
          <Button
            asChild
            variant='outline'
            aria-label='Dashboard'
            fontWeight='medium'
            px={{ base: 3, md: 5 }}
            py={5}
            borderRadius={{ base: 'full', md: 'lg' }}
            _hover={{ bg: 'gray.50', transform: 'scale(1.1)' }}
            onClick={onClose}
          >
            <AppLink href='/dashboard'>
              <LayoutDashboard size={16} />
              <Text display={{ base: 'none', md: 'inline' }} ml={2}>
                Dashboard
              </Text>
            </AppLink>
          </Button>
          <Button
            aria-label='logout'
            cursor='pointer'
            bg={{ base: 'white', md: 'primary' }}
            color={{ base: 'primary', md: 'white' }}
            borderRadius='full'
            _hover={{ transform: 'scale(1.1)' }}
            onClick={() => {
              logout();
              onClose?.();
            }}
          >
            <LogOut size={16} />
          </Button>
        </Flex>
      ) : (
        <HStack gap={4}>
          <Button
            asChild
            aria-label='login'
            variant='outline'
            border='1px solid black'
            fontWeight='bold'
            p={5}
            cursor='pointer'
            bg='textInverse'
            textDecor='none'
            color='dark'
            onClick={onClose}
          >
            <AppLink href='/login'>Login</AppLink>
          </Button>

          {mounted && isMobile ? (
            <Box position='relative'>
              <Collapsible.Root
                open={collapsibleOpen}
                onOpenChange={(e) => setCollapsibleOpen(e.open)}
              >
                <Collapsible.Trigger asChild>
                  <Button
                    aria-label='join-us'
                    alignItems='center'
                    gap={3}
                    fontWeight='bold'
                    p={5}
                    cursor='pointer'
                    bg='secondary'
                    color='dark'
                  >
                    Join us{' '}
                    <Icon
                      as={ChevronDown}
                      size='xs'
                      transform={
                        collapsibleOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }
                      transition='transform 0.2s'
                    />
                  </Button>
                </Collapsible.Trigger>

                <Collapsible.Content>
                  <Box
                    position='absolute'
                    top='calc(100% + 8px)'
                    right={0}
                    borderWidth='1px'
                    borderRadius='md'
                    boxShadow='lg'
                    zIndex={10}
                    minW='200px'
                    bg='white'
                  >
                    <VStack align='stretch' gap={0} p={2}>
                      {menuList.map((item) => (
                        <Button
                          key={item.value}
                          variant='ghost'
                          bg={
                            selectedRole === item.value
                              ? 'blue.100'
                              : 'transparent'
                          }
                          color='dark'
                          _hover={{
                            bg:
                              selectedRole === item.value
                                ? 'blue.200'
                                : 'gray.100',
                          }}
                          onClick={() => handleRoleSelect(item.value)}
                          p={3}
                          w='full'
                          justifyContent='flex-start'
                          borderRadius='md'
                        >
                          {item.label}
                        </Button>
                      ))}
                    </VStack>
                  </Box>
                </Collapsible.Content>
              </Collapsible.Root>
            </Box>
          ) : (
            /* DESKTOP: Menu */
            <MenuRoot>
              <MenuTrigger asChild>
                <Button
                  aria-label='join-us'
                  alignItems='center'
                  gap={3}
                  fontWeight='bold'
                  p={5}
                  cursor='pointer'
                  bg='secondary'
                  color='dark'
                >
                  Join us <Icon as={ArrowRight} size='sm' />
                </Button>
              </MenuTrigger>
              <Portal>
                <MenuPositioner>
                  <MenuContent p={3}>
                    <RadioGroup.Root
                      variant='outline'
                      size='sm'
                      value={selectedRole}
                      onValueChange={(details) =>
                        handleRoleSelect(details.value || '')
                      }
                    >
                      <Stack direction='column' gap={2}>
                        {menuList.map((item) => (
                          <RadioGroup.Item
                            key={item.value}
                            value={item.value}
                            p={2}
                            borderRadius='md'
                            bg={
                              selectedRole === item.value
                                ? 'blue.200'
                                : 'transparent'
                            }
                            _hover={{
                              bg: selectedRole === item.value ? '' : 'gray.200',
                            }}
                            transition='background 0.2s'
                            cursor='pointer'
                          >
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>
                              {item.label}
                            </RadioGroup.ItemText>
                          </RadioGroup.Item>
                        ))}
                      </Stack>
                    </RadioGroup.Root>
                  </MenuContent>
                </MenuPositioner>
              </Portal>
            </MenuRoot>
          )}
        </HStack>
      )}
    </ClientOnly>
  );
};
