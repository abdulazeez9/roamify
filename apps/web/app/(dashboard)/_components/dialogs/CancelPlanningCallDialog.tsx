'use client';

import { Dialog, Portal, Text, VStack, Icon } from '@chakra-ui/react';
import Button from '@/components/ui/button/Button';
import { useCancelPlanningCall } from '@/hooks';
import { AlertTriangle } from 'lucide-react';

interface CancelPlanningCallDialogProps {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  callId: string;
  startTime?: Date | string;
}

export function CancelPlanningCallDialog({
  open,
  onOpenChange,
  callId,
  startTime,
}: CancelPlanningCallDialogProps) {
  const { mutate: cancelPlanningCall, isPending } = useCancelPlanningCall();

  const handleCancelAction = () => {
    cancelPlanningCall(callId, {
      onSuccess: () => {
        onOpenChange({ open: false });
      },
    });
  };

  const formattedDate = startTime
    ? new Date(startTime).toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
      })
    : '';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} size='md'>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p={{ base: 4, md: 6 }}>
            <Dialog.Header>
              <Dialog.Title
                fontSize='2xl'
                color='red.600'
                fontWeight='bold'
                textAlign='center'
              >
                Cancel Planning Call
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <VStack gap={4} align='center'>
                <Icon as={AlertTriangle} boxSize={12} color='orange.500' />

                <Text textAlign='center' fontSize='lg' fontWeight='medium'>
                  Are you sure you want to cancel this call?
                </Text>

                {formattedDate && (
                  <Text textAlign='center' color='gray.600'>
                    Scheduled for: <strong>{formattedDate}</strong>
                  </Text>
                )}

                <Text fontSize='sm' color='gray.500' textAlign='center'>
                  This action cannot be undone. You can always schedule a new
                  call later.
                </Text>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer gap={3}>
              <Dialog.CloseTrigger asChild>
                <Button variant='outline' type='button' width='full'>
                  Keep Call
                </Button>
              </Dialog.CloseTrigger>
              <Button
                colorPalette='red'
                bg='red.600'
                color='white'
                onClick={handleCancelAction}
                loading={isPending}
                disabled={isPending}
                width='full'
              >
                Cancel Call
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
