import { Table } from '@chakra-ui/react';
import React from 'react';

export interface Column<T> {
  label: string;
  key: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  textAlign?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: readonly Column<T>[];
  data: readonly T[];
}

export const DataTable = <T extends { id: string | number }>({
  columns,
  data,
}: DataTableProps<T>) => {
  return (
    <Table.Root size='sm'>
      <Table.Header>
        <Table.Row>
          {columns.map((col) => (
            <Table.ColumnHeader key={String(col.key)}>
              {col.label}
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {data.map((item, idx) => (
          <Table.Row key={item.id || idx}>
            {columns.map((col) => (
              <Table.Cell key={String(col.key)}>
                {col.render
                  ? col.render(item[col.key], item)
                  : String(item[col.key] ?? '')}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
