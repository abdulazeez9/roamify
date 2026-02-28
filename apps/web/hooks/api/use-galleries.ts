import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';
import { galleryKeys } from './query-keys';
import { notify } from '@/lib/toast';

// ============================================
// GALLERY QUERIES
// ============================================

export function useGalleries(filters?: any) {
  const queryParams = new URLSearchParams(filters).toString();
  const url = queryParams
    ? `${API_ENDPOINTS.PLATFORM_GALLERIES.LIST}?${queryParams}`
    : API_ENDPOINTS.PLATFORM_GALLERIES.LIST;

  return useQuery({
    queryKey: galleryKeys.list(filters),
    queryFn: () => apiRequest(url),
  });
}

export function useGalleryItem(id: string) {
  return useQuery({
    queryKey: galleryKeys.detail(id),
    queryFn: () => apiRequest(API_ENDPOINTS.PLATFORM_GALLERIES.UPDATE(id)),
    enabled: !!id,
  });
}

// ============================================
// GALLERY MUTATIONS
// ============================================

export function useCreateGallery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData | any) =>
      apiRequest(API_ENDPOINTS.PLATFORM_GALLERIES.CREATE, {
        method: 'POST',
        // Don't stringify if it's FormData for file uploads
        body: data instanceof FormData ? data : JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      notify(
        'Media Added',
        'success',
        'Image has been added to the gallery successfully',
      );
    },
    onError: (error: any) => {
      notify('Upload Failed', 'error', 'Failed to upload media');
    },
  });
}

export function useUpdateGallery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData | any }) =>
      apiRequest(API_ENDPOINTS.PLATFORM_GALLERIES.UPDATE(id), {
        method: 'PATCH',
        body: data instanceof FormData ? data : JSON.stringify(data),
      }),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.detail(id) });
      notify('Gallery Updated', 'success', 'Gallery item updated successfully');
    },
    onError: (error: any) => {
      notify('Update Failed', 'error', 'Failed to update gallery item');
    },
  });
}

export function useDeleteGallery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(API_ENDPOINTS.PLATFORM_GALLERIES.DELETE(id), {
        method: 'DELETE',
      }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: galleryKeys.lists() });
      const previousData = queryClient.getQueryData(galleryKeys.lists());

      // Optimistic Update
      queryClient.setQueryData(galleryKeys.lists(), (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((item: any) => item.id !== id),
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      notify(
        'Item Deleted',
        'success',
        'Media removed from gallery successfully',
      );
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(galleryKeys.lists(), context.previousData);
      }
      notify('Delete Failed', 'error', 'Failed to remove media');
    },
  });
}
