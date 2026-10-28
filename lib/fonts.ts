const FALLBACK = '"Trebuchet MS", "Arial Rounded MT Bold", system-ui, -apple-system, "Segoe UI", sans-serif';

let family = FALLBACK;
let ready: Promise<void> | null = null;

/** String font untuk ctx.font. Memakai Fredoka jika sudah termuat, jika tidak memakai font sistem. */
export function canvasFont(weight: number, size: number): string {
  return `${weight} ${size}px ${family}`;
}

/** Memastikan font Fredoka (dari next/font) siap dipakai di Canvas. Aman dipanggil berulang. */
export function ensureFonts(): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();
  if (!ready) {
    ready = (async () => {
      try {
        const v = getComputedStyle(document.documentElement).getPropertyValue('--font-fredoka').trim();
        if (v) {
          await document.fonts.load(`700 40px ${v}`);
          family = `${v}, ${FALLBACK}`;
        }
      } catch {
        /* pakai font cadangan */
      }
    })();
  }
  return ready;
}
