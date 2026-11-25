import DeviceGate from '@/components/auth/DeviceGate';
import type { Metadata } from 'next';
import BoothApp from '@/components/booth/BoothApp';

export const metadata: Metadata = { title: 'Studio Foto — Bloom Booth' };

export default async function BoothPage({
  searchParams,
}: {
  searchParams: Promise<{ frame?: string; mode?: string }>;
}) {
  const sp = await searchParams;
  return <DeviceGate><BoothApp initialFrameId={sp.frame} initialMode={sp.mode} /></DeviceGate>;
}
