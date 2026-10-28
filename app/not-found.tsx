import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-3 text-lg font-semibold">Halaman ini tidak ketemu.</p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-2xl border-2 border-ink bg-sun px-6 py-3 font-display font-semibold shadow-pop"
      >
        Kembali ke beranda
      </Link>
    </div>
  );
}
