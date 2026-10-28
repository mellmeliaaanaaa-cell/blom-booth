import type { FramePreset } from '../types';
import { makePreset } from '../frameConfig';

export const Y2K: FramePreset[] = [
  makePreset('y2k-1', 'Chrome Pink', 'y2k', {
    bg1: '#FFD6F0', bg2: '#D0BFFF', accent: '#F06BC3', labelBg: '#FFFFFF', labelText: '#AE3EC9',
    pattern: 'gradient', border: 'thick', band: 'zigzag', motifs: ['star4', 'sparkle', 'disc'],
  }),
  makePreset('y2k-2', 'Silver Digital', 'y2k', {
    bg1: '#E9ECEF', bg2: '#CED4DA', accent: '#4C6EF5', labelBg: '#1B1F3B', labelText: '#8CE99A',
    pattern: 'checks', border: 'double', band: 'checker', motifs: ['star4', 'disc', 'sparkle'], rounded: false,
  }),
  makePreset('y2k-3', 'Korean Cute', 'y2k', {
    bg1: '#E5DBFF', bg2: '#FFFFFF', accent: '#7950F2', labelBg: '#FFFFFF', labelText: '#5F3DC4',
    pattern: 'dots', border: 'thick', band: 'scallop', motifs: ['smile', 'star4', 'heart'], density: 'sparse',
  }),
  makePreset('y2k-4', 'Cyber Bintang', 'y2k', {
    bg1: '#1A1B3A', bg2: '#5F3DC4', accent: '#66D9E8', labelBg: '#66D9E8', labelText: '#1A1B3A',
    pattern: 'stars', border: 'dashed', band: 'none', motifs: ['star4', 'sparkle', 'bolt'], density: 'dense',
  }),
];
