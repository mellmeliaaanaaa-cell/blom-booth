import type { FrameConfig, Layout, MotifId } from '../types';
import { drawMotif, starPath } from '../stickers/draw';
import { roundRectPath } from '../canvasUtils';
import { canvasFont } from '../fonts';

type Ctx = CanvasRenderingContext2D;

export const OUTER_RADIUS = 40;

/* ---------- Latar & pola ---------- */

export function drawBackground(ctx: Ctx, L: Layout, cfg: FrameConfig): void {
  const { W, H } = L;
  ctx.fillStyle = cfg.bg1;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = cfg.bg2;
  ctx.strokeStyle = cfg.bg2;
  switch (cfg.pattern) {
    case 'gradient': {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, cfg.bg1);
      g.addColorStop(1, cfg.bg2);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      break;
    }
    case 'dots': {
      const s = 46;
      for (let y = 0, r = 0; y < H + s; y += s, r++) {
        for (let x = (r % 2) * (s / 2); x < W + s; x += s) {
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
    case 'stripes': {
      ctx.lineWidth = 24;
      for (let k = -H; k < W + H; k += 60) {
        ctx.beginPath();
        ctx.moveTo(k, 0);
        ctx.lineTo(k + H, H);
        ctx.stroke();
      }
      break;
    }
    case 'checks': {
      const s = 48;
      for (let r = 0; r * s < H; r++) {
        for (let c = 0; c * s < W; c++) {
          if ((r + c) % 2 === 0) ctx.fillRect(c * s, r * s, s, s);
        }
      }
      break;
    }
    case 'stars': {
      const s = 64;
      for (let y = s / 2, r = 0; y < H + s; y += s, r++) {
        for (let x = r % 2 ? s : s / 2; x < W + s; x += s * 2) {
          ctx.save();
          ctx.translate(x, y);
          starPath(ctx, 11, 4.5, 5);
          ctx.fill();
          ctx.restore();
        }
      }
      break;
    }
    default:
      break;
  }
}

/* ---------- Pita pinggir (atas & bawah) ---------- */

function drawTopBand(ctx: Ctx, W: number, bh: number, cfg: FrameConfig): void {
  switch (cfg.band) {
    case 'checker': {
      const s = bh / 2;
      for (let i = 0; i * s < W; i++) {
        for (let r = 0; r < 2; r++) {
          ctx.fillStyle = (i + r) % 2 ? '#FFFFFF' : '#111111';
          ctx.fillRect(i * s, r * s, s + 0.5, s + 0.5);
        }
      }
      break;
    }
    case 'zigzag': {
      const s = bh * 1.2;
      ctx.fillStyle = cfg.accent;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let x = 0; x < W + s; x += s) {
        ctx.lineTo(x + s / 2, bh);
        ctx.lineTo(x + s, 0);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'scallop': {
      ctx.fillStyle = cfg.accent;
      const r = bh * 0.62;
      for (let x = r; x < W + r; x += r * 2) {
        ctx.beginPath();
        ctx.arc(x, 0, r, 0, Math.PI);
        ctx.fill();
      }
      break;
    }
    case 'flames': {
      ctx.fillStyle = cfg.accent;
      ctx.fillRect(0, 0, W, bh * 0.4);
      for (let x = 0; x < W + bh; x += bh * 1.3) {
        drawMotif(ctx, 'flame', x + bh * 0.2, bh * 0.45, bh * 2.1, Math.PI, cfg.accent);
      }
      break;
    }
    case 'tape': {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, bh);
      ctx.clip();
      ctx.fillStyle = '#111111';
      ctx.fillRect(0, 0, W, bh);
      ctx.strokeStyle = cfg.accent;
      ctx.lineWidth = bh * 0.55;
      for (let k = -bh; k < W + bh; k += bh * 1.3) {
        ctx.beginPath();
        ctx.moveTo(k, bh);
        ctx.lineTo(k + bh, 0);
        ctx.stroke();
      }
      ctx.restore();
      break;
    }
    default:
      break;
  }
}

function drawBands(ctx: Ctx, L: Layout, cfg: FrameConfig): void {
  if (cfg.band === 'none') return;
  const bh = Math.round(L.pad * 0.34);
  ctx.save();
  drawTopBand(ctx, L.W, bh, cfg);
  ctx.restore();
  ctx.save();
  ctx.translate(0, L.H);
  ctx.scale(1, -1);
  drawTopBand(ctx, L.W, bh, cfg);
  ctx.restore();
}

/* ---------- Garis tepi ---------- */

function drawBorder(ctx: Ctx, L: Layout, cfg: FrameConfig): void {
  const { W, H } = L;
  const r = cfg.rounded ? 32 : 0;
  ctx.save();
  ctx.strokeStyle = cfg.accent;
  ctx.setLineDash([]);
  switch (cfg.border) {
    case 'thin':
      ctx.lineWidth = 6;
      roundRectPath(ctx, 12, 12, W - 24, H - 24, r);
      ctx.stroke();
      break;
    case 'thick':
      ctx.lineWidth = 16;
      roundRectPath(ctx, 14, 14, W - 28, H - 28, r);
      ctx.stroke();
      break;
    case 'dashed':
      ctx.lineWidth = 7;
      ctx.setLineDash([20, 14]);
      roundRectPath(ctx, 14, 14, W - 28, H - 28, r);
      ctx.stroke();
      break;
    case 'double':
      ctx.lineWidth = 4;
      roundRectPath(ctx, 8, 8, W - 16, H - 16, r + 4);
      ctx.stroke();
      roundRectPath(ctx, 22, 22, W - 44, H - 44, Math.max(0, r - 8));
      ctx.stroke();
      break;
  }
  ctx.restore();
}

/* ---------- Dekorasi di tepi (hanya di area margin) ---------- */

function drawRing(ctx: Ctx, L: Layout, cfg: FrameConfig): void {
  const { W, H, pad } = L;
  const c = pad * 0.56;
  const size = pad * 0.62;
  const step = size * (cfg.density === 'sparse' ? 2.7 : cfg.density === 'dense' ? 1.25 : 1.8);
  const w = W - 2 * c;
  const h = H - 2 * c;
  const P = 2 * (w + h);
  const n = Math.max(4, Math.floor(P / step));
  const cornerD = [0, w, w + h, 2 * w + h];
  for (let k = 0; k < n; k++) {
    const d = (k + 0.5) * (P / n);
    if (cfg.corners && cornerD.some((cd) => Math.min(Math.abs(d - cd), P - Math.abs(d - cd)) < size * 0.95)) continue;
    let x: number;
    let y: number;
    if (d < w) {
      x = c + d;
      y = c;
    } else if (d < w + h) {
      x = c + w;
      y = c + (d - w);
    } else if (d < 2 * w + h) {
      x = c + w - (d - w - h);
      y = c + h;
    } else {
      x = c;
      y = c + h - (d - 2 * w - h);
    }
    const id: MotifId = cfg.motifs[k % cfg.motifs.length];
    drawMotif(ctx, id, x, y, size, (k % 2 ? 1 : -1) * 0.22, cfg.accent);
  }
}

function drawCorners(ctx: Ctx, L: Layout, cfg: FrameConfig): void {
  const { W, H, pad } = L;
  const c = pad * 0.56;
  const s = pad * 1.05;
  const a = cfg.motifs[0];
  const b = cfg.motifs[1 % cfg.motifs.length];
  drawMotif(ctx, a, c, c, s, -0.3, cfg.accent);
  drawMotif(ctx, a, W - c, c, s, 0.3, cfg.accent);
  drawMotif(ctx, b, c, H - c, s, 0.3, cfg.accent);
  drawMotif(ctx, b, W - c, H - c, s, -0.3, cfg.accent);
}

export function drawDecor(ctx: Ctx, L: Layout, cfg: FrameConfig): void {
  drawBands(ctx, L, cfg);
  drawBorder(ctx, L, cfg);
  if (cfg.decor) {
    drawRing(ctx, L, cfg);
    if (cfg.corners) drawCorners(ctx, L, cfg);
  }
}

/* ---------- Area label (nama, tanggal, brand) ---------- */

export function drawLabel(ctx: Ctx, L: Layout, cfg: FrameConfig, caption: string, dateText: string): void {
  const { x, y, w, h } = L.label;
  roundRectPath(ctx, x, y, w, h, cfg.rounded ? 30 : 6);
  ctx.fillStyle = cfg.labelBg;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = cfg.accent;
  ctx.stroke();

  if (cfg.decor) {
    const m = h * 0.36;
    drawMotif(ctx, cfg.motifs[0], x + h * 0.38, y + h / 2, m, -0.2, cfg.accent);
    drawMotif(ctx, cfg.motifs[1 % cfg.motifs.length], x + w - h * 0.38, y + h / 2, m, 0.2, cfg.accent);
  }

  const lines: { text: string; size: number; weight: number; alpha: number }[] = [];
  if (caption.trim()) lines.push({ text: caption.trim(), size: h * 0.3, weight: 700, alpha: 1 });
  if (dateText.trim()) lines.push({ text: dateText.trim(), size: h * 0.15, weight: 700, alpha: 0.85 });
  lines.push({ text: 'BLOOM BOOTH', size: h * 0.1, weight: 700, alpha: 0.6 });

  const maxW = w - h * (cfg.decor ? 1.25 : 0.5);
  ctx.save();
  ctx.fillStyle = cfg.labelText;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  lines.forEach((ln, i) => {
    let size = ln.size;
    ctx.font = canvasFont(ln.weight, size);
    while (ctx.measureText(ln.text).width > maxW && size > 12) {
      size -= 2;
      ctx.font = canvasFont(ln.weight, size);
    }
    ctx.globalAlpha = ln.alpha;
    ctx.fillText(ln.text, x + w / 2, y + (h * (i + 1)) / (lines.length + 1));
  });
  ctx.restore();
}
