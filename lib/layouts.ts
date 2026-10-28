import type { Layout, PhotoMode, Rect } from './types';

const PAD = 64;
const GAP = 26;

/**
 * Ukuran dasar (piksel) kanvas. Preview memakai skala < 1, unduhan standar 1x, HD 2x.
 * Strip 4 foto: 600 lebar, foto 472x372 (landscape 5:4).
 * Kolase 6 foto: 2 kolom x 3 baris, foto persegi 366x366.
 */
export function getLayout(mode: PhotoMode): Layout {
  if (mode === 4) {
    const cw = 472;
    const ch = 372;
    const labelH = 176;
    const W = cw + PAD * 2;
    const cells: Rect[] = [];
    for (let i = 0; i < 4; i++) cells.push({ x: PAD, y: PAD + i * (ch + GAP), w: cw, h: ch });
    const last = cells[3];
    const ly = last.y + last.h + GAP;
    const H = ly + labelH + PAD;
    return { mode, W, H, pad: PAD, gap: GAP, cells, label: { x: PAD, y: ly, w: cw, h: labelH }, cellAspect: cw / ch };
  }
  const cw = 366;
  const ch = 366;
  const labelH = 150;
  const W = cw * 2 + GAP + PAD * 2;
  const cells: Rect[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 2; c++) cells.push({ x: PAD + c * (cw + GAP), y: PAD + r * (ch + GAP), w: cw, h: ch });
  }
  const last = cells[5];
  const ly = last.y + last.h + GAP;
  const H = ly + labelH + PAD;
  return { mode, W, H, pad: PAD, gap: GAP, cells, label: { x: PAD, y: ly, w: W - PAD * 2, h: labelH }, cellAspect: cw / ch };
}
