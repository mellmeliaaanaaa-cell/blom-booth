import type { Metadata } from 'next';
import BoothApp from '@/components/booth/BoothApp';

export const metadata: Metadata = { title: 'Studio Foto — Bloom Booth' };

export default async function BoothPage({
  searchParams,
}: {
  searchParams: Promise<{ frame?: string; mode?: string }>;
}) {
  const sp = await searchParams;
  return <BoothApp initialFrameId={sp.frame} initialMode={sp.mode} />;
}
