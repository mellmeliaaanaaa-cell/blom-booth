'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/auth/supabase';

function getDeviceId() {
  let id = localStorage.getItem('bloom_device_id');
  if (!id) {
    id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('bloom_device_id', id);
  }
  return id;
}

export default function DeviceGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'ok' | 'blocked'>('checking');
  const [message, setMessage] = useState('Memeriksa akun...');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    async function check() {
      if (!supabase) { setMessage('Sistem akun belum dihubungkan.'); setStatus('blocked'); return; }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace(`/login?next=${encodeURIComponent(pathname)}`); return; }
      const deviceId = getDeviceId();
      const { data, error } = await supabase.rpc('claim_bloom_device', { p_device_id: deviceId });
      if (!active) return;
      if (error || data !== true) {
        setMessage('Akun ini sudah terdaftar pada perangkat lain. Hubungi admin Bloom Booth untuk bantuan.');
        setStatus('blocked');
      } else setStatus('ok');
    }
    check();
    return () => { active = false; };
  }, [pathname, router]);

  if (status === 'ok') return <>{children}</>;
  return <main className="mx-auto flex min-h-[65vh] max-w-xl items-center justify-center px-5 py-16"><section className="w-full rounded-[2rem] border-2 border-ink bg-white p-8 text-center shadow-pop"><div className="mb-3 text-4xl">🌷</div><h1 className="mb-3 text-2xl">{status === 'checking' ? 'Sebentar ya...' : 'Akses Bloom Booth'}</h1><p className="mb-6 text-ink/70">{message}</p>{status === 'blocked' && <div className="flex flex-wrap justify-center gap-3"><Link className="rounded-xl border-2 border-ink bg-sun px-5 py-3 font-bold" href="/login">Ke halaman login</Link><button className="rounded-xl border-2 border-ink px-5 py-3 font-bold" onClick={async () => { await supabase?.auth.signOut(); router.replace('/login'); }}>Keluar</button></div>}</section></main>;
}
