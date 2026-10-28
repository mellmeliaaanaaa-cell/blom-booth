'use client';

import { useEffect, useRef } from 'react';
import type { MotifId } from '@/lib/types';
import { drawMotif } from '@/lib/stickers/draw';

/** Ikon kecil dekorasi, digambar dengan fungsi yang sama dengan hasil akhir. */
export default function MotifIcon({ id, size = 40, color }: { id: MotifId; size?: number; color?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = 2;
    c.width = size * dpr;
    c.height = size * dpr;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    drawMotif(ctx, id, c.width / 2, c.height / 2, c.width * 0.82, 0, color);
  }, [id, size, color]);
  return <canvas ref={ref} style={{ width: size, height: size }} aria-hidden />;
}
