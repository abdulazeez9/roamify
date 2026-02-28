import AdventureDetailPage from '@/components/adventure/AdventureDetail';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdventureDetails({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return <AdventureDetailPage adventureId={id} />;
}
