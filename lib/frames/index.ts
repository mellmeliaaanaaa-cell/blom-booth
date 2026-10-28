import type { CollectionId, FramePreset } from '../types';
import { GIRLY } from './girly';
import { SUPERHERO } from './superhero';
import { COOL } from './cool';
import { Y2K } from './y2k';
import { RACING } from './racing';

export const ALL_PRESETS: FramePreset[] = [...GIRLY, ...SUPERHERO, ...COOL, ...Y2K, ...RACING];
export const DEFAULT_PRESET_ID = 'girly-1';

export function getPreset(id: string | undefined): FramePreset | undefined {
  if (!id) return undefined;
  return ALL_PRESETS.find((p) => p.id === id);
}

export function getPresetOrDefault(id: string | undefined): FramePreset {
  return getPreset(id) ?? ALL_PRESETS[0];
}

export function presetsByCollection(c: CollectionId): FramePreset[] {
  return ALL_PRESETS.filter((p) => p.collection === c);
}
