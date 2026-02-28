'use client';

import { EventDetailPage } from '@/components/event/EventDetail';
import { useEvent } from '@/hooks';
import { useParams } from 'next/navigation';
import { ErrorState } from '@/components/ui/ErrorState';
import EventDetailPageSkeleton from '@/components/event/EventDetailPageSkeleton';

export default function EventDetails() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, isError, error } = useEvent(id);
  const event = data?.data;

  if (isError) return <ErrorState message={error?.message} />;

  return isLoading ? (
    <EventDetailPageSkeleton />
  ) : (
    <EventDetailPage event={event} />
  );
}
