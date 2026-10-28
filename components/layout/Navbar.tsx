import Link from 'next/link';
import { Camera, LayoutGrid } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3" aria-label="Navigasi utama">
        <Link href="/" aria-label="Bloom Booth, ke beranda">
          <Logo />
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/frames"
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 font-display font-semibold hover:bg-ink/5"
          >
            <LayoutGrid className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Galeri Frame</span>
            <span className="sm:hidden">Frame</span>
          </Link>
          <Link
            href="/booth"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-ink bg-sun px-4 py-2 font-display font-semibold shadow-pop-sm transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <Camera className="h-4 w-4" aria-hidden />
            Mulai Foto
          </Link>
        </div>
      </nav>
    </header>
  );
}
