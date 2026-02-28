'use client';

import React from 'react';
import { Box, Heading, Text, VStack, Center, Stack } from '@chakra-ui/react';

interface AdminTableWrapperProps {
  title: string;
  children: React.ReactNode;
  hasData: boolean;
  emptyIcon?: React.ReactNode;
  emptyText?: string;
}

export default function AdminTableWrapper({
  title,
  children,
  hasData,
  emptyIcon,
  emptyText = 'No records found.',
}: AdminTableWrapperProps) {
  return (
    <Box p={8} bg='bg.canvas' minH='100vh'>
      <Heading size='lg' mb={6}>
        {title}
      </Heading>
      <Box
        border='1px solid'
        borderColor='border.subtle'
        borderRadius='md'
        bg='bg.panel'
        overflow='hidden'
      >
        {hasData ? (
          children
        ) : (
          <Center py={20}>
            <VStack gap={4} textAlign='center'>
              {/* Render the icon if it exists */}
              {emptyIcon && (
                <Box color='gray.400' mb={2}>
                  {emptyIcon}
                </Box>
              )}
              <Stack gap={1}>
                <Text fontWeight='bold' fontSize='lg'>
                  Nothing here
                </Text>
                <Text color='fg.muted' maxW='sm'>
                  {emptyText || `There are no records to display in ${title}.`}
                </Text>
              </Stack>
            </VStack>
          </Center>
        )}
      </Box>
    </Box>
  );
}
