import type { MotifId } from '../types';

export interface StickerInfo {
  id: MotifId;
  label: string;
  group: 'Umum' | 'Superhero' | 'Y2K';
}

export const STICKERS: StickerInfo[] = [
  { id: 'heart', label: 'Hati', group: 'Umum' },
  { id: 'star', label: 'Bintang', group: 'Umum' },
  { id: 'flower', label: 'Bunga', group: 'Umum' },
  { id: 'bow', label: 'Pita', group: 'Umum' },
  { id: 'bolt', label: 'Petir', group: 'Umum' },
  { id: 'flame', label: 'Api', group: 'Umum' },
  { id: 'sparkle', label: 'Sparkle', group: 'Umum' },
  { id: 'checker', label: 'Checkerboard', group: 'Umum' },
  { id: 'smile', label: 'Senyum', group: 'Umum' },
  { id: 'web', label: 'Jaring', group: 'Superhero' },
  { id: 'burst', label: 'Aksi!', group: 'Superhero' },
  { id: 'star4', label: 'Bintang Chrome', group: 'Y2K' },
  { id: 'disc', label: 'CD Retro', group: 'Y2K' },
];

export const MOTIF_LABEL: Record<MotifId, string> = STICKERS.reduce(
  (acc, s) => ({ ...acc, [s.id]: s.label }),
  {} as Record<MotifId, string>,
);

export const ALL_MOTIFS: MotifId[] = STICKERS.map((s) => s.id);
