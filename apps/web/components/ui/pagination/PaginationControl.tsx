'use client';

import { Pagination, ButtonGroup, IconButton, Center } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

type Props = {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
};

export function PaginationControl({ pagination, onPageChange }: Props) {
  const { page, totalPages, hasNext, hasPrev } = pagination;

  // Don’t render if only one page
  if (totalPages <= 1) return null;

  return (
    <Center mt={8}>
      <Pagination.Root
        count={totalPages}
        page={page}
        pageSize={1}
        onPageChange={(e) => onPageChange(e.page)}
      >
        <ButtonGroup variant='ghost' size='sm'>
          <Pagination.PrevTrigger asChild>
            <IconButton aria-label='Previous page' disabled={!hasPrev}>
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(item) => (
              <IconButton
                key={item.value}
                variant={item.value === page ? 'outline' : 'ghost'}
              >
                {item.value}
              </IconButton>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton aria-label='Next page' disabled={!hasNext}>
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </Center>
  );
}
