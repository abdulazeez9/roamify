import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from '@chakra-ui/react';
import NextLink from 'next/link';

interface AppLinkProps extends ChakraLinkProps {
  href: string;
  children: React.ReactNode;
}

export const AppLink = ({ href, children, ...props }: AppLinkProps) => {
  return (
    <ChakraLink
      as={NextLink}
      href={href}
      textDecor='none'
      _hover={{ textDecor: 'none' }}
      _focus={{ boxShadow: 'none', outline: 'none' }}
      {...props}
    >
      {children}
    </ChakraLink>
  );
};
