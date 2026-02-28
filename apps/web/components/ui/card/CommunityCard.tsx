import { Card, Text, Stack } from '@chakra-ui/react';
import Button from '../button/Button';
import { AppLink } from '../link/AppLink';

export const CommunityCard = () => {
  return (
    <Card.Root maxW='sm' variant='outline' overflow='hidden' maxH='200px'>
      <Card.Body>
        <Stack gap='1'>
          <Card.Title>
            <Text fontSize='md' fontWeight='bold'>
              Community Activity & Feedback
            </Text>
          </Card.Title>
          <Card.Description>
            <Text as='span' fontSize='sm' color='gray.600' lineHeight='tall'>
              Share feedbacks, ask questions, and connect with other adventure
              lovers.
            </Text>
          </Card.Description>
        </Stack>
      </Card.Body>

      <Card.Footer>
        <AppLink href='/posts'>
          <Button bg='primary' color='white' width='full' size='sm'>
            Go to community
          </Button>
        </AppLink>
      </Card.Footer>
    </Card.Root>
  );
};
