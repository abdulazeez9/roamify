import React from 'react';
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';

interface CustomButtonProps extends ChakraButtonProps {
  children: React.ReactNode;
}

const Button: React.FC<CustomButtonProps> = ({
  children,
  size = 'md',
  borderRadius = 'full',
  ...props
}) => {
  return (
    <ChakraButton size={size} borderRadius={borderRadius} {...props}>
      {children}
    </ChakraButton>
  );
};

export default Button;
