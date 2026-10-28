'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { ArrowLeft, Image as ImageIcon, Palette, RotateCcw, SlidersHorizontal, Sticker, Type } from 'lucide-react';
import type { FilterId, FrameConfig, MotifId, PhotoMode, PlacedSticker } from '@/lib/types';
import { renderBase, drawStickers } from '@/lib/compose';
import { getLayout } from '@/lib/layouts';
import { modeLabel } from '@/lib/constants';
import { getPreset } from '@/lib/frames';
import { useDraggable } from '@/hooks/useDraggable';
import FilterSelector from '@/components/booth/FilterSelector';
import FramePicker from '@/components/frame/FramePicker';
import FrameCustomizer from '@/components/frame/FrameCustomizer';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import StickerPanel from './StickerPanel';
import TextPanel from './TextPanel';
import DownloadPanel from './DownloadPanel';

const PREVIEW_SCALE = 0.9;

type Tab = 'filter' | 'frame' | 'stiker' | 'teks';
const TABS: { id: Tab; label: string; icon: typeof ImageIcon }[] = [
  { id: 'filter', label: 'Filter', icon: SlidersHorizontal },
  { id: 'frame', label: 'Frame', icon: Palette },
  { id: 'stiker', label: 'Stiker', icon: Sticker },
  { id: 'teks', label: 'Teks', icon: Type },
];

interface Props {
  mode: PhotoMode;
  photos: (string | null)[];
  frame: FrameConfig;
  onFrameChange: (cfg: FrameConfig) => void;
  filter: FilterId;
  onFilterChange: (f: FilterId) => void;
  stickers: PlacedSticker[];
  setStickers: Dispatch<SetStateAction<PlacedSticker[]>>;
  caption: string;
  onCaptionChange: (v: string) => void;
  dateText: string;
  onDateChange: (v: string) => void;
  remember: boolean;
  onRememberChange: (v: boolean) => void;
  onBack: () => void;
  onNewSession: () => void;
}

export default function ResultView(p: Props) {
  const { mode, photos, frame, filter, stickers, setStickers, caption, dateText } = p;
  const L = getLayout(mode);
  const [tab, setTab] = useState<Tab>('filter');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const baseRef = useRef<HTMLCanvasElement | null>(null);
  const displayRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Render dasar (frame + foto + filter + teks). Stiker digambar terpisah agar geser stiker tetap cepat.
  useEffect(() => {
    let cancelled = false;
    setBusy(true);
    const t = setTimeout(async () => {
      try {
        const c = await renderBase({ mode, photos, frame, filter, caption, dateText }, PREVIEW_SCALE);
        if (cancelled) return;
        baseRef.current = c;
        setRenderError(null);
        setVersion((v) => v + 1);
      } catch (e) {
        if (!cancelled) setRenderError(e instanceof Error ? e.message : 'Gagal membuat preview.');
      } finally {
        if (!cancelled) setBusy(false);
      }
    }, 100);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [mode, photos, frame, filter, caption, dateText]);

  useEffect(() => {
    const base = baseRef.current;
    const out = displayRef.current;
    if (!base || !out) return;
    out.width = base.width;
    out.height = base.height;
    const ctx = out.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(base, 0, 0);
    drawStickers(ctx, out.width, out.height, stickers);
  }, [version, stickers]);

  const onDrag = useCallback(
    (id: string, x: number, y: number) => setStickers((prev) => prev.map((s) => (s.id === id ? { ...s, x, y } : s))),
    [setStickers],
  );
  const bind = useDraggable(boxRef, onDrag, setSelectedId);

  const addSticker = (type: MotifId) => {
    const id = Math.random().toString(36).slice(2, 9);
    const jitter = () => (Math.random() - 0.5) * 0.2;
    setStickers((prev) => [...prev, { id, type, x: 0.5 + jitter(), y: 0.4 + jitter(), size: 0.16, rot: 0 }]);
    setSelectedId(id);
  };
  const updateSticker = (id: string, patch: Partial<PlacedSticker>) =>
    setStickers((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const removeSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
    setSelectedId(null);
  };

  const presetName = getPreset(frame.presetId)?.name ?? 'Frame';
  const ready = photos.length === mode && photos.every(Boolean);

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Hasil fotomu</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="chip">{presetName}</span>
            <span className="chip">{modeLabel(mode)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={<ArrowLeft className="h-5 w-5" aria-hidden />} onClick={p.onBack}>
            Ulang foto
          </Button>
          <Button variant="secondary" icon={<RotateCcw className="h-5 w-5" aria-hidden />} onClick={p.onNewSession}>
            Sesi baru
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,440px)_1fr]">
        <div>
          <div className="card p-3">
            <div
              ref={boxRef}
              className="relative mx-auto select-none overflow-hidden rounded-xl bg-cream"
              style={{ aspectRatio: `${L.W} / ${L.H}`, width: `min(100%, ${((75 * L.W) / L.H).toFixed(2)}vh)` }}
              onPointerDown={() => setSelectedId(null)}
            >
              <canvas ref={displayRef} className="absolute inset-0 h-full w-full" role="img" aria-label="Hasil photobooth" />
              {stickers.map((s) => (
                <div
                  key={s.id}
                  {...bind(s.id, s.x, s.y)}
                  className={`absolute cursor-grab rounded-lg active:cursor-grabbing ${s.id === selectedId ? 'outline outline-2 outline-dashed outline-sky' : ''}`}
                  style={{
                    left: `${s.x * 100}%`,
                    top: `${s.y * 100}%`,
                    width: `${s.size * 100}%`,
                    aspectRatio: '1',
                    transform: `translate(-50%,-50%) rotate(${s.rot}deg)`,
                    touchAction: 'none',
                  }}
                />
              ))}
              {busy && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                  <Spinner label="Menyusun hasil..." />
                </div>
              )}
            </div>
            {renderError && (
              <p className="mt-2 text-sm font-bold text-coral" role="alert">
                {renderError}
              </p>
            )}
          </div>
          <DownloadPanel params={{ mode, photos, frame, filter, caption, dateText }} stickers={stickers} ready={ready} />
        </div>

        <div className="card self-start p-4">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-3" role="tablist" aria-label="Edit hasil">
            {TABS.map((t) => {
              const Icon = t.icon;
              const on = t.id === tab;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-ink px-4 py-1.5 font-display text-sm font-semibold ${on ? 'bg-sun shadow-pop-sm' : 'bg-white'}`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {t.label}
                </button>
              );
            })}
          </div>

          {tab === 'filter' && <FilterSelector value={filter} onChange={p.onFilterChange} />}
          {tab === 'frame' && (
            <div className="space-y-5">
              <FramePicker mode={mode} config={frame} onSelect={(preset) => p.onFrameChange(preset.config)} thumbScale={0.16} />
              <FrameCustomizer config={frame} onChange={p.onFrameChange} remember={p.remember} onRememberChange={p.onRememberChange} />
            </div>
          )}
          {tab === 'stiker' && (
            <StickerPanel
              stickers={stickers}
              selectedId={selectedId}
              onAdd={addSticker}
              onUpdate={updateSticker}
              onRemove={removeSticker}
              onClear={() => {
                setStickers([]);
                setSelectedId(null);
              }}
            />
          )}
          {tab === 'teks' && (
            <TextPanel
              caption={caption}
              dateText={dateText}
              color={frame.labelText}
              onCaption={p.onCaptionChange}
              onDate={p.onDateChange}
              onColor={(c) => p.onFrameChange({ ...frame, labelText: c })}
            />
          )}
        </div>
      </div>
    </section>
  );
}
