'use client';

import {
  Dialog,
  IconButton,
  Portal,
  Stack,
  Select,
  createListCollection,
} from '@chakra-ui/react';
import { Input, Textarea } from '@chakra-ui/react';
import Button from '@/components/ui/button/Button';
import { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateTripRequest } from '@/hooks';
import { TripType, TripTypeLabels } from '@zagotours/types';

interface TripRequestDialogProps {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
}

// Create collection from TripTypeLabels
const tripTypeCollection = createListCollection({
  items: Object.entries(TripTypeLabels).map(([value, label]) => ({
    label,
    value,
  })),
});

export const TripRequestDialog = ({
  open,
  onOpenChange,
}: TripRequestDialogProps) => {
  const { mutate: createTripRequest, isPending } = useCreateTripRequest();

  const [formData, setFormData] = useState({
    tripType: '',
    destination: '',
    date: '',
    preferences: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createTripRequest(
      {
        tripType: formData.tripType as TripType,
        destination: formData.destination,
        date: formData.date,
        preferences: formData.preferences || undefined,
      },
      {
        onSuccess: () => {
          // Reset form and close dialog
          setFormData({
            tripType: '',
            destination: '',
            date: '',
            preferences: '',
          });
          onOpenChange({ open: false });
        },
      },
    );
  };

  const handleCancel = () => {
    setFormData({
      tripType: '',
      destination: '',
      date: '',
      preferences: '',
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p={{ base: 1, md: 6 }}>
            <Dialog.Header>
              <Dialog.Title
                width='full'
                fontSize='2xl'
                color='primary'
                fontWeight='bold'
                textAlign='center'
                mt={10}
              >
                Request a Trip
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body spaceY='4'>
              <form onSubmit={handleSubmit} id='trip-request-form'>
                <Stack gap={4}>
                  <Stack gap={2}>
                    <Select.Root
                      collection={tripTypeCollection}
                      value={formData.tripType ? [formData.tripType] : []}
                      onValueChange={(details) => {
                        setFormData((prev) => ({
                          ...prev,
                          tripType: details.value[0] || '',
                        }));
                      }}
                      required
                    >
                      <Select.Label>Trip Type</Select.Label>
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder='Select trip type' />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                        <Select.Content>
                          {tripTypeCollection.items.map((tripType) => (
                            <Select.Item item={tripType} key={tripType.value}>
                              {tripType.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  </Stack>

                  <Stack gap={2}>
                    <label htmlFor='destination'>Destination</label>
                    <Input
                      id='destination'
                      name='destination'
                      placeholder='Where would you like to go?'
                      value={formData.destination}
                      onChange={handleInputChange}
                      required
                    />
                  </Stack>

                  <Stack gap={2}>
                    <label htmlFor='date'>Date</label>
                    <Input
                      id='date'
                      name='date'
                      type='date'
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </Stack>

                  <Stack gap={2}>
                    <label htmlFor='preferences'>Preferences</label>
                    <Textarea
                      id='preferences'
                      name='preferences'
                      placeholder='Any special requests or preferences?'
                      value={formData.preferences}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </Stack>
                </Stack>
              </form>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <IconButton
                  aria-label='Close dialog'
                  variant='outline'
                  onClick={handleCancel}
                >
                  <X size={48} />
                </IconButton>
              </Dialog.CloseTrigger>

              <Button
                width='full'
                bg='primary'
                type='submit'
                form='trip-request-form'
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
