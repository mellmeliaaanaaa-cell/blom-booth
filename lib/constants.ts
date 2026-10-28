import type { PhotoMode, TimerOption } from './types';

export const DEFAULT_CAPTION = 'Momen Seru!';

export const MODE_OPTIONS: { value: PhotoMode; title: string; desc: string }[] = [
  { value: 4, title: 'Strip 4 Foto', desc: 'Satu kolom, empat baris. Strip panjang ala photobooth mal.' },
  { value: 6, title: 'Kolase 6 Foto', desc: 'Dua kolom, tiga baris. Enam foto dalam satu kartu.' },
];

export const TIMER_OPTIONS: { value: TimerOption; label: string; hint: string }[] = [
  { value: 0, label: 'Tanpa timer', hint: 'Tekan tombol untuk tiap foto' },
  { value: 3, label: '3 detik', hint: 'Otomatis, cepat' },
  { value: 5, label: '5 detik', hint: 'Otomatis, santai' },
  { value: 10, label: '10 detik', hint: 'Otomatis, sempat gaya' },
];

export const STEPS = [
  { id: 'mode', label: 'Mode' },
  { id: 'frame', label: 'Frame' },
  { id: 'setup', label: 'Atur' },
  { id: 'studio', label: 'Foto' },
  { id: 'result', label: 'Hasil' },
] as const;

export function modeLabel(mode: PhotoMode): string {
  return mode === 4 ? 'Strip 4 foto' : 'Kolase 6 foto';
}

export function formatToday(): string {
  try {
    return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
}
