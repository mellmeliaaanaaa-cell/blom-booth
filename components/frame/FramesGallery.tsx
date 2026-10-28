'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Camera } from 'lucide-react';
import type { CollectionId, PhotoMode } from '@/lib/types';
import { COLLECTIONS } from '@/lib/frameConfig';
import { presetsByCollection } from '@/lib/frames';
import FrameThumb from './FrameThumb';

function isCollection(v: string | undefined): v is CollectionId {
  return !!v && COLLECTIONS.some((c) => c.id === v);
}

export default function FramesGallery({ initialCollection }: { initialCollection?: string }) {
  const [collection, setCollection] = useState<CollectionId>(isCollection(initialCollection) ? initialCollection : 'girly');
  const [mode, setMode] = useState<PhotoMode>(4);
  const presets = presetsByCollection(collection);
  const [selectedId, setSelectedId] = useState<string>(presets[0].id);
  const selected = presets.find((p) => p.id === selectedId) ?? presets[0];
  const info = COLLECTIONS.find((c) => c.id === collection);

  const pickCollection = (c: CollectionId) => {
    setCollection(c);
    setSelectedId(presetsByCollection(c)[0].id);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold sm:text-4xl">Galeri Frame</h1>
      <p className="mt-2 max-w-xl font-semibold text-ink/70">
        5 koleksi, 20 frame. Semuanya bisa kamu ubah warna dan dekorasinya di studio foto.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Koleksi frame">
          {COLLECTIONS.map((c) => {
            const active = c.id === collection;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => pickCollection(c.id)}
                className={`shrink-0 rounded-full border-2 border-ink px-4 py-1.5 font-display text-sm font-semibold ${active ? 'shadow-pop-sm' : 'bg-white'}`}
                style={active ? { backgroundColor: c.color } : undefined}
              >
                {c.name}
              </button>
            );
          })}
        </div>
        <div className="inline-flex rounded-full border-2 border-ink bg-white p-1" role="group" aria-label="Mode foto">
          {([4, 6] as PhotoMode[]).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-1 font-display text-sm font-semibold ${mode === m ? 'bg-ink text-white' : ''}`}
            >
              {m === 4 ? 'Strip 4' : 'Kolase 6'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="card self-start p-4 lg:sticky lg:top-24">
          <div className="flex justify-center rounded-2xl bg-cream p-3">
            <FrameThumb config={selected.config} mode={mode} scale={0.4} className="max-h-[60vh] w-auto max-w-full" label={`Pratinjau ${selected.name}`} />
          </div>
          <p className="mt-3 font-display text-xl font-bold">{selected.name}</p>
          <p className="text-sm font-semibold text-ink/70">{info?.name}</p>
          <Link
            href={`/booth?frame=${selected.id}&mode=${mode}`}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-sun px-5 py-3 font-display font-semibold shadow-pop transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            <Camera className="h-5 w-5" aria-hidden />
            Pakai frame ini
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              aria-pressed={p.id === selected.id}
              className={`rounded-2xl border-2 p-2 text-left transition ${p.id === selected.id ? 'border-ink bg-sun/40 shadow-pop-sm' : 'border-ink/30 bg-white hover:border-ink'}`}
            >
              <FrameThumb config={p.config} mode={mode} scale={0.2} label={`Frame ${p.name}`} />
              <span className="mt-2 block text-center font-display text-sm font-semibold">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
