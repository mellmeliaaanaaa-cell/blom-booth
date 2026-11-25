'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/auth/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useSearchParams();

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setBusy(true);
    if (!supabase) { setError('Sistem login belum dihubungkan oleh admin.'); setBusy(false); return; }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (signInError) { setError('Email atau password salah. Periksa kembali akun dari admin.'); setBusy(false); return; }
    const destination = params.get('next');
    router.replace(destination?.startsWith('/') ? destination : '/booth');
    router.refresh();
  }

  return <main className="mx-auto flex min-h-[75vh] max-w-6xl items-center justify-center px-4 py-12"><div className="grid w-full max-w-4xl overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-pop md:grid-cols-2"><div className="flex flex-col justify-center bg-[#fff0f3] p-8 md:p-12"><div className="mb-5 text-5xl">🌸</div><p className="mb-2 font-bold uppercase tracking-[.2em] text-[#c45b7a]">Bloom Booth Club</p><h1 className="mb-4 text-4xl leading-tight">Your own little photo world.</h1><p className="text-ink/70">Masuk ke akun yang sudah kamu beli dan mulai buat kenangan cantikmu.</p><div className="mt-8 text-sm font-bold text-[#c45b7a]">♡ One account · One device</div></div><form onSubmit={submit} className="flex flex-col justify-center p-8 md:p-12"><h2 className="mb-2 text-2xl">Selamat datang!</h2><p className="mb-7 text-sm text-ink/60">Gunakan akun dari admin Bloom Booth.</p><label className="label" htmlFor="email">EMAIL AKUN</label><input id="email" type="email" autoComplete="username" required className="field mb-4" placeholder="nama@email.com" value={email} onChange={e=>setEmail(e.target.value)} /><label className="label" htmlFor="password">PASSWORD</label><input id="password" type="password" autoComplete="current-password" required className="field mb-5" placeholder="Masukkan password" value={password} onChange={e=>setPassword(e.target.value)} /><button disabled={busy} className="rounded-xl border-2 border-ink bg-sun px-5 py-3 font-extrabold shadow-pop-sm transition hover:-translate-y-0.5 disabled:opacity-60">{busy ? 'Memeriksa...' : 'Masuk ke Bloom Booth ✨'}</button>{error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p>}<Link href="/" className="mt-6 text-center text-sm font-bold text-ink/60 hover:text-ink">← Kembali ke beranda</Link></form></div></main>;
}
