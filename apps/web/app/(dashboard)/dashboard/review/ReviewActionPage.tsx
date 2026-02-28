'use client';
import React, { useState, useEffect } from 'react';
import {
  Button,
  VStack,
  Text,
  Textarea,
  Portal,
  Dialog,
  Field,
  RatingGroup,
} from '@chakra-ui/react';
import { useCreateReview, useUpdateReview } from '@/hooks';
import { CreateReviewDto, UpdateReviewDto } from '@zagotours/types';

interface ReviewModalProps {
  editingReview?: {
    id: string;
    content: string;
    rating: number;
  };
  onSuccess?: () => void;
}

export const ReviewActionComponent: React.FC<ReviewModalProps> = ({
  editingReview,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState<string>('');

  const createMutation = useCreateReview();
  const updateMutation = useUpdateReview();
  const isEditing = !!editingReview;

  // Sync state when opening/editing
  useEffect(() => {
    if (editingReview && open) {
      setRating(editingReview.rating);
      setContent(editingReview.content);
    } else if (!open) {
      setRating(5);
      setContent('');
    }
  }, [editingReview, open]);

  const handleSubmit = () => {
    if (isEditing) {
      const updateData: UpdateReviewDto = {
        content,
        rating,
      };

      updateMutation.mutate(
        { id: editingReview!.id, data: updateData },
        {
          onSuccess: () => {
            setOpen(false);
            onSuccess?.();
          },
        },
      );
    } else {
      const createData: CreateReviewDto = {
        content,
        rating,
      };

      createMutation.mutate(createData, {
        onSuccess: () => {
          setOpen(false);
          onSuccess?.();
        },
      });
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)} size='md'>
      <Dialog.Trigger asChild>
        <Button variant={isEditing ? 'ghost' : 'solid'} colorPalette='teal'>
          {isEditing ? 'Edit Review' : 'Write a Review'}
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {isEditing ? 'Update Your Review' : 'Submit Review'}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <VStack gap={6} align='stretch'>
                {/* Rating Section */}
                <Field.Root required>
                  <Field.Label>Rating</Field.Label>
                  <RatingGroup.Root
                    count={5}
                    value={rating}
                    onValueChange={(e) => setRating(e.value)}
                    colorPalette='yellow'
                  >
                    <RatingGroup.HiddenInput />
                    <RatingGroup.Control />
                  </RatingGroup.Root>
                </Field.Root>

                {/* Content Section */}
                <Field.Root required>
                  <Field.Label>Review Content</Field.Label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder='Tell us about your experience...'
                    rows={5}
                    autoresize
                  />
                  <Field.HelperText>
                    <Text textStyle='xs' color='fg.muted'>
                      {content.length}/1000 characters
                    </Text>
                  </Field.HelperText>
                </Field.Root>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer gap={3}>
              <Dialog.ActionTrigger asChild>
                <Button variant='outline'>Cancel</Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette='teal'
                onClick={handleSubmit}
                loading={createMutation.isPending || updateMutation.isPending}
                disabled={!content.trim()}
              >
                {isEditing ? 'Update Review' : 'Post Review'}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
