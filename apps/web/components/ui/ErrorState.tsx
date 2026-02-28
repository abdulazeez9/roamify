import { Container, Center, VStack, Text } from '@chakra-ui/react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  minHeight?: string;
  containerProps?: any;
}

export function ErrorState({
  title = 'Error loading data',
  message = 'Something went wrong',
  minHeight = '400px',
  containerProps,
}: ErrorStateProps) {
  return (
    <Container maxW='container.xl' py={10} {...containerProps}>
      <Center minH={minHeight}>
        <VStack spaceY={4}>
          <Text color='red.500' fontSize='lg' fontWeight='semibold'>
            {title}
          </Text>
          <Text color='gray.600'>{message}</Text>
        </VStack>
      </Center>
    </Container>
  );
}
