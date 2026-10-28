import type { ComposeParams, FilterId, PlacedSticker, Rect } from './types';
import { getLayout } from './layouts';
import { applyFilter } from './filters';
import { loadImage } from './image';
import { ensureFonts } from './fonts';
import { roundRectPath } from './canvasUtils';
import { drawMotif } from './stickers/draw';
import { OUTER_RADIUS, drawBackground, drawDecor, drawLabel } from './frames/render';

export type { ComposeParams };

/** Crop "cover" dari tengah, sedikit condong ke atas agar wajah tidak terpotong. */
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cw: number, ch: number, focusY = 0.4): void {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const k = Math.max(cw / iw, ch / ih);
  const sw = cw / k;
  const sh = ch / k;
  const sx = (iw - sw) / 2;
  const sy = (ih - sh) * focusY;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
}

function drawPlaceholder(ctx: CanvasRenderingContext2D, r: Rect): void {
  const g = ctx.createLinearGradient(r.x, r.y, r.x + r.w, r.y + r.h);
  g.addColorStop(0, '#F4F1FF');
  g.addColorStop(1, '#FFE9F2');
  ctx.fillStyle = g;
  ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.fillStyle = 'rgba(31,35,64,.10)';
  const cx = r.x + r.w / 2;
  ctx.beginPath();
  ctx.arc(cx, r.y + r.h * 0.42, r.h * 0.17, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx, r.y + r.h * 0.98, r.h * 0.34, r.h * 0.34, 0, Math.PI, Math.PI * 2);
  ctx.fill();
}

function drawCell(
  ctx: CanvasRenderingContext2D,
  cell: Rect,
  img: HTMLImageElement | null,
  filter: FilterId,
  scale: number,
  radius: number,
  frameColor: string,
): void {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.25)';
  ctx.shadowBlur = 14 * scale;
  ctx.shadowOffsetY = 4 * scale;
  ctx.fillStyle = frameColor;
  roundRectPath(ctx, cell.x - 6, cell.y - 6, cell.w + 12, cell.h + 12, radius + 6);
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundRectPath(ctx, cell.x, cell.y, cell.w, cell.h, radius);
  ctx.clip();
  if (img) {
    const cw = Math.max(1, Math.round(cell.w * scale));
    const ch = Math.max(1, Math.round(cell.h * scale));
    const off = document.createElement('canvas');
    off.width = cw;
    off.height = ch;
    const oc = off.getContext('2d');
    if (oc) {
      drawCover(oc, img, cw, ch);
      applyFilter(oc, cw, ch, filter);
      ctx.drawImage(off, cell.x, cell.y, cell.w, cell.h);
    }
  } else {
    drawPlaceholder(ctx, cell);
  }
  ctx.restore();
}

/**
 * Menggambar frame + foto + filter + label (tanpa stiker) ke kanvas baru.
 * Fungsi yang sama dipakai untuk preview dan unduhan supaya hasilnya identik.
 */
export async function renderBase(p: ComposeParams, scale: number): Promise<HTMLCanvasElement> {
  await ensureFonts();
  const L = getLayout(p.mode);
  const imgs = await Promise.all(
    L.cells.map((_, i) => {
      const src = p.photos[i];
      return src ? loadImage(src).catch(() => null) : Promise.resolve(null);
    }),
  );
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(L.W * scale);
  canvas.height = Math.round(L.H * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas tidak didukung di browser ini.');
  ctx.scale(scale, scale);

  if (p.opaque) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, L.W, L.H);
  }
  ctx.save();
  if (p.frame.rounded) {
    roundRectPath(ctx, 0, 0, L.W, L.H, OUTER_RADIUS);
    ctx.clip();
  }
  drawBackground(ctx, L, p.frame);
  drawDecor(ctx, L, p.frame);
  const radius = p.frame.rounded ? 22 : 4;
  L.cells.forEach((cell, i) => drawCell(ctx, cell, imgs[i], p.filter, scale, radius, p.frame.photoFrame));
  drawLabel(ctx, L, p.frame, p.caption, p.dateText);
  ctx.restore();
  return canvas;
}

export function drawStickers(ctx: CanvasRenderingContext2D, width: number, height: number, stickers: PlacedSticker[]): void {
  for (const s of stickers) {
    drawMotif(ctx, s.type, s.x * width, s.y * height, s.size * width, (s.rot * Math.PI) / 180);
  }
}

/** Hasil akhir lengkap (termasuk stiker) pada skala tertentu. */
export async function renderFinal(p: ComposeParams, stickers: PlacedSticker[], scale: number): Promise<HTMLCanvasElement> {
  const canvas = await renderBase(p, scale);
  const ctx = canvas.getContext('2d');
  if (ctx) drawStickers(ctx, canvas.width, canvas.height, stickers);
  return canvas;
}
