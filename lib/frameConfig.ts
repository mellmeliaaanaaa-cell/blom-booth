import type {
  BandId,
  BorderId,
  CollectionId,
  CollectionInfo,
  DensityId,
  FrameConfig,
  FramePreset,
  MotifId,
  PatternId,
} from './types';
import { ALL_MOTIFS } from './stickers';

export const COLLECTIONS: CollectionInfo[] = [
  { id: 'girly', name: 'Girly', tagline: 'Pink pastel, bunga, pita & kawaii', color: '#FFB3CF' },
  { id: 'superhero', name: 'Superhero', tagline: 'Komik, jaring & action burst', color: '#6EC1FF' },
  { id: 'cool', name: 'Cool', tagline: 'Hitam putih, streetwear & graffiti', color: '#CED4DA' },
  { id: 'y2k', name: 'Korean & Y2K', tagline: 'Chrome, bintang & retro digital', color: '#D0BFFF' },
  { id: 'racing', name: 'Racing & Flames', tagline: 'Api, checkerboard & motorsport', color: '#FF7B7B' },
];

export const PATTERN_OPTIONS: { id: PatternId; label: string }[] = [
  { id: 'solid', label: 'Polos' },
  { id: 'dots', label: 'Titik' },
  { id: 'stripes', label: 'Garis' },
  { id: 'checks', label: 'Kotak' },
  { id: 'stars', label: 'Bintang' },
  { id: 'gradient', label: 'Gradasi' },
];

export const BORDER_OPTIONS: { id: BorderId; label: string }[] = [
  { id: 'thin', label: 'Tipis' },
  { id: 'thick', label: 'Tebal' },
  { id: 'dashed', label: 'Putus-putus' },
  { id: 'double', label: 'Ganda' },
];

export const BAND_OPTIONS: { id: BandId; label: string }[] = [
  { id: 'none', label: 'Tanpa' },
  { id: 'checker', label: 'Kotak balap' },
  { id: 'flames', label: 'Api' },
  { id: 'zigzag', label: 'Zigzag' },
  { id: 'scallop', label: 'Gelombang' },
  { id: 'tape', label: 'Pita garis' },
];

export const DENSITY_OPTIONS: { id: DensityId; label: string }[] = [
  { id: 'sparse', label: 'Jarang' },
  { id: 'normal', label: 'Sedang' },
  { id: 'dense', label: 'Rapat' },
];

const BASE: Omit<FrameConfig, 'presetId' | 'collection'> = {
  bg1: '#FFFFFF',
  bg2: '#EEEEEE',
  accent: '#1F2340',
  labelBg: '#FFFFFF',
  labelText: '#1F2340',
  photoFrame: '#FFFFFF',
  pattern: 'solid',
  border: 'thin',
  band: 'none',
  motifs: ['star'],
  density: 'normal',
  decor: true,
  corners: true,
  rounded: true,
};

export function makePreset(
  id: string,
  name: string,
  collection: CollectionId,
  p: Partial<Omit<FrameConfig, 'presetId' | 'collection'>>,
): FramePreset {
  return { id, name, collection, config: { ...BASE, ...p, presetId: id, collection } };
}

export function cloneConfig(c: FrameConfig): FrameConfig {
  return { ...c, motifs: [...c.motifs] };
}

const HEX = /^#[0-9a-f]{6}$/i;
const PATTERNS = PATTERN_OPTIONS.map((o) => o.id);
const BORDERS = BORDER_OPTIONS.map((o) => o.id);
const BANDS = BAND_OPTIONS.map((o) => o.id);
const DENSITIES = DENSITY_OPTIONS.map((o) => o.id);
const COLLECTION_IDS = COLLECTIONS.map((c) => c.id);

/** Memvalidasi data dari localStorage agar tidak merusak render jika formatnya salah. */
export function sanitizeConfig(raw: unknown): FrameConfig | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const color = (v: unknown, d: string): string => (typeof v === 'string' && HEX.test(v) ? v : d);
  const pick = <T extends string>(v: unknown, list: T[], d: T): T => (typeof v === 'string' && (list as string[]).includes(v) ? (v as T) : d);
  const bool = (v: unknown, d: boolean): boolean => (typeof v === 'boolean' ? v : d);
  const motifs = Array.isArray(o.motifs) ? (o.motifs.filter((m) => typeof m === 'string' && (ALL_MOTIFS as string[]).includes(m)) as MotifId[]) : [];
  return {
    presetId: typeof o.presetId === 'string' ? o.presetId : 'girly-1',
    collection: pick(o.collection, COLLECTION_IDS, 'girly'),
    bg1: color(o.bg1, BASE.bg1),
    bg2: color(o.bg2, BASE.bg2),
    accent: color(o.accent, BASE.accent),
    labelBg: color(o.labelBg, BASE.labelBg),
    labelText: color(o.labelText, BASE.labelText),
    photoFrame: color(o.photoFrame, BASE.photoFrame),
    pattern: pick(o.pattern, PATTERNS, 'solid'),
    border: pick(o.border, BORDERS, 'thin'),
    band: pick(o.band, BANDS, 'none'),
    motifs: motifs.length ? motifs : ['star'],
    density: pick(o.density, DENSITIES, 'normal'),
    decor: bool(o.decor, true),
    corners: bool(o.corners, true),
    rounded: bool(o.rounded, true),
  };
}
