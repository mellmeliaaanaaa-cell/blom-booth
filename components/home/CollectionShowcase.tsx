'use client';

import Link from 'next/link';
import { COLLECTIONS } from '@/lib/frameConfig';
import { presetsByCollection } from '@/lib/frames';
import FrameThumb from '@/components/frame/FrameThumb';

export default function CollectionShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-3xl font-bold">Lima koleksi, satu yang pas buat kamu</h2>
      <p className="mt-2 max-w-xl font-semibold text-ink/70">Setiap koleksi punya empat frame berbeda. Warna dan dekorasinya bisa diubah sesukamu.</p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {COLLECTIONS.map((c) => {
          const first = presetsByCollection(c.id)[0];
          return (
            <Link
              key={c.id}
              href={`/frames?c=${c.id}`}
              className="card group flex flex-col p-3 transition hover:-translate-y-1"
              style={{ backgroundColor: c.color + '55' }}
            >
              <div className="flex justify-center rounded-2xl bg-white/70 p-2">
                <FrameThumb config={first.config} mode={4} scale={0.16} className="h-44 w-auto" label={`Contoh frame ${c.name}`} />
              </div>
              <span className="mt-3 font-display text-lg font-bold">{c.name}</span>
              <span className="text-sm font-semibold text-ink/70">{c.tagline}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
