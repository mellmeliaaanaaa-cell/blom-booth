'use client';

import { useEffect, useState } from 'react';
import { Download, Share2 } from 'lucide-react';
import type { ComposeParams, PlacedSticker } from '@/lib/types';
import { renderFinal } from '@/lib/compose';
import { canvasToBlob, downloadBlob } from '@/lib/download';
import { isIOS } from '@/lib/browserSupport';
import Button from '@/components/ui/Button';

interface Props {
  params: Omit<ComposeParams, 'opaque'>;
  stickers: PlacedSticker[];
  ready: boolean;
}

type Busy = null | 'png' | 'jpg' | 'share';

export default function DownloadPanel({ params, stickers, ready }: Props) {
  const [quality, setQuality] = useState<'standard' | 'hd'>('standard');
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);
  const [canShare, setCanShare] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    setIos(isIOS());
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function' && typeof navigator.canShare === 'function');
  }, []);

  const scale = quality === 'hd' ? 2 : 1;
  const name = (ext: string) => `bloom-booth-photo-${params.mode}foto.${ext}`;

  const build = async (type: 'image/png' | 'image/jpeg') => {
    const canvas = await renderFinal({ ...params, opaque: type === 'image/jpeg' }, stickers, scale);
    return canvasToBlob(canvas, type, 0.95);
  };

  const run = async (kind: Exclude<Busy, null>) => {
    if (!ready) return;
    setBusy(kind);
    setError(null);
    try {
      const type = kind === 'jpg' ? 'image/jpeg' : 'image/png';
      const blob = await build(type);
      if (kind === 'share') {
        const file = new File([blob], name('png'), { type });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Bloom Booth' });
        } else {
          downloadBlob(blob, name('png'));
        }
      } else {
        downloadBlob(blob, name(kind));
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return; // pengguna menutup menu bagikan
      setError(e instanceof Error ? e.message : 'Gagal membuat file. Coba kualitas Standar.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="card mt-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold">Unduh hasil</h2>
        <div className="inline-flex rounded-full border-2 border-ink bg-white p-1" role="group" aria-label="Kualitas">
          {(['standard', 'hd'] as const).map((q) => (
            <button
              key={q}
              type="button"
              aria-pressed={quality === q}
              onClick={() => setQuality(q)}
              className={`rounded-full px-3 py-0.5 font-display text-sm font-semibold ${quality === q ? 'bg-ink text-white' : ''}`}
            >
              {q === 'standard' ? 'Standar' : 'HD (cetak)'}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Button icon={<Download className="h-5 w-5" aria-hidden />} loading={busy === 'png'} disabled={!ready || busy !== null} onClick={() => run('png')}>
          Unduh PNG
        </Button>
        <Button variant="secondary" icon={<Download className="h-5 w-5" aria-hidden />} loading={busy === 'jpg'} disabled={!ready || busy !== null} onClick={() => run('jpg')}>
          Unduh JPG
        </Button>
        {canShare && (
          <Button variant="mint" className="sm:col-span-2" icon={<Share2 className="h-5 w-5" aria-hidden />} loading={busy === 'share'} disabled={!ready || busy !== null} onClick={() => run('share')}>
            Bagikan / Simpan ke galeri
          </Button>
        )}
      </div>
      {!ready && <p className="mt-2 text-sm font-bold text-coral">Lengkapi semua foto dulu sebelum mengunduh.</p>}
      {ios && (
        <p className="mt-2 text-xs font-semibold text-ink/70">
          Di iPhone, jika unduhan tidak berjalan, pakai tombol Bagikan lalu pilih Simpan Gambar, atau tekan lama gambar di preview.
        </p>
      )}
      {error && (
        <p className="mt-2 text-sm font-bold text-coral" role="alert">
          {error}
        </p>
      )}
      <p className="mt-3 text-xs font-semibold text-ink/60">Fotomu hanya ada di browser ini. Tidak ada yang diunggah. Simpan hasilnya dengan mengunduh.</p>
    </div>
  );
}
