'use client';

import { useState, useEffect } from 'react';
import { Dialog, Portal, Stack, Input, Text, VStack } from '@chakra-ui/react';
import Button from '@/components/ui/button/Button';
import { useReschedulePlanningCall } from '@/hooks';

interface ReschedulePlanningCallDialogProps {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  callId: string;
  currentStartTime?: Date | string;
  currentEndTime?: Date | string;
  currentMeetingLink?: string;
}

export function ReschedulePlanningCallDialog({
  open,
  onOpenChange,
  callId,
  currentStartTime,
  currentEndTime,
  currentMeetingLink,
}: ReschedulePlanningCallDialogProps) {
  const { mutate: reschedulePlanningCall, isPending } =
    useReschedulePlanningCall();

  const [formData, setFormData] = useState({
    startDate: '',
    startTime: '',
    endTime: '',
    meetingLink: '',
  });

  useEffect(() => {
    if (open && currentStartTime) {
      const start = new Date(currentStartTime);
      const newFormData = {
        startDate: start.toISOString().split('T')[0] || '',
        startTime: start.toTimeString().slice(0, 5),
        endTime: '',
        meetingLink: currentMeetingLink || '',
      };

      if (currentEndTime) {
        const end = new Date(currentEndTime);
        newFormData.endTime = end.toTimeString().slice(0, 5);
      }

      setFormData(newFormData);
    }
  }, [open, currentStartTime, currentEndTime, currentMeetingLink]);

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

    reschedulePlanningCall(
      { id: callId, data: payload },
      {
        onSuccess: () => {
          onOpenChange({ open: false });
        },
      },
    );
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
                Reschedule Planning Call
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <form onSubmit={handleSubmit} id='reschedule-form'>
                <VStack gap={4} align='stretch'>
                  <Text fontSize='sm' color='gray.600'>
                    Select a new date and time for your planning call.
                  </Text>

                  <Stack gap={2}>
                    <label htmlFor='newDate'>New Date</label>
                    <Input
                      id='newDate'
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
                      <label htmlFor='reschedStart'>Start Time</label>
                      <Input
                        id='reschedStart'
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
                      <label htmlFor='reschedEnd'>End Time (Optional)</label>
                      <Input
                        id='reschedEnd'
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
                    <label htmlFor='reschedLink'>Meeting Link (Optional)</label>
                    <Input
                      id='reschedLink'
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
                <Button variant='outline' type='button'>
                  Cancel
                </Button>
              </Dialog.CloseTrigger>
              <Button
                bg='primary'
                type='submit'
                form='reschedule-form'
                loading={isPending}
                disabled={isPending}
              >
                Reschedule Call
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
