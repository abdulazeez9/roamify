import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';
import { planningCallKeys } from './query-keys';
import { notify } from '@/lib/toast';

// ============================================
// PLANNING CALL QUERIES
// ============================================

export function usePlanningCalls(filters?: any) {
  return useQuery({
    queryKey: planningCallKeys.list(filters),
    queryFn: () => apiRequest(API_ENDPOINTS.PLANNING_CALLS.LIST),
  });
}

export function usePlanningCall(id: string) {
  return useQuery({
    queryKey: planningCallKeys.detail(id),
    queryFn: () => apiRequest(API_ENDPOINTS.PLANNING_CALLS.BY_ID(id)),
    enabled: !!id,
  });
}

export function useUpcomingPlanningCalls() {
  return useQuery({
    queryKey: planningCallKeys.upcoming(),
    queryFn: () => apiRequest(API_ENDPOINTS.PLANNING_CALLS.UPCOMING),
  });
}

export function useMyPlanningCalls() {
  return useQuery({
    queryKey: planningCallKeys.myCalls(),
    queryFn: () => apiRequest(API_ENDPOINTS.PLANNING_CALLS.MY_CALLS),
  });
}

// ============================================
// PLANNING CALL MUTATIONS
// ============================================

export function useSchedulePlanningCall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiRequest(API_ENDPOINTS.PLANNING_CALLS.SCHEDULE, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planningCallKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planningCallKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: planningCallKeys.myCalls() });
      notify(
        'Call Scheduled',
        'success',
        'Your planning call has been scheduled successfully',
      );
    },
    onError: (error: any) => {
      notify('Scheduling Failed', 'error', 'Failed to schedule planning call');
    },
  });
}

export function useReschedulePlanningCall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest(API_ENDPOINTS.PLANNING_CALLS.RESCHEDULE(id), {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: planningCallKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: planningCallKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planningCallKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: planningCallKeys.myCalls() });
      notify(
        'Call Rescheduled',
        'success',
        'Planning call rescheduled successfully',
      );
    },
    onError: (error: any) => {
      notify(
        'Rescheduling Failed',
        'error',
        'Failed to reschedule planning call',
      );
    },
  });
}

export function useCancelPlanningCall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(API_ENDPOINTS.PLANNING_CALLS.CANCEL(id), {
        method: 'PUT',
      }),
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: planningCallKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: planningCallKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planningCallKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: planningCallKeys.myCalls() });
      notify('Call Cancelled', 'info', 'Planning call cancelled successfully');
    },
    onError: (error: any) => {
      notify('Cancellation Failed', 'error', 'Failed to cancel planning call');
    },
  });
}

export function useCompletePlanningCall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(API_ENDPOINTS.PLANNING_CALLS.COMPLETE(id), {
        method: 'PATCH',
      }),
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: planningCallKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: planningCallKeys.lists() });
      notify('Call Completed', 'success', 'Planning call marked as completed');
    },
    onError: (error: any) => {
      notify('Update Failed', 'error', 'Failed to mark call as completed');
    },
  });
}

export function useDeletePlanningCall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(API_ENDPOINTS.PLANNING_CALLS.DELETE(id), {
        method: 'DELETE',
      }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: planningCallKeys.lists() });
      const previousData = queryClient.getQueryData(planningCallKeys.lists());

      queryClient.setQueryData(planningCallKeys.lists(), (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((call: any) => call.id !== id),
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planningCallKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planningCallKeys.myCalls() });
      notify('Call Deleted', 'success', 'Planning call deleted successfully');
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          planningCallKeys.lists(),
          context.previousData,
        );
      }
      notify('Delete Failed', 'error', 'Failed to delete planning call');
    },
  });
}
