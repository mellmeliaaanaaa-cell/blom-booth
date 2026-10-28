import type { FramePreset } from '../types';
import { makePreset } from '../frameConfig';

export const GIRLY: FramePreset[] = [
  makePreset('girly-1', 'Bunga Pastel', 'girly', {
    bg1: '#FFE4EC', bg2: '#FFC2D6', accent: '#FF7BA9', labelText: '#D6336C',
    pattern: 'dots', border: 'double', band: 'scallop', motifs: ['flower', 'heart', 'sparkle'],
  }),
  makePreset('girly-2', 'Coquette Pita', 'girly', {
    bg1: '#FFF0F5', bg2: '#FFD6E5', accent: '#F06595', labelText: '#C2255C',
    pattern: 'stripes', border: 'dashed', band: 'none', motifs: ['bow', 'heart'], density: 'sparse',
  }),
  makePreset('girly-3', 'Kawaii Awan', 'girly', {
    bg1: '#E3F4FF', bg2: '#FFD9EC', accent: '#FF8FB8', labelText: '#7048E8',
    pattern: 'gradient', border: 'thick', band: 'scallop', motifs: ['smile', 'star', 'heart', 'sparkle'], density: 'dense',
  }),
  makePreset('girly-4', 'Taman Mawar', 'girly', {
    bg1: '#FDE2E4', bg2: '#FAD2E1', accent: '#E5989B', labelText: '#9C2C4A',
    pattern: 'checks', border: 'thin', band: 'zigzag', motifs: ['flower', 'bow'], rounded: false,
  }),
];
