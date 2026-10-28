import type { FilterId } from './types';

export interface FilterDef {
  id: FilterId;
  label: string;
  /** perkiraan CSS filter untuk live preview kamera dan thumbnail */
  css: string;
  brightness: number;
  contrast: number;
  saturation: number;
  sepia: number;
  tint: [number, number, number];
  glow: number;
  vignette: number;
}

const base = { brightness: 1, contrast: 1, saturation: 1, sepia: 0, tint: [0, 0, 0] as [number, number, number], glow: 0, vignette: 0 };

export const FILTERS: FilterDef[] = [
  { ...base, id: 'natural', label: 'Natural', css: 'none' },
  { ...base, id: 'warm', label: 'Warm', css: 'sepia(.12) saturate(1.1) brightness(1.04) contrast(1.05)', brightness: 1.04, contrast: 1.05, saturation: 1.1, sepia: 0.12, tint: [14, 4, -10] },
  { ...base, id: 'bw', label: 'Black & White', css: 'grayscale(1) contrast(1.15)', contrast: 1.15, saturation: 0, brightness: 1.02 },
  { ...base, id: 'soft', label: 'Soft', css: 'brightness(1.07) contrast(.9) blur(.4px)', brightness: 1.07, contrast: 0.9, saturation: 1.05, glow: 0.45, tint: [6, 2, 4] },
  { ...base, id: 'vintage', label: 'Vintage', css: 'sepia(.45) contrast(.92) saturate(.85)', sepia: 0.45, contrast: 0.92, saturation: 0.85, brightness: 1.02, tint: [10, 4, -8], vignette: 0.35 },
  { ...base, id: 'cool', label: 'Cool', css: 'saturate(1.05) hue-rotate(8deg) brightness(1.02)', brightness: 1.02, contrast: 1.05, saturation: 1.05, tint: [-10, 0, 16] },
  { ...base, id: 'bright', label: 'Bright', css: 'brightness(1.15) saturate(1.15)', brightness: 1.15, contrast: 1.05, saturation: 1.15 },
];

export function getFilter(id: FilterId): FilterDef {
  return FILTERS.find((f) => f.id === id) ?? FILTERS[0];
}

/** Menerapkan filter langsung ke piksel (tidak bergantung ctx.filter yang belum didukung semua browser). */
export function applyFilter(ctx: CanvasRenderingContext2D, w: number, h: number, id: FilterId): void {
  if (id === 'natural') return;
  const f = getFilter(id);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i] * f.brightness;
    let g = d[i + 1] * f.brightness;
    let b = d[i + 2] * f.brightness;
    r = (r - 128) * f.contrast + 128;
    g = (g - 128) * f.contrast + 128;
    b = (b - 128) * f.contrast + 128;
    const l = 0.299 * r + 0.587 * g + 0.114 * b;
    r = l + (r - l) * f.saturation;
    g = l + (g - l) * f.saturation;
    b = l + (b - l) * f.saturation;
    if (f.sepia > 0) {
      const sr = 0.393 * r + 0.769 * g + 0.189 * b;
      const sg = 0.349 * r + 0.686 * g + 0.168 * b;
      const sb = 0.272 * r + 0.534 * g + 0.131 * b;
      r += (sr - r) * f.sepia;
      g += (sg - g) * f.sepia;
      b += (sb - b) * f.sepia;
    }
    d[i] = r + f.tint[0];
    d[i + 1] = g + f.tint[1];
    d[i + 2] = b + f.tint[2];
  }
  ctx.putImageData(img, 0, 0);

  if (f.glow > 0) {
    const sw = Math.max(8, Math.round(w / 12));
    const sh = Math.max(8, Math.round(h / 12));
    const small = document.createElement('canvas');
    small.width = sw;
    small.height = sh;
    const sc = small.getContext('2d');
    if (sc) {
      sc.drawImage(ctx.canvas, 0, 0, sw, sh);
      ctx.save();
      ctx.globalAlpha = f.glow;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(small, 0, 0, w, h);
      ctx.restore();
    }
  }

  if (f.vignette > 0) {
    const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, `rgba(0,0,0,${f.vignette})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
}
