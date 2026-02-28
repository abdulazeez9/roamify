import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';
import { tripRequestKeys } from './query-keys';
import { notify } from '@/lib/toast';

// ============================================
// TRIP REQUEST QUERIES
// ============================================

export function useTripRequests(filters?: any) {
  return useQuery({
    queryKey: tripRequestKeys.list(filters),
    queryFn: () => apiRequest(API_ENDPOINTS.TRIP_REQUESTS.LIST),
  });
}

export function useTripRequest(id: string) {
  return useQuery({
    queryKey: tripRequestKeys.detail(id),
    queryFn: () => apiRequest(API_ENDPOINTS.TRIP_REQUESTS.BY_ID(id)),
    enabled: !!id,
  });
}

export function useMyTripRequests() {
  return useQuery({
    queryKey: tripRequestKeys.myRequests(),
    queryFn: () => apiRequest(API_ENDPOINTS.TRIP_REQUESTS.MY_REQUESTS),
  });
}

export function useTripRequestsAssignedToMe() {
  return useQuery({
    queryKey: tripRequestKeys.assignedToMe(),
    queryFn: () => apiRequest(API_ENDPOINTS.TRIP_REQUESTS.ASSIGNED_TO_ME),
  });
}

export function useRecentTripRequests() {
  return useQuery({
    queryKey: tripRequestKeys.recent(),
    queryFn: () => apiRequest(API_ENDPOINTS.TRIP_REQUESTS.RECENT),
  });
}

// ============================================
// TRIP REQUEST MUTATIONS
// ============================================

export function useCreateTripRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiRequest(API_ENDPOINTS.TRIP_REQUESTS.CREATE, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripRequestKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripRequestKeys.myRequests() });
      queryClient.invalidateQueries({ queryKey: tripRequestKeys.recent() });
      notify(
        'Request Submitted',
        'success',
        'Your trip request has been submitted successfully',
      );
    },
    onError: (error: any) => {
      notify('Submission Failed', 'error', 'Failed to submit trip request');
    },
  });
}

export function useDeleteTripRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(API_ENDPOINTS.TRIP_REQUESTS.DELETE(id), {
        method: 'DELETE',
      }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: tripRequestKeys.lists() });
      const previousData = queryClient.getQueryData(tripRequestKeys.lists());

      queryClient.setQueryData(tripRequestKeys.lists(), (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((request: any) => request.id !== id),
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripRequestKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripRequestKeys.myRequests() });
      notify('Request Deleted', 'success', 'Trip request deleted successfully');
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(tripRequestKeys.lists(), context.previousData);
      }
      notify('Delete Failed', 'error', 'Failed to delete trip request');
    },
  });
}
