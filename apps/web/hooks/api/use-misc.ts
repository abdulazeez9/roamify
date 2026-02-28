import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';
import { dashboardKeys } from './query-keys';

// ============================================
// DASHBOARD QUERIES
// ============================================

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => apiRequest(API_ENDPOINTS.DASHBOARD.STATS),
  });
}
