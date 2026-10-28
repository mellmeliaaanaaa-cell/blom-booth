import type { FramePreset } from '../types';
import { makePreset } from '../frameConfig';

export const COOL: FramePreset[] = [
  makePreset('cool-1', 'Mono Klasik', 'cool', {
    bg1: '#FFFFFF', bg2: '#E9ECEF', accent: '#111111', labelBg: '#111111', labelText: '#FFFFFF', photoFrame: '#111111',
    pattern: 'checks', border: 'thin', band: 'checker', motifs: ['star'], density: 'sparse', rounded: false,
  }),
  makePreset('cool-2', 'Street Hitam', 'cool', {
    bg1: '#111111', bg2: '#242424', accent: '#FFFFFF', labelBg: '#FFFFFF', labelText: '#111111',
    pattern: 'stripes', border: 'dashed', band: 'none', motifs: ['bolt', 'star', 'checker'],
  }),
  makePreset('cool-3', 'Graffiti Tag', 'cool', {
    bg1: '#F1F3F5', bg2: '#CED4DA', accent: '#111111', labelBg: '#FFFFFF', labelText: '#111111', photoFrame: '#111111',
    pattern: 'dots', border: 'thick', band: 'tape', motifs: ['burst', 'bolt', 'sparkle'], density: 'dense',
  }),
  makePreset('cool-4', 'Noir Chrome', 'cool', {
    bg1: '#0B0B0F', bg2: '#2B2B33', accent: '#ADB5BD', labelBg: '#ADB5BD', labelText: '#111111',
    pattern: 'gradient', border: 'double', band: 'none', motifs: ['star4', 'sparkle'],
  }),
];
