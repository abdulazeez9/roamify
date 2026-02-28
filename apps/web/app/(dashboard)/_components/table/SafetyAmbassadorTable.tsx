import { Badge, Box, Heading } from '@chakra-ui/react';
import { DataTable, Column } from './DataTable';
import Button from '@/components/ui/button/Button';

interface SafetyAmbassadorItem {
  id: string;
  curriculum: string;
  date: string;
  status: 'completed' | 'uncompleted';
  action: string;
}

const SafetyAmbassadorTable = () => {
  const columns: Column<SafetyAmbassadorItem>[] = [
    {
      label: 'Curriculum',
      key: 'curriculum',
      textAlign: 'left',
    },
    {
      label: 'Date',
      key: 'date',
    },
    {
      label: 'Status',
      key: 'status',
      render: (value: string) => (
        <Badge
          colorPalette={value === 'uncompleted' ? 'red' : 'green'}
          variant='surface'
        >
          {value}
        </Badge>
      ),
    },
    {
      label: 'Action',
      key: 'action',
      textAlign: 'center',
      render: (_, row) => (
        <Button
          size='xs'
          bg='primary'
          color='white'
          onClick={() => console.log(`Starting ${row.curriculum}`)}
        >
          Start
        </Button>
      ),
    },
  ];

  // 3. Sample Data
  const data: SafetyAmbassadorItem[] = [
    {
      id: '1',
      curriculum: 'Module 1',
      date: '2024-05-20',
      status: 'uncompleted',
      action: 'start',
    },
    {
      id: '2',
      curriculum: 'Module 2',
      date: '2024-05-22',
      status: 'uncompleted',
      action: 'start',
    },
    {
      id: '2',
      curriculum: 'Module 3',
      date: '2024-05-22',
      status: 'uncompleted',
      action: 'start',
    },
    {
      id: '2',
      curriculum: 'Exam',
      date: '2024-05-22',
      status: 'uncompleted',
      action: 'start',
    },
  ];

  return (
    <Box bg='textInverse' p={5}>
      <Heading mb={6} fontSize='lg' fontWeight='bold'>
        Become a Safety Ambassador
      </Heading>
      <DataTable columns={columns} data={data} />
    </Box>
  );
};

export default SafetyAmbassadorTable;
