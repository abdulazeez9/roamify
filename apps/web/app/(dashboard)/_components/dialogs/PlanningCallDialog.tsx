'use client';

import { useState } from 'react';
import { Dialog, Portal, Stack, Input, Text, VStack } from '@chakra-ui/react';
import Button from '@/components/ui/button/Button';
import { useSchedulePlanningCall } from '@/hooks';

interface PlanningCallDialogProps {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
}

export function PlanningCallDialog({
  open,
  onOpenChange,
}: PlanningCallDialogProps) {
  const { mutate: schedulePlanningCall, isPending } = useSchedulePlanningCall();

  const [formData, setFormData] = useState({
    startDate: '',
    startTime: '',
    endTime: '',
    meetingLink: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const startDateTime = new Date(
      `${formData.startDate}T${formData.startTime}`,
    );
    let endDateTime;
    if (formData.endTime) {
      endDateTime = new Date(`${formData.startDate}T${formData.endTime}`);
    }

    const payload = {
      startTime: startDateTime.toISOString(),
      endTime: endDateTime?.toISOString(),
      meetingLink: formData.meetingLink || undefined,
    };

    schedulePlanningCall(payload, {
      onSuccess: () => {
        setFormData({
          startDate: '',
          startTime: '',
          endTime: '',
          meetingLink: '',
        });
        onOpenChange({ open: false });
      },
    });
  };

  const handleCancel = () => {
    setFormData({
      startDate: '',
      startTime: '',
      endTime: '',
      meetingLink: '',
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} size='lg'>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p={{ base: 4, md: 6 }}>
            <Dialog.Header>
              <Dialog.Title fontSize='2xl' color='primary' fontWeight='bold'>
                Schedule a Planning Call
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <form onSubmit={handleSubmit} id='planning-call-form'>
                <VStack gap={4} align='stretch'>
                  <Text fontSize='sm' color='gray.600'>
                    Book a one-on-one planning call with our travel experts to
                    discuss your adventure plans.
                  </Text>

                  <Stack gap={2}>
                    <label htmlFor='startDate' style={{ fontWeight: 'medium' }}>
                      Call Date
                    </label>
                    <Input
                      id='startDate'
                      type='date'
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      min={today}
                      required
                    />
                  </Stack>

                  <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                    <Stack gap={2} flex={1}>
                      <label htmlFor='startTime'>Start Time</label>
                      <Input
                        id='startTime'
                        type='time'
                        value={formData.startTime}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            startTime: e.target.value,
                          }))
                        }
                        required
                      />
                    </Stack>

                    <Stack gap={2} flex={1}>
                      <label htmlFor='endTime'>End Time (Optional)</label>
                      <Input
                        id='endTime'
                        type='time'
                        value={formData.endTime}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            endTime: e.target.value,
                          }))
                        }
                      />
                    </Stack>
                  </Stack>

                  <Stack gap={2}>
                    <label htmlFor='meetingLink'>Meeting Link (Optional)</label>
                    <Input
                      id='meetingLink'
                      type='url'
                      placeholder='https://meet.google.com/...'
                      value={formData.meetingLink}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          meetingLink: e.target.value,
                        }))
                      }
                    />
                  </Stack>
                </VStack>
              </form>
            </Dialog.Body>

            <Dialog.Footer gap={3}>
              <Dialog.CloseTrigger asChild>
                <Button variant='outline' onClick={handleCancel} type='button'>
                  Cancel
                </Button>
              </Dialog.CloseTrigger>
              <Button
                bg='primary'
                type='submit'
                form='planning-call-form'
                loading={isPending}
                disabled={isPending}
              >
                Schedule Call
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
