'use client';

import type { FrameConfig, MotifId } from '@/lib/types';
import {
  BAND_OPTIONS,
  BORDER_OPTIONS,
  DENSITY_OPTIONS,
  PATTERN_OPTIONS,
  cloneConfig,
} from '@/lib/frameConfig';
import { getPreset } from '@/lib/frames';
import { ALL_MOTIFS, MOTIF_LABEL } from '@/lib/stickers';
import MotifIcon from '@/components/ui/MotifIcon';
import Button from '@/components/ui/Button';
import { RotateCcw } from 'lucide-react';

interface Props {
  config: FrameConfig;
  onChange: (cfg: FrameConfig) => void;
  remember: boolean;
  onRememberChange: (v: boolean) => void;
}

type ColorKey = 'bg1' | 'bg2' | 'accent' | 'labelBg' | 'labelText' | 'photoFrame';

const COLOR_FIELDS: { key: ColorKey; label: string }[] = [
  { key: 'bg1', label: 'Warna utama' },
  { key: 'bg2', label: 'Warna pola' },
  { key: 'accent', label: 'Warna aksen' },
  { key: 'labelBg', label: 'Latar label' },
  { key: 'labelText', label: 'Teks label' },
  { key: 'photoFrame', label: 'Tepi foto' },
];

export default function FrameCustomizer({ config, onChange, remember, onRememberChange }: Props) {
  const set = <K extends keyof FrameConfig>(key: K, value: FrameConfig[K]) => onChange({ ...config, [key]: value });

  const toggleMotif = (m: MotifId) => {
    const has = config.motifs.includes(m);
    if (has && config.motifs.length === 1) return; // minimal satu dekorasi
    set('motifs', has ? config.motifs.filter((x) => x !== m) : [...config.motifs, m]);
  };

  const reset = () => {
    const p = getPreset(config.presetId);
    if (p) onChange(cloneConfig(p.config));
  };

  return (
    <div className="space-y-5">
      <div>
        <span className="label">Warna</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {COLOR_FIELDS.map((f) => (
            <label key={f.key} className="flex items-center gap-2 rounded-xl border-2 border-ink/20 bg-white p-2 text-sm font-bold">
              <input
                type="color"
                value={config[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                className="h-8 w-8 shrink-0 cursor-pointer rounded-lg border-2 border-ink bg-transparent p-0"
                aria-label={f.label}
              />
              {f.label}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label>
          <span className="label">Pola latar</span>
          <select className="field" value={config.pattern} onChange={(e) => set('pattern', e.target.value as FrameConfig['pattern'])}>
            {PATTERN_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">Garis tepi</span>
          <select className="field" value={config.border} onChange={(e) => set('border', e.target.value as FrameConfig['border'])}>
            {BORDER_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">Pita atas &amp; bawah</span>
          <select className="field" value={config.band} onChange={(e) => set('band', e.target.value as FrameConfig['band'])}>
            {BAND_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">Kerapatan dekorasi</span>
          <select className="field" value={config.density} onChange={(e) => set('density', e.target.value as FrameConfig['density'])} disabled={!config.decor}>
            {DENSITY_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {([
          ['decor', 'Dekorasi tepi'],
          ['corners', 'Hiasan sudut'],
          ['rounded', 'Sudut membulat'],
        ] as const).map(([key, label]) => (
          <label key={key} className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-ink/20 bg-white p-2 text-sm font-bold">
            <input type="checkbox" checked={config[key]} onChange={(e) => set(key, e.target.checked)} className="h-5 w-5 accent-ink" />
            {label}
          </label>
        ))}
      </div>

      <div>
        <span className="label">Pilih dekorasi (minimal 1)</span>
        <div className="flex flex-wrap gap-2">
          {ALL_MOTIFS.map((m) => {
            const on = config.motifs.includes(m);
            return (
              <button
                key={m}
                type="button"
                onClick={() => toggleMotif(m)}
                aria-pressed={on}
                aria-label={MOTIF_LABEL[m]}
                title={MOTIF_LABEL[m]}
                disabled={!config.decor}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 transition disabled:opacity-40 ${on ? 'border-ink bg-sun/60 shadow-pop-sm' : 'border-ink/20 bg-white'}`}
              >
                <MotifIcon id={m} size={34} color={m === 'disc' || m === 'star4' ? undefined : config.accent} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={remember} onChange={(e) => onRememberChange(e.target.checked)} className="h-5 w-5 accent-ink" />
          Ingat pengaturan frame di browser ini
        </label>
        <Button variant="secondary" size="sm" icon={<RotateCcw className="h-4 w-4" aria-hidden />} onClick={reset}>
          Reset ke bawaan
        </Button>
      </div>
    </div>
  );
}
