import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';
import { platformSettingsKeys } from './query-keys';
import { notify } from '@/lib/toast';

export function usePlatformSettings() {
  return useQuery({
    queryKey: platformSettingsKeys.detail(),
    queryFn: () => apiRequest(API_ENDPOINTS.PLATFORM_SETTINGS.GET),
  });
}

export function useCreatePlatformSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) =>
      apiRequest(API_ENDPOINTS.PLATFORM_SETTINGS.CREATE, {
        method: 'POST',
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: platformSettingsKeys.detail(),
      });
      notify(
        'Settings Created',
        'success',
        'Platform settings have been created',
      );
    },
    onError: () => {
      notify('Creation Failed', 'error', 'Failed to create platform settings');
    },
  });
}

export function useUpdatePlatformSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) =>
      apiRequest(API_ENDPOINTS.PLATFORM_SETTINGS.UPDATE, {
        method: 'PUT',
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: platformSettingsKeys.detail(),
      });
      notify(
        'Settings Updated',
        'success',
        'Platform settings have been updated',
      );
    },
    onError: () => {
      notify('Update Failed', 'error', 'Failed to update platform settings');
    },
  });
}
