'use client';

import {
  Dialog,
  IconButton,
  Portal,
  Select,
  createListCollection,
} from '@chakra-ui/react';
import { Input, Stack } from '@chakra-ui/react';
import Button from '@/components/ui/button/Button';
import { useState } from 'react';
import { X } from 'lucide-react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useCreateCallbackRequest } from '@/hooks';

interface TripRequestCallbackDialogProps {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  tripRequestId?: string;
}

const timeSlots = createListCollection({
  items: [
    { label: 'Morning (8AM - 12PM)', value: 'morning' },
    { label: 'Afternoon (12PM - 4PM)', value: 'afternoon' },
    { label: 'Evening (4PM - 8PM)', value: 'evening' },
    { label: 'Anytime', value: 'anytime' },
  ],
});

export const TripRequestCallbackDialog = ({
  open,
  onOpenChange,
  tripRequestId,
}: TripRequestCallbackDialogProps) => {
  const { mutate: createCallbackRequest, isPending } =
    useCreateCallbackRequest();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+234',
    bestTime: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      bestTime: formData.bestTime,
    };

    // Include tripRequestId if provided
    if (tripRequestId) {
      payload.tripRequestId = tripRequestId;
    }

    createCallbackRequest(payload, {
      onSuccess: () => {
        // Reset form and close dialog
        setFormData({
          name: '',
          email: '',
          phone: '+234',
          bestTime: '',
        });
        onOpenChange({ open: false });
      },
    });
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      phone: '+234',
      bestTime: '',
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p={{ base: 4, md: 6 }}>
            <Dialog.Header display='flex' justifyContent='center'>
              <Dialog.Title fontSize='2xl' color='primary' fontWeight='bold'>
                Request Callback
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body spaceY='4'>
              <form onSubmit={handleSubmit} id='callback-request-form'>
                <Stack gap={4}>
                  <Stack gap={2}>
                    <label htmlFor='name'>Name</label>
                    <Input
                      id='name'
                      name='name'
                      placeholder='Enter your full name'
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Stack>

                  <Stack gap={2}>
                    <label htmlFor='email'>Email</label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      placeholder='Enter your email address'
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Stack>

                  <Stack gap={2}>
                    <label htmlFor='phone'>Phone Number</label>
                    <PhoneInput
                      defaultCountry='ng'
                      value={formData.phone}
                      onChange={(phone) =>
                        setFormData((prev) => ({ ...prev, phone }))
                      }
                      inputStyle={{
                        width: '100%',
                        height: '40px',
                        fontSize: '16px',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                      }}
                      countrySelectorStyleProps={{
                        buttonStyle: {
                          height: '40px',
                          borderRadius: '6px',
                          border: '1px solid #E2E8F0',
                        },
                      }}
                    />
                  </Stack>

                  <Stack gap={2}>
                    <Select.Root
                      collection={timeSlots}
                      value={formData.bestTime ? [formData.bestTime] : []}
                      onValueChange={(details) => {
                        setFormData((prev) => ({
                          ...prev,
                          bestTime: details.value[0] || '',
                        }));
                      }}
                      required
                    >
                      <Select.Label>Best Time to Call</Select.Label>
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder='Select preferred time' />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                        <Select.Content>
                          {timeSlots.items.map((timeSlot) => (
                            <Select.Item item={timeSlot} key={timeSlot.value}>
                              {timeSlot.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  </Stack>
                </Stack>
              </form>
            </Dialog.Body>

            <Dialog.Footer gap={3}>
              <Dialog.CloseTrigger asChild>
                <IconButton
                  aria-label='Close dialog'
                  variant='outline'
                  onClick={handleCancel}
                  size='md'
                >
                  <X size={20} />
                </IconButton>
              </Dialog.CloseTrigger>

              <Button
                width='full'
                bg='primary'
                type='submit'
                form='callback-request-form'
                loading={isPending}
                disabled={isPending}
              >
                {isPending ? 'Submitting...' : 'Submit Request'}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
