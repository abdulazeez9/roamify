import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';
import { eventKeys } from './query-keys';
import { notify } from '@/lib/toast';

// ============================================
// EVENT QUERIES
// ============================================

export function useEvents(filters?: any) {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: () => apiRequest(API_ENDPOINTS.EVENTS.LIST),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => apiRequest(API_ENDPOINTS.EVENTS.BY_ID(id)),
    enabled: !!id,
  });
}

export function useUpcomingEvents() {
  return useQuery({
    queryKey: eventKeys.upcoming(),
    queryFn: () => apiRequest(API_ENDPOINTS.EVENTS.UPCOMING),
  });
}

export function useMyEventBookings() {
  return useQuery({
    queryKey: eventKeys.myBookings(),
    queryFn: () => apiRequest(API_ENDPOINTS.EVENTS.MY_BOOKINGS),
  });
}

export function useEventAdminStats() {
  return useQuery({
    queryKey: eventKeys.adminStats(),
    queryFn: () => apiRequest(API_ENDPOINTS.EVENTS.ADMIN_STATS),
  });
}

// ============================================
// EVENT MUTATIONS
// ============================================

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiRequest(API_ENDPOINTS.EVENTS.CREATE, {
        method: 'POST',
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.upcoming() });
      notify('Event Created', 'success', 'Event has been created successfully');
    },
    onError: (error: any) => {
      notify('Creation Failed', 'error', 'Failed to create event');
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest(API_ENDPOINTS.EVENTS.UPDATE(id), {
        method: 'PUT',
        body: data,
      }),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: eventKeys.detail(id) });
      const previousData = queryClient.getQueryData(eventKeys.detail(id));

      queryClient.setQueryData(eventKeys.detail(id), (old: any) => ({
        ...old,
        ...data,
      }));

      return { previousData, id };
    },
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.upcoming() });
      notify('Event Updated', 'success', 'Event updated successfully');
    },
    onError: (error: any, { id }, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(eventKeys.detail(id), context.previousData);
      }
      notify('Update Failed', 'error', 'Failed to update event');
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(API_ENDPOINTS.EVENTS.DELETE(id), {
        method: 'DELETE',
      }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: eventKeys.lists() });
      const previousData = queryClient.getQueryData(eventKeys.lists());

      queryClient.setQueryData(eventKeys.lists(), (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((event: any) => event.id !== id),
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.upcoming() });
      notify('Event Deleted', 'success', 'Event deleted successfully');
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(eventKeys.lists(), context.previousData);
      }
      notify('Delete Failed', 'error', 'Failed to delete event');
    },
  });
}

export function useJoinEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(API_ENDPOINTS.EVENTS.JOIN(id), {
        method: 'POST',
      }),
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.myBookings() });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.upcoming() });
      notify(
        'Registration Successful',
        'success',
        'You have successfully registered for this event',
      );
    },
    onError: (error: any) => {
      notify('Registration Failed', 'error', 'Failed to register for event');
    },
  });
}

export function useCancelEventRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(API_ENDPOINTS.EVENTS.CANCEL_REGISTRATION(id), {
        method: 'POST',
      }),
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.myBookings() });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.upcoming() });
      notify(
        'Registration Cancelled',
        'info',
        'Your event registration has been cancelled',
      );
    },
    onError: (error: any) => {
      notify('Cancellation Failed', 'error', 'Failed to cancel registration');
    },
  });
}
