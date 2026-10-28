'use client';

import { formatToday } from '@/lib/constants';
import Button from '@/components/ui/Button';

interface Props {
  caption: string;
  dateText: string;
  color: string;
  onCaption: (v: string) => void;
  onDate: (v: string) => void;
  onColor: (v: string) => void;
}

const SWATCHES = ['#1F2340', '#FFFFFF', '#E03131', '#F06595', '#1971C2', '#2F9E44'];

export default function TextPanel({ caption, dateText, color, onCaption, onDate, onColor }: Props) {
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="label">Nama / caption</span>
        <input className="field" value={caption} maxLength={24} onChange={(e) => onCaption(e.target.value)} placeholder="Contoh: Dita & Raka" />
      </label>
      <div>
        <label className="block">
          <span className="label">Tanggal</span>
          <input className="field" value={dateText} maxLength={24} onChange={(e) => onDate(e.target.value)} placeholder="Tanggal" />
        </label>
        <Button variant="secondary" size="sm" className="mt-2" onClick={() => onDate(formatToday())}>
          Isi tanggal hari ini
        </Button>
      </div>
      <div>
        <span className="label">Warna teks</span>
        <div className="flex flex-wrap items-center gap-2">
          {SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Warna ${c}`}
              aria-pressed={color.toLowerCase() === c.toLowerCase()}
              onClick={() => onColor(c)}
              className={`h-9 w-9 rounded-full border-2 ${color.toLowerCase() === c.toLowerCase() ? 'border-ink ring-4 ring-sky/50' : 'border-ink/30'}`}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => onColor(e.target.value)}
            aria-label="Pilih warna teks sendiri"
            className="h-9 w-9 cursor-pointer rounded-full border-2 border-ink p-0"
          />
        </div>
        <p className="mt-2 text-xs font-semibold text-ink/60">Warna latar label bisa diubah di tab Frame.</p>
      </div>
    </div>
  );
}
