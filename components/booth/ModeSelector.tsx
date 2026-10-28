'use client';

import { ArrowRight } from 'lucide-react';
import type { PhotoMode } from '@/lib/types';
import { MODE_OPTIONS } from '@/lib/constants';
import Button from '@/components/ui/Button';

interface Props {
  mode: PhotoMode;
  onSelect: (m: PhotoMode) => void;
  onNext: () => void;
}

function MiniLayout({ mode }: { mode: PhotoMode }) {
  const cells = mode === 4 ? 4 : 6;
  return (
    <div
      className={`grid gap-1.5 rounded-lg border-2 border-ink bg-white p-2 ${mode === 4 ? 'w-14 grid-cols-1' : 'w-24 grid-cols-2'}`}
      aria-hidden
    >
      {Array.from({ length: cells }).map((_, i) => (
        <span key={i} className={`block rounded bg-sky/60 ${mode === 4 ? 'h-7' : 'h-9'}`} />
      ))}
    </div>
  );
}

export default function ModeSelector({ mode, onSelect, onNext }: Props) {
  return (
    <section>
      <h1 className="text-3xl font-bold">Mau foto berapa?</h1>
      <p className="mt-1 font-semibold text-ink/70">Pilih bentuk hasil fotomu.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Mode foto">
        {MODE_OPTIONS.map((o) => {
          const on = o.value === mode;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onSelect(o.value)}
              className={`card flex items-center gap-4 p-4 text-left transition ${on ? 'bg-sun/50' : 'hover:-translate-y-0.5'}`}
            >
              <div className="flex h-36 w-28 shrink-0 items-center justify-center rounded-2xl bg-cream">
                <MiniLayout mode={o.value} />
              </div>
              <div>
                <p className="font-display text-xl font-bold">{o.title}</p>
                <p className="mt-1 text-sm font-semibold text-ink/70">{o.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex justify-end">
        <Button size="lg" icon={<ArrowRight className="h-5 w-5" aria-hidden />} onClick={onNext}>
          Pilih frame
        </Button>
      </div>
    </section>
  );
}
