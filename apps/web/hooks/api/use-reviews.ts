import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';
import { reviewKeys } from './query-keys';
import { notify } from '@/lib/toast';

// ============================================
// REVIEW QUERIES
// ============================================

export function useReviews(filters?: any) {
  return useQuery({
    queryKey: reviewKeys.list(filters),
    queryFn: () => apiRequest(API_ENDPOINTS.REVIEWS.LIST),
  });
}

export function useReview(id: string) {
  return useQuery({
    queryKey: reviewKeys.detail(id),
    queryFn: () => apiRequest(API_ENDPOINTS.REVIEWS.BY_ID(id)),
    enabled: !!id,
  });
}

export function useFeaturedReviews() {
  return useQuery({
    queryKey: reviewKeys.featured(),
    queryFn: () => apiRequest(API_ENDPOINTS.REVIEWS.FEATURED),
  });
}

export function useAverageRating() {
  return useQuery({
    queryKey: reviewKeys.averageRating(),
    queryFn: () => apiRequest(API_ENDPOINTS.REVIEWS.AVERAGE_RATING),
  });
}

export function useMyReviews() {
  return useQuery({
    queryKey: reviewKeys.myReviews(),
    queryFn: () => apiRequest(API_ENDPOINTS.REVIEWS.MY_REVIEWS),
  });
}

// ============================================
// REVIEW MUTATIONS
// ============================================

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiRequest(API_ENDPOINTS.REVIEWS.CREATE, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.myReviews() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.averageRating() });
      notify(
        'Review Created',
        'success',
        'Your review has been submitted successfully',
      );
    },
    onError: (error: any) => {
      notify('Submission Failed', 'error', 'Failed to submit review');
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest(API_ENDPOINTS.REVIEWS.UPDATE(id), {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: reviewKeys.detail(id) });
      const previousData = queryClient.getQueryData(reviewKeys.detail(id));

      queryClient.setQueryData(reviewKeys.detail(id), (old: any) => ({
        ...old,
        ...data,
      }));

      return { previousData, id };
    },
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.myReviews() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.averageRating() });
      notify('Review Updated', 'success', 'Review updated successfully');
    },
    onError: (error: any, { id }, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(reviewKeys.detail(id), context.previousData);
      }
      notify('Update Failed', 'error', 'Failed to update review');
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(API_ENDPOINTS.REVIEWS.DELETE(id), {
        method: 'DELETE',
      }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: reviewKeys.lists() });
      const previousData = queryClient.getQueryData(reviewKeys.lists());

      queryClient.setQueryData(reviewKeys.lists(), (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((review: any) => review.id !== id),
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.myReviews() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.averageRating() });
      notify('Review Deleted', 'success', 'Review deleted successfully');
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(reviewKeys.lists(), context.previousData);
      }
      notify('Delete Failed', 'error', 'Failed to delete review');
    },
  });
}

export function useToggleFeaturedReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(API_ENDPOINTS.REVIEWS.TOGGLE_FEATURED(id), {
        method: 'PATCH',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.featured() });
      notify(
        'Review Updated',
        'success',
        'Featured status toggled successfully',
      );
    },
    onError: (error: any) => {
      notify('Update Failed', 'error', 'Failed to toggle featured status');
    },
  });
}
