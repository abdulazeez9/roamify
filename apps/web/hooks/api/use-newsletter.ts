import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';
import { newsletterKeys } from './query-keys';
import { notify } from '@/lib/toast';

// ============================================
// NEWSLETTER QUERIES (Admin Only)
// ============================================

export function useNewsletterSubscribers() {
  return useQuery({
    queryKey: newsletterKeys.list(),
    queryFn: () => apiRequest(API_ENDPOINTS.NEWSLETTER.LIST),
  });
}

// ============================================
// NEWSLETTER MUTATIONS
// ============================================

export function useSubscribeToNewsletter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) =>
      apiRequest(API_ENDPOINTS.NEWSLETTER.SUBSCRIBE, {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.list() });
      notify(
        'Success!',
        'success',
        'You have successfully joined the movement.',
      );
    },
    onError: (error: any) => {
      notify(
        'Subscription Failed',
        'error',
        'Something went wrong. Please try again.',
      );
    },
  });
}
