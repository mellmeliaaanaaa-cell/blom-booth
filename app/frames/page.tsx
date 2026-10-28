import type { Metadata } from 'next';
import FramesGallery from '@/components/frame/FramesGallery';

export const metadata: Metadata = { title: 'Galeri Frame — Bloom Booth' };

export default async function FramesPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const sp = await searchParams;
  return <FramesGallery initialCollection={sp.c} />;
}
