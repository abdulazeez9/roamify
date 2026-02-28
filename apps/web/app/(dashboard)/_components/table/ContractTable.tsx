import { Badge, IconButton, HStack } from '@chakra-ui/react';
import { FileSignature, Eye } from 'lucide-react';
import { Column, DataTable } from './DataTable';
import Button from '@/components/ui/button/Button';

interface Contract {
  id: string;
  name: string;
  date: string;
  status: 'SIGNED' | 'NOT_SIGNED';
}

// Corporate mock data
const corporateContractData: Contract[] = [
  {
    id: '1',
    name: 'Master Services Agreement',
    date: '12/15/2024',
    status: 'SIGNED',
  },
  {
    id: '2',
    name: 'Non-Disclosure Agreement',
    date: '01/10/2025',
    status: 'SIGNED',
  },
  {
    id: '3',
    name: 'Standard Terms of Service',
    date: '02/12/2026',
    status: 'NOT_SIGNED',
  },
];

// Affiliate mock data
const affiliateContractData: Contract[] = [
  {
    id: '1',
    name: 'Affiliate Partnership Agreement',
    date: '11/20/2024',
    status: 'SIGNED',
  },
  {
    id: '2',
    name: 'Commission Structure Agreement',
    date: '01/05/2025',
    status: 'NOT_SIGNED',
  },
  {
    id: '3',
    name: 'Marketing Guidelines Agreement',
    date: '02/01/2026',
    status: 'NOT_SIGNED',
  },
];

export const CorporateContractTable = () => {
  const columns: Column<Contract>[] = [
    {
      label: 'Corporate Agreement',
      key: 'name',
    },
    {
      label: 'Date',
      key: 'date',
      render: (date) => <span style={{ fontSize: '14px' }}>{date}</span>,
    },
    {
      label: 'Status',
      key: 'status',
      render: (status) => (
        <Badge
          colorPalette={status === 'SIGNED' ? 'green' : 'orange'}
          variant='subtle'
        >
          {status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      label: 'Action',
      key: 'id',
      textAlign: 'right',
      render: (_, contract) => (
        <HStack gap={2}>
          <Button size='sm' variant='solid' colorPalette='blue'>
            <FileSignature size={14} />
            Sign Now
          </Button>
          <IconButton aria-label='View' variant='ghost' size='sm'>
            <Eye size={16} />
          </IconButton>
        </HStack>
      ),
    },
  ];

  return <DataTable columns={columns} data={corporateContractData} />;
};

export const AffiliateContractTable = () => {
  const columns: Column<Contract>[] = [
    {
      label: 'Affiliate Agreement',
      key: 'name',
    },
    {
      label: 'Date',
      key: 'date',
      render: (date) => <span style={{ fontSize: '14px' }}>{date}</span>,
    },
    {
      label: 'Status',
      key: 'status',
      render: (status) => (
        <Badge
          colorPalette={status === 'SIGNED' ? 'green' : 'orange'}
          variant='subtle'
        >
          {status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      label: 'Action',
      key: 'id',
      textAlign: 'right',
      render: (_, contract) => (
        <HStack gap={2}>
          <Button size='sm' variant='solid' colorPalette='blue'>
            <FileSignature size={14} />
            Sign Now
          </Button>
          <IconButton aria-label='View' variant='ghost' size='sm'>
            <Eye size={16} />
          </IconButton>
        </HStack>
      ),
    },
  ];

  return <DataTable columns={columns} data={affiliateContractData} />;
};
