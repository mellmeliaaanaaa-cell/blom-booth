import type { FramePreset } from '../types';
import { makePreset } from '../frameConfig';

export const RACING: FramePreset[] = [
  makePreset('race-1', 'Garis Finish', 'racing', {
    bg1: '#FFFFFF', bg2: '#111111', accent: '#E03131', labelBg: '#E03131', labelText: '#FFFFFF', photoFrame: '#111111',
    pattern: 'checks', border: 'thick', band: 'checker', motifs: ['checker', 'bolt'], rounded: false,
  }),
  makePreset('race-2', 'Api Merah', 'racing', {
    bg1: '#E03131', bg2: '#111111', accent: '#FFD43B', labelBg: '#111111', labelText: '#FFFFFF',
    pattern: 'gradient', border: 'thin', band: 'flames', motifs: ['flame'], density: 'dense',
  }),
  makePreset('race-3', 'Turbo Hitam', 'racing', {
    bg1: '#111111', bg2: '#C92A2A', accent: '#FFFFFF', labelBg: '#FFFFFF', labelText: '#111111',
    pattern: 'stripes', border: 'double', band: 'tape', motifs: ['bolt', 'checker'],
  }),
  makePreset('race-4', 'Sirkuit Putih', 'racing', {
    bg1: '#F8F9FA', bg2: '#E03131', accent: '#111111', labelBg: '#111111', labelText: '#FFFFFF', photoFrame: '#111111',
    pattern: 'stripes', border: 'dashed', band: 'checker', motifs: ['flame', 'checker'], density: 'sparse',
  }),
];
