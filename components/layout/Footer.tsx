import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-ink bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-bold">Bloom Booth</p>
          <p className="mt-1 flex items-start gap-2 text-sm font-semibold text-ink/70">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-mint" aria-hidden />
            Fotomu diproses di browser dan tidak diunggah ke server. Unduh hasilnya ke perangkatmu.
          </p>
        </div>
        <div className="flex gap-4 text-sm font-bold">
          <Link href="/booth" className="hover:underline">
            Mulai Foto
          </Link>
          <Link href="/frames" className="hover:underline">
            Galeri Frame
          </Link>
        </div>
      </div>
    </footer>
  );
}
