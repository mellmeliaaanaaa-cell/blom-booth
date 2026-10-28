'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { MotifId, PlacedSticker } from '@/lib/types';
import { STICKERS } from '@/lib/stickers';
import MotifIcon from '@/components/ui/MotifIcon';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface Props {
  stickers: PlacedSticker[];
  selectedId: string | null;
  onAdd: (type: MotifId) => void;
  onUpdate: (id: string, patch: Partial<PlacedSticker>) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const GROUPS = ['Umum', 'Superhero', 'Y2K'] as const;

export default function StickerPanel({ stickers, selectedId, onAdd, onUpdate, onRemove, onClear }: Props) {
  const [confirmClear, setConfirmClear] = useState(false);
  const sel = stickers.find((s) => s.id === selectedId) ?? null;

  const slider = (label: string, value: number, min: number, max: number, step: number, key: 'size' | 'rot' | 'x' | 'y') => (
    <label className="block">
      <span className="label">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => sel && onUpdate(sel.id, { [key]: Number(e.target.value) })}
        className="w-full accent-ink"
      />
    </label>
  );

  return (
    <div className="space-y-4">
      {GROUPS.map((g) => (
        <div key={g}>
          <span className="label">{g}</span>
          <div className="flex flex-wrap gap-2">
            {STICKERS.filter((s) => s.group === g).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onAdd(s.id)}
                aria-label={`Tambah stiker ${s.label}`}
                title={s.label}
                className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-ink bg-white transition hover:-translate-y-0.5 hover:bg-cream"
              >
                <MotifIcon id={s.id} size={40} />
              </button>
            ))}
          </div>
        </div>
      ))}
      <p className="text-xs font-semibold text-ink/60">Ketuk stiker untuk menambah, lalu geser di preview (mouse atau jari).</p>

      {sel ? (
        <div className="rounded-2xl border-2 border-ink bg-cream p-3">
          <p className="mb-2 font-display font-bold">Stiker terpilih</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {slider('Ukuran', sel.size, 0.06, 0.4, 0.01, 'size')}
            {slider('Putar', sel.rot, -180, 180, 1, 'rot')}
            {slider('Posisi kiri-kanan', sel.x, 0, 1, 0.01, 'x')}
            {slider('Posisi atas-bawah', sel.y, 0, 1, 0.01, 'y')}
          </div>
          <Button variant="danger" size="sm" className="mt-3" icon={<Trash2 className="h-4 w-4" aria-hidden />} onClick={() => onRemove(sel.id)}>
            Hapus stiker ini
          </Button>
        </div>
      ) : (
        stickers.length > 0 && <p className="text-sm font-semibold">Ketuk sebuah stiker di preview untuk mengubahnya.</p>
      )}

      {stickers.length > 0 && (
        <Button variant="secondary" size="sm" onClick={() => setConfirmClear(true)}>
          Hapus semua stiker ({stickers.length})
        </Button>
      )}
      <Modal
        open={confirmClear}
        title="Hapus semua stiker?"
        confirmLabel="Ya, hapus"
        danger
        onConfirm={() => {
          onClear();
          setConfirmClear(false);
        }}
        onCancel={() => setConfirmClear(false)}
      >
        Semua stiker di hasil foto akan dihapus.
      </Modal>
    </div>
  );
}
