'use client';

import Link from 'next/link';
import { Camera, LayoutGrid } from 'lucide-react';
import FrameThumb from '@/components/frame/FrameThumb';
import { getPresetOrDefault } from '@/lib/frames';

const STRIPS = [
  { id: 'hero-1', rot: '-6deg', delay: '0s', extra: '' },
  { id: 'girly-3', rot: '3deg', delay: '.6s', extra: 'mt-10' },
  { id: 'race-2', rot: '-3deg', delay: '1.2s', extra: 'hidden sm:block' },
];

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-6 pt-10 lg:grid-cols-[1.1fr_1fr] lg:pt-16">
      <div>
        <h1 className="text-5xl font-bold leading-[1.05] sm:text-6xl">
          Foto strip kece, <span className="inline-block -rotate-2 rounded-2xl border-2 border-ink bg-sky px-3 shadow-pop">tanpa antre.</span>
        </h1>
        <p className="mt-5 max-w-md text-lg font-semibold text-ink/75">
          Pilih frame, atur timer, lalu berpose. Kamera HP atau laptopmu langsung jadi mesin photobooth. Fotomu tidak diunggah ke mana-mana.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/booth"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-ink bg-sun px-7 py-3.5 font-display text-lg font-semibold shadow-pop transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            <Camera className="h-5 w-5" aria-hidden />
            Mulai Foto
          </Link>
          <Link
            href="/frames"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-ink bg-white px-7 py-3.5 font-display text-lg font-semibold shadow-pop transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            <LayoutGrid className="h-5 w-5" aria-hidden />
            Lihat Frame
          </Link>
        </div>
        <ol className="mt-8 flex flex-wrap gap-2 text-sm font-bold">
          <li className="chip">Pilih mode &amp; frame</li>
          <li className="chip">Foto otomatis</li>
          <li className="chip">Unduh PNG / JPG</li>
        </ol>
      </div>

      <div className="flex items-start justify-center gap-4 sm:gap-6" aria-hidden>
        {STRIPS.map((s) => (
          <div
            key={s.id}
            className={`w-28 animate-float sm:w-36 ${s.extra}`}
            style={{ ['--r' as string]: s.rot, animationDelay: s.delay } as React.CSSProperties}
          >
            <FrameThumb config={getPresetOrDefault(s.id).config} mode={4} scale={0.25} className="h-auto w-full drop-shadow-xl" />
          </div>
        ))}
      </div>
    </section>
  );
}
