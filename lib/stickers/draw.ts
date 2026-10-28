import type { MotifId } from '../types';

type Ctx = CanvasRenderingContext2D;
type MotifFn = (c: Ctx, color?: string) => void;

const INK = '#1F2340';
const TAU = Math.PI * 2;

function paint(c: Ctx, fill: string | CanvasGradient, stroke: string = INK, lw = 0.05): void {
  c.fillStyle = fill;
  c.fill();
  c.lineWidth = lw;
  c.strokeStyle = stroke;
  c.stroke();
}

/** Jalur bintang n-sudut di sekitar (0,0). */
export function starPath(c: Ctx, r1: number, r2: number, n = 5): void {
  c.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / n;
    const r = i % 2 ? r2 : r1;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) c.moveTo(x, y);
    else c.lineTo(x, y);
  }
  c.closePath();
}

function fourPoint(c: Ctx, k: number): void {
  c.beginPath();
  c.moveTo(0, -0.5);
  c.quadraticCurveTo(k, -k, 0.5, 0);
  c.quadraticCurveTo(k, k, 0, 0.5);
  c.quadraticCurveTo(-k, k, -0.5, 0);
  c.quadraticCurveTo(-k, -k, 0, -0.5);
  c.closePath();
}

const MOTIFS: Record<MotifId, MotifFn> = {
  heart: (c, col) => {
    c.beginPath();
    c.moveTo(0, 0.4);
    c.bezierCurveTo(-0.62, -0.02, -0.4, -0.5, 0, -0.2);
    c.bezierCurveTo(0.4, -0.5, 0.62, -0.02, 0, 0.4);
    c.closePath();
    paint(c, col ?? '#FF5C8A');
    c.beginPath();
    c.arc(-0.2, -0.18, 0.06, 0, TAU);
    c.fillStyle = 'rgba(255,255,255,.75)';
    c.fill();
  },
  star: (c, col) => {
    starPath(c, 0.5, 0.22, 5);
    paint(c, col ?? '#FFC93C');
  },
  flower: (c, col) => {
    const p = col ?? '#FF8FB8';
    for (let i = 0; i < 5; i++) {
      c.save();
      c.rotate((i * TAU) / 5);
      c.beginPath();
      c.ellipse(0, -0.26, 0.17, 0.24, 0, 0, TAU);
      paint(c, p);
      c.restore();
    }
    c.beginPath();
    c.arc(0, 0, 0.13, 0, TAU);
    paint(c, '#FFD43B');
  },
  bow: (c, col) => {
    const p = col ?? '#FF6FA5';
    for (const s of [-1, 1]) {
      c.beginPath();
      c.moveTo(s * 0.03, 0.05);
      c.lineTo(s * 0.22, 0.46);
      c.lineTo(s * 0.08, 0.38);
      c.lineTo(s * 0.0, 0.1);
      c.closePath();
      paint(c, p);
    }
    for (const s of [-1, 1]) {
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(s * 0.2, -0.38, s * 0.58, -0.32, s * 0.5, 0);
      c.bezierCurveTo(s * 0.58, 0.32, s * 0.2, 0.38, 0, 0);
      c.closePath();
      paint(c, p);
    }
    c.beginPath();
    c.arc(0, 0, 0.1, 0, TAU);
    paint(c, p);
  },
  bolt: (c, col) => {
    c.beginPath();
    c.moveTo(0.1, -0.5);
    c.lineTo(-0.28, 0.08);
    c.lineTo(-0.02, 0.08);
    c.lineTo(-0.12, 0.5);
    c.lineTo(0.3, -0.1);
    c.lineTo(0.04, -0.1);
    c.closePath();
    paint(c, col ?? '#FFD43B');
  },
  flame: (c, col) => {
    c.beginPath();
    c.moveTo(0, -0.5);
    c.bezierCurveTo(0.12, -0.2, 0.42, 0, 0.4, 0.22);
    c.bezierCurveTo(0.38, 0.42, 0.2, 0.5, 0, 0.5);
    c.bezierCurveTo(-0.2, 0.5, -0.4, 0.4, -0.4, 0.2);
    c.bezierCurveTo(-0.4, 0.02, -0.2, -0.05, -0.14, -0.28);
    c.bezierCurveTo(-0.08, -0.38, -0.02, -0.45, 0, -0.5);
    c.closePath();
    paint(c, col ?? '#FF6B2C');
    c.beginPath();
    c.moveTo(0, -0.05);
    c.bezierCurveTo(0.08, 0.1, 0.22, 0.18, 0.2, 0.3);
    c.bezierCurveTo(0.18, 0.4, 0.08, 0.44, 0, 0.44);
    c.bezierCurveTo(-0.1, 0.44, -0.2, 0.38, -0.2, 0.28);
    c.bezierCurveTo(-0.2, 0.18, -0.06, 0.1, 0, -0.05);
    c.closePath();
    c.fillStyle = '#FFE066';
    c.fill();
  },
  sparkle: (c, col) => {
    fourPoint(c, 0.07);
    paint(c, col ?? '#FFE066');
    c.save();
    c.translate(0.36, -0.36);
    c.scale(0.28, 0.28);
    fourPoint(c, 0.07);
    c.fillStyle = '#FFFFFF';
    c.fill();
    c.lineWidth = 0.12;
    c.strokeStyle = INK;
    c.stroke();
    c.restore();
  },
  star4: (c, col) => {
    const g = c.createLinearGradient(-0.5, -0.5, 0.5, 0.5);
    if (col) {
      g.addColorStop(0, '#FFFFFF');
      g.addColorStop(0.5, col);
      g.addColorStop(1, '#FFFFFF');
    } else {
      g.addColorStop(0, '#FFFFFF');
      g.addColorStop(0.35, '#AEB8D0');
      g.addColorStop(0.6, '#F4F6FC');
      g.addColorStop(1, '#8E9AB8');
    }
    fourPoint(c, 0.045);
    paint(c, g);
  },
  web: (c, col) => {
    const draw = (color: string, w: number) => {
      c.strokeStyle = color;
      c.lineWidth = w;
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(Math.cos(a) * 0.5, Math.sin(a) * 0.5);
        c.stroke();
      }
      for (const r of [0.17, 0.3, 0.44]) {
        c.beginPath();
        for (let i = 0; i < 8; i++) {
          const a0 = (i * Math.PI) / 4;
          const a1 = ((i + 1) * Math.PI) / 4;
          const am = (a0 + a1) / 2;
          if (i === 0) c.moveTo(Math.cos(a0) * r, Math.sin(a0) * r);
          c.quadraticCurveTo(Math.cos(am) * r * 0.8, Math.sin(am) * r * 0.8, Math.cos(a1) * r, Math.sin(a1) * r);
        }
        c.stroke();
      }
    };
    draw(INK, 0.075);
    draw(col ?? '#FFFFFF', 0.035);
  },
  burst: (c, col) => {
    starPath(c, 0.5, 0.33, 12);
    paint(c, col ?? '#FFD43B');
    c.save();
    c.scale(0.01, 0.01);
    c.rotate(-0.12);
    c.fillStyle = '#E03131';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = '900 19px Impact, "Arial Black", sans-serif';
    c.fillText('POW!', 0, 2);
    c.restore();
  },
  checker: (c, col) => {
    const s = 0.8 / 3;
    for (let r = 0; r < 3; r++) {
      for (let k = 0; k < 3; k++) {
        c.fillStyle = (r + k) % 2 ? '#FFFFFF' : (col ?? '#111111');
        c.fillRect(-0.4 + k * s, -0.4 + r * s, s, s);
      }
    }
    c.lineWidth = 0.05;
    c.strokeStyle = INK;
    c.strokeRect(-0.4, -0.4, 0.8, 0.8);
  },
  smile: (c, col) => {
    c.beginPath();
    c.arc(0, 0, 0.46, 0, TAU);
    paint(c, col ?? '#FFD43B');
    c.fillStyle = INK;
    for (const x of [-0.16, 0.16]) {
      c.beginPath();
      c.arc(x, -0.08, 0.06, 0, TAU);
      c.fill();
    }
    c.fillStyle = 'rgba(255,107,107,.55)';
    for (const x of [-0.27, 0.27]) {
      c.beginPath();
      c.ellipse(x, 0.07, 0.07, 0.045, 0, 0, TAU);
      c.fill();
    }
    c.beginPath();
    c.arc(0, 0.04, 0.2, 0.15 * Math.PI, 0.85 * Math.PI);
    c.lineWidth = 0.05;
    c.strokeStyle = INK;
    c.stroke();
  },
  disc: (c) => {
    const g = c.createLinearGradient(-0.5, -0.5, 0.5, 0.5);
    g.addColorStop(0, '#F8F9FF');
    g.addColorStop(0.3, '#B5BED6');
    g.addColorStop(0.55, '#EEF1FA');
    g.addColorStop(1, '#9AA5C2');
    c.beginPath();
    c.arc(0, 0, 0.46, 0, TAU);
    paint(c, g);
    c.beginPath();
    c.arc(0, 0, 0.17, 0, TAU);
    c.lineWidth = 0.03;
    c.strokeStyle = 'rgba(31,35,64,.5)';
    c.stroke();
    c.beginPath();
    c.arc(0, 0, 0.09, 0, TAU);
    paint(c, '#FFFFFF');
    c.beginPath();
    c.arc(0, 0, 0.36, 1.1 * Math.PI, 1.5 * Math.PI);
    c.lineWidth = 0.035;
    c.strokeStyle = 'rgba(255,255,255,.9)';
    c.stroke();
  },
};

/**
 * Menggambar satu dekorasi. `size` = diameter dalam piksel, `rot` = radian.
 * `color` mengganti warna utama dekorasi (jika didukung).
 */
export function drawMotif(ctx: Ctx, id: MotifId, cx: number, cy: number, size: number, rot = 0, color?: string): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.scale(size, size);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  MOTIFS[id](ctx, color);
  ctx.restore();
}
