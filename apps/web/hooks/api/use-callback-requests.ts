import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';
import { callbackRequestKeys } from './query-keys';
import { notify } from '@/lib/toast';

// ============================================
// CALLBACK REQUEST QUERIES
// ============================================

export function useCallbackRequests(filters?: any) {
  return useQuery({
    queryKey: callbackRequestKeys.list(filters),
    queryFn: () => apiRequest(API_ENDPOINTS.CALLBACK_REQUESTS.LIST),
  });
}

export function useCallbackRequest(id: string) {
  return useQuery({
    queryKey: callbackRequestKeys.detail(id),
    queryFn: () => apiRequest(API_ENDPOINTS.CALLBACK_REQUESTS.BY_ID(id)),
    enabled: !!id,
  });
}

export function useMyCallbackRequests() {
  return useQuery({
    queryKey: callbackRequestKeys.myRequests(),
    queryFn: () => apiRequest(API_ENDPOINTS.CALLBACK_REQUESTS.MY_REQUESTS),
  });
}

export function useCallbackRequestsAssignedToMe() {
  return useQuery({
    queryKey: callbackRequestKeys.assignedToMe(),
    queryFn: () => apiRequest(API_ENDPOINTS.CALLBACK_REQUESTS.ASSIGNED_TO_ME),
  });
}

export function usePendingCallbackRequests() {
  return useQuery({
    queryKey: callbackRequestKeys.pending(),
    queryFn: () => apiRequest(API_ENDPOINTS.CALLBACK_REQUESTS.PENDING),
  });
}

// ============================================
// CALLBACK REQUEST MUTATIONS
// ============================================

export function useCreateCallbackRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiRequest(API_ENDPOINTS.CALLBACK_REQUESTS.CREATE, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: callbackRequestKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: callbackRequestKeys.myRequests(),
      });
      queryClient.invalidateQueries({
        queryKey: callbackRequestKeys.pending(),
      });
      notify(
        'Request Submitted',
        'success',
        'Your callback request has been submitted successfully',
      );
    },
    onError: (error: any) => {
      notify('Submission Failed', 'error', 'Failed to submit callback request');
    },
  });
}

export function useDeleteCallbackRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(API_ENDPOINTS.CALLBACK_REQUESTS.DELETE(id), {
        method: 'DELETE',
      }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: callbackRequestKeys.lists(),
      });
      const previousData = queryClient.getQueryData(
        callbackRequestKeys.lists(),
      );

      queryClient.setQueryData(callbackRequestKeys.lists(), (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((request: any) => request.id !== id),
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: callbackRequestKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: callbackRequestKeys.myRequests(),
      });
      notify(
        'Request Deleted',
        'success',
        'Callback request deleted successfully',
      );
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          callbackRequestKeys.lists(),
          context.previousData,
        );
      }
      notify('Delete Failed', 'error', 'Failed to delete callback request');
    },
  });
}
