import { Container, Center, VStack, Spinner, Text } from '@chakra-ui/react';

interface LoadingStateProps {
  message?: string;
  minHeight?: string;
  containerProps?: any;
}

export function LoadingState({
  message = 'Loading...',
  minHeight = '400px',
  containerProps,
}: LoadingStateProps) {
  return (
    <Container maxW='container.xl' py={10} {...containerProps}>
      <Center minH={minHeight}>
        <VStack spaceY={4}>
          <Spinner size='xl' color='primary' width='4px' />
          <Text color='gray.600'>{message}</Text>
        </VStack>
      </Center>
    </Container>
  );
}
