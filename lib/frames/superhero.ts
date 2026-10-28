import type { FramePreset } from '../types';
import { makePreset } from '../frameConfig';

export const SUPERHERO: FramePreset[] = [
  makePreset('hero-1', 'Komik Aksi', 'superhero', {
    bg1: '#FFD43B', bg2: '#FFEC99', accent: '#E03131', labelBg: '#1C3FAA', labelText: '#FFFFFF', photoFrame: '#111111',
    pattern: 'dots', border: 'thick', band: 'zigzag', motifs: ['burst', 'bolt', 'star'], rounded: false,
  }),
  makePreset('hero-2', 'Jaring Kota', 'superhero', {
    bg1: '#C92A2A', bg2: '#A61E1E', accent: '#FFFFFF', labelBg: '#1C2B5A', labelText: '#FFFFFF',
    pattern: 'gradient', border: 'double', band: 'none', motifs: ['web', 'star'], density: 'sparse',
  }),
  makePreset('hero-3', 'Pahlawan Biru', 'superhero', {
    bg1: '#1971C2', bg2: '#4DABF7', accent: '#FFD43B', labelBg: '#FFFFFF', labelText: '#1864AB',
    pattern: 'gradient', border: 'thick', band: 'tape', motifs: ['bolt', 'star', 'burst'],
  }),
  makePreset('hero-4', 'Malam Kota', 'superhero', {
    bg1: '#212529', bg2: '#3B4148', accent: '#FFD43B', labelBg: '#E03131', labelText: '#FFFFFF',
    pattern: 'stars', border: 'dashed', band: 'none', motifs: ['web', 'burst', 'bolt'], density: 'dense',
  }),
];
