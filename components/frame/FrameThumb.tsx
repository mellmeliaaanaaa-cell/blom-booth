'use client';

import { useEffect, useRef } from 'react';
import type { FrameConfig, PhotoMode } from '@/lib/types';
import { renderBase } from '@/lib/compose';
import { DEFAULT_CAPTION } from '@/lib/constants';

interface Props {
  config: FrameConfig;
  mode: PhotoMode;
  /** skala render (resolusi kanvas); ukuran tampil diatur lewat className */
  scale?: number;
  className?: string;
  label?: string;
}

/** Thumbnail/preview frame dengan foto contoh kosong, digambar oleh mesin render yang sama dengan hasil akhir. */
export default function FrameThumb({ config, mode, scale = 0.22, className = 'h-auto w-full', label }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const key = JSON.stringify(config);

  useEffect(() => {
    let cancelled = false;
    renderBase(
      {
        mode,
        photos: Array<string | null>(mode).fill(null),
        frame: config,
        filter: 'natural',
        caption: DEFAULT_CAPTION,
        dateText: '',
      },
      scale,
    )
      .then((base) => {
        const c = ref.current;
        if (cancelled || !c) return;
        c.width = base.width;
        c.height = base.height;
        c.getContext('2d')?.drawImage(base, 0, 0);
      })
      .catch(() => {
        /* thumbnail gagal: biarkan kosong */
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, mode, scale]);

  return <canvas ref={ref} className={className} role="img" aria-label={label ?? `Pratinjau frame ${config.presetId}`} />;
}
