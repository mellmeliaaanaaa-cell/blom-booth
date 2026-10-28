export type PhotoMode = 4 | 6;
export type TimerOption = 0 | 3 | 5 | 10;
export type FilterId = 'natural' | 'warm' | 'bw' | 'soft' | 'vintage' | 'cool' | 'bright';
export type CollectionId = 'girly' | 'superhero' | 'cool' | 'y2k' | 'racing';
export type PatternId = 'solid' | 'dots' | 'stripes' | 'checks' | 'stars' | 'gradient';
export type BorderId = 'thin' | 'thick' | 'dashed' | 'double';
export type BandId = 'none' | 'checker' | 'flames' | 'zigzag' | 'scallop' | 'tape';
export type DensityId = 'sparse' | 'normal' | 'dense';
export type MotifId =
  | 'heart'
  | 'star'
  | 'flower'
  | 'bow'
  | 'bolt'
  | 'flame'
  | 'sparkle'
  | 'star4'
  | 'web'
  | 'burst'
  | 'checker'
  | 'smile'
  | 'disc';

/** Semua pengaturan tampilan frame. Preview dan file unduhan memakai objek yang sama. */
export interface FrameConfig {
  presetId: string;
  collection: CollectionId;
  bg1: string;
  bg2: string;
  accent: string;
  labelBg: string;
  labelText: string;
  photoFrame: string;
  pattern: PatternId;
  border: BorderId;
  band: BandId;
  motifs: MotifId[];
  density: DensityId;
  decor: boolean;
  corners: boolean;
  rounded: boolean;
}

export interface FramePreset {
  id: string;
  name: string;
  collection: CollectionId;
  config: FrameConfig;
}

export interface CollectionInfo {
  id: CollectionId;
  name: string;
  tagline: string;
  color: string;
}

export interface PlacedSticker {
  id: string;
  type: MotifId;
  /** posisi pusat, pecahan 0..1 dari lebar/tinggi kanvas */
  x: number;
  y: number;
  /** ukuran sebagai pecahan dari lebar kanvas */
  size: number;
  /** derajat */
  rot: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Layout {
  mode: PhotoMode;
  W: number;
  H: number;
  pad: number;
  gap: number;
  cells: Rect[];
  label: Rect;
  cellAspect: number;
}

export interface ComposeParams {
  mode: PhotoMode;
  photos: (string | null)[];
  frame: FrameConfig;
  filter: FilterId;
  caption: string;
  dateText: string;
  /** true untuk JPG: latar putih penuh, tanpa sudut transparan */
  opaque?: boolean;
}
