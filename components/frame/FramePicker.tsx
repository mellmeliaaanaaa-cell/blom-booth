'use client';

import { useState } from 'react';
import type { CollectionId, FramePreset, PhotoMode, FrameConfig } from '@/lib/types';
import { COLLECTIONS, cloneConfig } from '@/lib/frameConfig';
import { presetsByCollection } from '@/lib/frames';
import FrameThumb from './FrameThumb';

interface Props {
  mode: PhotoMode;
  config: FrameConfig;
  onSelect: (preset: FramePreset) => void;
  /** skala render thumbnail */
  thumbScale?: number;
}

/** Pilih koleksi lalu variasi frame. */
export default function FramePicker({ mode, config, onSelect, thumbScale = 0.2 }: Props) {
  const [collection, setCollection] = useState<CollectionId>(config.collection);
  const presets = presetsByCollection(collection);

  return (
    <div>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2" role="tablist" aria-label="Koleksi frame">
        {COLLECTIONS.map((c) => {
          const active = c.id === collection;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCollection(c.id)}
              className={`shrink-0 rounded-full border-2 border-ink px-4 py-1.5 font-display text-sm font-semibold transition ${active ? 'shadow-pop-sm' : 'bg-white'}`}
              style={active ? { backgroundColor: c.color } : undefined}
            >
              {c.name}
            </button>
          );
        })}
      </div>
      <p className="mb-3 text-sm font-semibold text-ink/70">{COLLECTIONS.find((c) => c.id === collection)?.tagline}</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {presets.map((p) => {
          const selected = config.presetId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect({ ...p, config: cloneConfig(p.config) })}
              aria-pressed={selected}
              className={`rounded-2xl border-2 p-2 text-left transition ${selected ? 'border-ink bg-sun/40 shadow-pop-sm' : 'border-ink/30 bg-white hover:border-ink'}`}
            >
              <FrameThumb config={p.config} mode={mode} scale={thumbScale} label={`Frame ${p.name}`} />
              <span className="mt-2 block text-center font-display text-sm font-semibold">{p.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
