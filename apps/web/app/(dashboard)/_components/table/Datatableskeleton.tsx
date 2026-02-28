import { Table, Skeleton } from '@chakra-ui/react';

interface DataTableSkeletonProps {
  columns: number;
  rows?: number;
}

export const DataTableSkeleton = ({
  columns,
  rows = 5,
}: DataTableSkeletonProps) => {
  return (
    <Table.Root size='sm'>
      <Table.Header>
        <Table.Row>
          {Array.from({ length: columns }).map((_, idx) => (
            <Table.ColumnHeader key={idx}>
              <Skeleton height='16px' width='80px' />
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <Table.Row key={rowIdx}>
            {Array.from({ length: columns }).map((_, colIdx) => (
              <Table.Cell key={colIdx}>
                <Skeleton
                  height='16px'
                  width={colIdx === 0 ? '120px' : '100px'}
                />
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
