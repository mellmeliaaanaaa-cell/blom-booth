'use client';

import { RotateCcw } from 'lucide-react';

interface Props {
  photos: (string | null)[];
  aspect: number;
  filterCss: string;
  currentIndex: number | null;
  disabled: boolean;
  onRetake: (i: number) => void;
}

/** Hasil sementara: foto yang sudah diambil dan tombol ulang per foto. */
export default function ShotTray({ photos, aspect, filterCss, currentIndex, disabled, onRetake }: Props) {
  return (
    <ul className={`grid gap-2 ${photos.length === 4 ? 'grid-cols-4 lg:grid-cols-2' : 'grid-cols-3 lg:grid-cols-2'}`}>
      {photos.map((src, i) => (
        <li key={i}>
          <div
            className={`relative overflow-hidden rounded-xl border-2 bg-cream ${currentIndex === i ? 'border-coral ring-4 ring-coral/30' : 'border-ink'}`}
            style={{ aspectRatio: aspect }}
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" style={{ filter: filterCss === 'none' ? undefined : filterCss, objectPosition: '50% 40%' }} />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-display text-2xl font-bold text-ink/30">{i + 1}</span>
            )}
          </div>
          {src && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onRetake(i)}
              className="mt-1 flex w-full items-center justify-center gap-1 rounded-lg border-2 border-ink bg-white px-1 py-1 text-xs font-bold transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Ulang foto ${i + 1}`}
            >
              <RotateCcw className="h-3 w-3" aria-hidden />
              Ulang
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
