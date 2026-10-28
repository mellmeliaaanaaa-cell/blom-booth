import type { FrameConfig } from './types';
import { sanitizeConfig } from './frameConfig';

const KEY = 'bloombooth:frame:v1';

/** Hanya menyimpan pengaturan frame (bukan foto). Semua operasi aman jika localStorage diblokir. */
export function saveFrame(cfg: FrameConfig): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(cfg));
  } catch {
    /* abaikan */
  }
}

export function clearSavedFrame(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* abaikan */
  }
}

export function loadSavedFrame(): FrameConfig | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return sanitizeConfig(JSON.parse(raw));
  } catch {
    return null;
  }
}
