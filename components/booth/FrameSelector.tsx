'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, Palette } from 'lucide-react';
import type { FrameConfig, FramePreset, PhotoMode } from '@/lib/types';
import { getPreset } from '@/lib/frames';
import FramePicker from '@/components/frame/FramePicker';
import FrameCustomizer from '@/components/frame/FrameCustomizer';
import FrameThumb from '@/components/frame/FrameThumb';
import Button from '@/components/ui/Button';

interface Props {
  mode: PhotoMode;
  frame: FrameConfig;
  onPick: (preset: FramePreset) => void;
  onChange: (cfg: FrameConfig) => void;
  remember: boolean;
  onRememberChange: (v: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function FrameSelector({ mode, frame, onPick, onChange, remember, onRememberChange, onBack, onNext }: Props) {
  const [open, setOpen] = useState(false);
  const name = getPreset(frame.presetId)?.name ?? 'Frame';

  return (
    <section>
      <h1 className="text-3xl font-bold">Pilih frame</h1>
      <p className="mt-1 font-semibold text-ink/70">Pilih satu, lalu ubah warna dan dekorasinya kalau mau.</p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          <div className="card p-4">
            <FramePicker mode={mode} config={frame} onSelect={onPick} />
          </div>
          <div className="card p-4">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-2 font-display text-lg font-bold"
            >
              <span className="inline-flex items-center gap-2">
                <Palette className="h-5 w-5" aria-hidden />
                Atur frame sendiri
              </span>
              <ChevronDown className={`h-5 w-5 transition ${open ? 'rotate-180' : ''}`} aria-hidden />
            </button>
            {open && (
              <div className="mt-4">
                <FrameCustomizer config={frame} onChange={onChange} remember={remember} onRememberChange={onRememberChange} />
              </div>
            )}
          </div>
        </div>

        <aside className="card self-start p-4 lg:sticky lg:top-24">
          <p className="mb-2 font-display font-bold">Pratinjau: {name}</p>
          <div className="flex justify-center rounded-2xl bg-cream p-3">
            <FrameThumb config={frame} mode={mode} scale={0.3} className="max-h-[55vh] w-auto max-w-full" label={`Pratinjau frame ${name}`} />
          </div>
        </aside>
      </div>

      <div className="mt-6 flex justify-between gap-3">
        <Button variant="secondary" icon={<ArrowLeft className="h-5 w-5" aria-hidden />} onClick={onBack}>
          Kembali
        </Button>
        <Button size="lg" icon={<ArrowRight className="h-5 w-5" aria-hidden />} onClick={onNext}>
          Atur timer
        </Button>
      </div>
    </section>
  );
}
