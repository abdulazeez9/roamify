import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';

interface QueryObject {
  queryKey: any[];
  queryFn: () => Promise<any>;
}

export async function PrefetchBoundary({
  queries,
  children,
}: {
  queries: QueryObject | QueryObject[];
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  const queryArray = Array.isArray(queries) ? queries : [queries];

  // Fetch everything in parallel on the server
  await Promise.all(
    queryArray.map((q) =>
      queryClient.prefetchQuery({ queryKey: q.queryKey, queryFn: q.queryFn })
    )
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
