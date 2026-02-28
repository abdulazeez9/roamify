import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';
import { adventureKeys } from './query-keys';
import {
  AdventureDetailResponseDto,
  AdventureListQueryDto,
  CreateAdventureDto,
  PaginatedResponse,
  ReorderGalleryDto,
} from '@zagotours/types';
import { notify } from '@/lib/toast';

// ============================================
// ADVENTURE QUERIES
// ============================================

export function useAdventures(filters?: AdventureListQueryDto) {
  return useQuery<PaginatedResponse<AdventureDetailResponseDto>>({
    queryKey: adventureKeys.list(filters),
    queryFn: () => {
      let url = API_ENDPOINTS.ADVENTURES.LIST;

      if (filters) {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });

        const queryString = params.toString();

        if (queryString) {
          url = `${url}?${queryString}`;
        }
      }

      return apiRequest(url);
    },
  });
}

export function useAdventure(id: string) {
  return useQuery<{ data: AdventureDetailResponseDto }>({
    queryKey: adventureKeys.detail(id),
    queryFn: () => apiRequest(API_ENDPOINTS.ADVENTURES.BY_ID(id)),
    enabled: !!id,
  });
}

export function useAdventureTripTypeCounts() {
  return useQuery<Record<string, number>>({
    queryKey: adventureKeys.tripTypeCounts(),
    queryFn: () => apiRequest(API_ENDPOINTS.ADVENTURES.TRIP_TYPE_COUNTS),
  });
}

export function useItineraries(adventureId: string) {
  return useQuery({
    queryKey: adventureKeys.itineraries(adventureId),
    queryFn: () =>
      apiRequest(API_ENDPOINTS.ADVENTURES.ITINERARIES.LIST(adventureId)),
    enabled: !!adventureId,
  });
}

export function useGallery(adventureId: string) {
  return useQuery({
    queryKey: adventureKeys.gallery(adventureId),
    queryFn: () =>
      apiRequest(API_ENDPOINTS.ADVENTURES.GALLERY.LIST(adventureId)),
    enabled: !!adventureId,
  });
}

// ============================================
// ADVENTURE MUTATIONS
// ============================================

export function useCreateAdventure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiRequest(API_ENDPOINTS.ADVENTURES.CREATE, {
        method: 'POST',
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adventureKeys.lists() });
      notify('Adventure Added', 'success', 'The new tour is now live.');
    },
    onError: () => {
      notify('Creation Failed', 'error', 'Failed to create adventure');
    },
  });
}

export function useBulkCreateAdventures() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdventureDto[]) =>
      apiRequest(API_ENDPOINTS.ADVENTURES.BULK_CREATE, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adventureKeys.lists() });
    },
    onError: () => {
      notify('Creation Failed', 'error', 'Failed to create adventure');
    },
  });
}

export function useUpdateAdventure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest(API_ENDPOINTS.ADVENTURES.UPDATE(id), {
        method: 'PUT',
        body: data,
      }),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: adventureKeys.detail(id) });
      const previousData = queryClient.getQueryData(adventureKeys.detail(id));

      queryClient.setQueryData(adventureKeys.detail(id), (old: any) => ({
        ...old,
        ...data,
      }));

      return { previousData, id };
    },
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: adventureKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: adventureKeys.lists() });
      notify(
        'Adventure Updated',
        'success',
        'Adventure has been updated successfully',
      );
    },
    onError: (_error, { id }, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          adventureKeys.detail(id),
          context.previousData,
        );
      }
      notify('Update Failed', 'error', 'Failed to update adventure');
    },
  });
}

export function useDeleteAdventure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(API_ENDPOINTS.ADVENTURES.DELETE(id), {
        method: 'DELETE',
      }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: adventureKeys.lists() });
      const previousData = queryClient.getQueryData(adventureKeys.lists());

      queryClient.setQueryData(adventureKeys.lists(), (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((adventure: any) => adventure.id !== id),
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adventureKeys.lists() });
      notify('Adventure Deleted ', 'success', 'Adventure Deleted Successfully');
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(adventureKeys.lists(), context.previousData);
      }
      notify('Delete Failed', 'error', 'Failed to delete adventure');
    },
  });
}

export function useToggleLikeAdventure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(API_ENDPOINTS.ADVENTURES.TOGGLE_LIKE(id), {
        method: 'POST',
      }),
    onMutate: async (id) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: adventureKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: adventureKeys.lists() });

      // Snapshot previous values
      const previousDetail = queryClient.getQueryData(adventureKeys.detail(id));
      const previousLists = queryClient.getQueriesData({
        queryKey: adventureKeys.lists(),
      });

      // Optimistically update detail query
      queryClient.setQueryData(adventureKeys.detail(id), (old: any) => {
        if (!old?.data) return old;

        const currentLikesCount = old.data._count?.likes || 0;
        const isCurrentlyLiked = old.data.isLiked || false;

        return {
          ...old,
          data: {
            ...old.data,
            isLiked: !isCurrentlyLiked,
            _count: {
              ...old.data._count,
              likes: isCurrentlyLiked
                ? currentLikesCount - 1
                : currentLikesCount + 1,
            },
          },
        };
      });

      // Optimistically update all list queries
      queryClient.setQueriesData(
        { queryKey: adventureKeys.lists() },
        (old: any) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.map((adventure: any) => {
              if (adventure.id !== id) return adventure;

              const currentLikesCount = adventure._count?.likes || 0;
              const isCurrentlyLiked = adventure.isLiked || false;

              return {
                ...adventure,
                isLiked: !isCurrentlyLiked,
                _count: {
                  ...adventure._count,
                  likes: isCurrentlyLiked
                    ? currentLikesCount - 1
                    : currentLikesCount + 1,
                },
              };
            }),
          };
        },
      );

      return { previousDetail, previousLists, id };
    },
    onError: (_error, id, context) => {
      // Rollback detail query
      if (context?.previousDetail) {
        queryClient.setQueryData(
          adventureKeys.detail(id),
          context.previousDetail,
        );
      }

      // Rollback all list queries
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      notify('Error', 'error', 'Failed to update like status');
    },
    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({ queryKey: adventureKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: adventureKeys.lists() });
    },
  });
}

// ============================================
// ITINERARY MUTATIONS
// ============================================

export function useCreateItinerary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ adventureId, data }: { adventureId: string; data: any }) =>
      apiRequest(API_ENDPOINTS.ADVENTURES.ITINERARIES.CREATE(adventureId), {
        method: 'POST',
        body: data,
      }),
    onSuccess: (_result, { adventureId, data }) => {
      const dayNumber = data.get('dayNumber');
      queryClient.invalidateQueries({
        queryKey: adventureKeys.itineraries(adventureId),
      });
      notify(
        'Itinerary Created',
        'success',
        `Day ${dayNumber} has been added successfully`,
      );
    },
    onError: () => {
      notify('Creation Failed', 'error', 'Failed to add itinerary');
    },
  });
}

export function useBulkCreateItineraries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      adventureId,
      itineraries,
    }: {
      adventureId: string;
      itineraries: FormData;
    }) =>
      apiRequest(
        API_ENDPOINTS.ADVENTURES.ITINERARIES.BULK_CREATE(adventureId),
        {
          method: 'POST',
          body: itineraries,
        },
      ),
    onSuccess: (_result, { adventureId }) => {
      queryClient.invalidateQueries({
        queryKey: adventureKeys.itineraries(adventureId),
      });
    },
    onError: () => {
      notify('Creation Failed', 'error', 'Failed to add itineraries');
    },
  });
}

export function useUpdateItinerary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itineraryId,
      data,
      adventureId,
    }: {
      itineraryId: string;
      data: any;
      adventureId: string;
    }) =>
      apiRequest(API_ENDPOINTS.ADVENTURES.ITINERARIES.UPDATE(itineraryId), {
        method: 'PATCH',
        body: data,
      }),
    onSuccess: (_result, { adventureId, data }) => {
      const dayNumber = data.get('dayNumber');

      queryClient.invalidateQueries({
        queryKey: adventureKeys.itineraries(adventureId),
      });

      queryClient.invalidateQueries({
        queryKey: adventureKeys.detail(adventureId),
      });
      notify(
        'Itinerary Updated',
        'success',
        `Day ${dayNumber} has been updated successfully`,
      );
    },
    onError: () => {
      notify('Update Failed', 'error', 'Failed to update itinerary');
    },
  });
}

export function useDeleteItinerary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itineraryId,
      adventureId,
      dayNumber,
    }: {
      itineraryId: string;
      adventureId: string;
      dayNumber?: number;
    }) =>
      apiRequest(API_ENDPOINTS.ADVENTURES.ITINERARIES.DELETE(itineraryId), {
        method: 'DELETE',
      }),
    onSuccess: (_result, { adventureId, dayNumber }) => {
      queryClient.invalidateQueries({
        queryKey: adventureKeys.itineraries(adventureId),
      });
      notify(
        'Itinerary Deleted',
        'success',
        `Day ${dayNumber} has been removed`,
      );
    },
    onError: () => {
      notify('Delete Failed', 'error', 'Failed to remove itinerary');
    },
  });
}

// ============================================
// GALLERY MUTATIONS
// ============================================

export function useCreateGalleryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ adventureId, data }: { adventureId: string; data: any }) =>
      apiRequest(API_ENDPOINTS.ADVENTURES.GALLERY.CREATE(adventureId), {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (_result, { adventureId }) => {
      queryClient.invalidateQueries({
        queryKey: adventureKeys.gallery(adventureId),
      });
      notify('Upload Image', 'success', 'Added gallery image');
    },
    onError: () => {
      notify('Upload Failed', 'error', 'Failed to add gallery image');
    },
  });
}

export function useBulkUploadGallery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      adventureId,
      files,
      altTexts,
    }: {
      adventureId: string;
      files: File[];
      altTexts?: string[];
    }) => {
      const formData = new FormData();

      files.forEach((file, index) => {
        formData.append('media', file);

        formData.append(`mediaTypes[${index}]`, 'IMAGE');
        if (altTexts?.[index]) {
          formData.append(`altTexts[${index}]`, altTexts[index]);
        }
      });

      return apiRequest(
        API_ENDPOINTS.ADVENTURES.GALLERY.BULK_UPLOAD(adventureId),
        {
          method: 'POST',
          body: formData,
        },
      );
    },
    onSuccess: (_result, { adventureId }) => {
      queryClient.invalidateQueries({
        queryKey: adventureKeys.gallery(adventureId),
      });
    },
    onError: () => {
      notify('Upload Failed', 'error', 'Failed to upload gallery images');
    },
  });
}

export function useUpdateGalleryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      galleryId,
      data,
      adventureId,
    }: {
      galleryId: string;
      data: any;
      adventureId: string;
    }) =>
      apiRequest(API_ENDPOINTS.ADVENTURES.GALLERY.UPDATE(galleryId), {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (_result, { adventureId }) => {
      queryClient.invalidateQueries({
        queryKey: adventureKeys.gallery(adventureId),
      });
      notify('Update Gallery', 'success', 'Update successful');
    },
    onError: () => {
      notify('Update Failed', 'error', 'Failed to update gallery image');
    },
  });
}

export function useReorderGallery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderGalleryDto) =>
      apiRequest(API_ENDPOINTS.ADVENTURES.GALLERY.REORDER, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adventureKeys.all });
    },
    onError: () => {
      notify('Reorder Failed', 'error', 'Failed to save gallery sequence');
    },
  });
}

export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      galleryId,
      adventureId,
    }: {
      galleryId: string;
      adventureId: string;
    }) =>
      apiRequest(API_ENDPOINTS.ADVENTURES.GALLERY.DELETE(galleryId), {
        method: 'DELETE',
      }),
    onSuccess: (_result, { adventureId }) => {
      queryClient.invalidateQueries({
        queryKey: adventureKeys.gallery(adventureId),
      });
      notify('Deleted', 'success', 'Image Deleted');
    },
    onError: () => {
      notify('Delete Failed', 'error', 'Failed to remove gallery image');
    },
  });
}
