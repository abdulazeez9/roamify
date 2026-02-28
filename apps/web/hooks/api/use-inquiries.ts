import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';
import { inquiryKeys } from './query-keys';
import { notify } from '@/lib/toast';

// ============================================
// INQUIRY QUERIES
// ============================================

export function useInquiries(filters?: any) {
  return useQuery({
    queryKey: inquiryKeys.list(filters),
    queryFn: () => apiRequest(API_ENDPOINTS.INQUIRIES.LIST),
  });
}

export function useInquiry(id: string) {
  return useQuery({
    queryKey: inquiryKeys.detail(id),
    queryFn: () => apiRequest(API_ENDPOINTS.INQUIRIES.BY_ID(id)),
    enabled: !!id,
  });
}

export function useRecentInquiries() {
  return useQuery({
    queryKey: inquiryKeys.recent(),
    queryFn: () => apiRequest(API_ENDPOINTS.INQUIRIES.RECENT),
  });
}

// ============================================
// INQUIRY MUTATIONS
// ============================================

export function useCreateInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiRequest(API_ENDPOINTS.INQUIRIES.CREATE, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inquiryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inquiryKeys.recent() });
      notify(
        'Inquiry Submitted',
        'success',
        'Your inquiry has been submitted successfully',
      );
    },
    onError: (error: any) => {
      notify('Submission Failed', 'error', 'Failed to submit inquiry');
    },
  });
}

export function useDeleteInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(API_ENDPOINTS.INQUIRIES.DELETE(id), {
        method: 'DELETE',
      }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: inquiryKeys.lists() });
      const previousData = queryClient.getQueryData(inquiryKeys.lists());

      queryClient.setQueryData(inquiryKeys.lists(), (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((inquiry: any) => inquiry.id !== id),
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inquiryKeys.lists() });
      notify('Inquiry Deleted', 'success', 'Inquiry deleted successfully');
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(inquiryKeys.lists(), context.previousData);
      }
      notify('Delete Failed', 'error', 'Failed to delete inquiry');
    },
  });
}
