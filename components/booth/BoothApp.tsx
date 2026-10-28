'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import type { FilterId, FrameConfig, FramePreset, PhotoMode, PlacedSticker, TimerOption } from '@/lib/types';
import { DEFAULT_CAPTION, formatToday, modeLabel } from '@/lib/constants';
import { cloneConfig } from '@/lib/frameConfig';
import { getPreset, getPresetOrDefault } from '@/lib/frames';
import { clearSavedFrame, loadSavedFrame, saveFrame } from '@/lib/storage';
import { hasCameraSupport } from '@/lib/browserSupport';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ResultView from '@/components/result/ResultView';
import StepNav from './StepNav';
import type { StepId } from './StepNav';
import ModeSelector from './ModeSelector';
import FrameSelector from './FrameSelector';
import TimerSelector from './TimerSelector';
import FilterSelector from './FilterSelector';
import CameraStudio from './CameraStudio';

interface Props {
  initialFrameId?: string;
  initialMode?: string;
}

const emptyPhotos = (n: number) => Array<string | null>(n).fill(null);

export default function BoothApp({ initialFrameId, initialMode }: Props) {
  const startPreset = getPreset(initialFrameId);
  const hasModeParam = initialMode === '4' || initialMode === '6';
  const startMode: PhotoMode = initialMode === '6' ? 6 : 4;

  const [step, setStep] = useState<StepId>(startPreset && hasModeParam ? 'setup' : 'mode');
  const [mode, setMode] = useState<PhotoMode>(startMode);
  const [frame, setFrame] = useState<FrameConfig>(() => cloneConfig(getPresetOrDefault(initialFrameId).config));
  const [remember, setRemember] = useState(false);
  const [timer, setTimer] = useState<TimerOption>(3);
  const [filter, setFilter] = useState<FilterId>('natural');
  const [photos, setPhotos] = useState<(string | null)[]>(() => emptyPhotos(startMode));
  const [stickers, setStickers] = useState<PlacedSticker[]>([]);
  const [caption, setCaption] = useState(DEFAULT_CAPTION);
  const [dateText, setDateText] = useState('');
  const [mirror, setMirror] = useState(true);
  const [busy, setBusy] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);
  const [pendingMode, setPendingMode] = useState<PhotoMode | null>(null);
  const [cameraOk, setCameraOk] = useState(true);

  useEffect(() => {
    setDateText(formatToday());
    setCameraOk(hasCameraSupport());
    if (!startPreset) {
      const saved = loadSavedFrame();
      if (saved) {
        setFrame(saved);
        setRemember(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Peringatan sebelum menutup halaman jika sudah ada foto (foto hanya ada di memori browser).
  useEffect(() => {
    if (!photos.some(Boolean)) return;
    const onUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [photos]);

  const updateFrame = useCallback(
    (cfg: FrameConfig) => {
      setFrame(cfg);
      if (remember) saveFrame(cfg);
    },
    [remember],
  );
  const pickPreset = (p: FramePreset) => updateFrame(cloneConfig(p.config));
  const changeRemember = (v: boolean) => {
    setRemember(v);
    if (v) saveFrame(frame);
    else clearSavedFrame();
  };

  const applyMode = (m: PhotoMode) => {
    setMode(m);
    setPhotos(emptyPhotos(m));
    setStickers([]);
  };
  const chooseMode = (m: PhotoMode) => {
    if (m === mode) return;
    if (photos.some(Boolean)) setPendingMode(m);
    else applyMode(m);
  };
  const newSession = () => {
    setPhotos(emptyPhotos(mode));
    setStickers([]);
    setConfirmNew(false);
    setStep('mode');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <StepNav current={step} locked={busy} onGo={setStep} />

      {step === 'mode' && <ModeSelector mode={mode} onSelect={chooseMode} onNext={() => setStep('frame')} />}

      {step === 'frame' && (
        <FrameSelector
          mode={mode}
          frame={frame}
          onPick={pickPreset}
          onChange={updateFrame}
          remember={remember}
          onRememberChange={changeRemember}
          onBack={() => setStep('mode')}
          onNext={() => setStep('setup')}
        />
      )}

      {step === 'setup' && (
        <section>
          <h1 className="text-3xl font-bold">Atur sesi</h1>
          <p className="mt-1 font-semibold text-ink/70">
            {modeLabel(mode)} · {getPreset(frame.presetId)?.name ?? 'Frame'}
          </p>
          <div className="card mt-5 space-y-6 p-5">
            <div>
              <h2 className="mb-2 font-display text-lg font-bold">Timer</h2>
              <TimerSelector value={timer} onChange={setTimer} />
            </div>
            <div>
              <h2 className="mb-2 font-display text-lg font-bold">Filter</h2>
              <FilterSelector value={filter} onChange={setFilter} />
              <p className="mt-2 text-xs font-semibold text-ink/60">Filter bisa diganti lagi setelah foto selesai.</p>
            </div>
          </div>
          {!cameraOk && (
            <p className="mt-4 rounded-2xl border-2 border-ink bg-sun/40 p-3 text-sm font-semibold" role="alert">
              Browser ini belum mendukung kamera langsung. Kamu tetap bisa lanjut dan memakai foto dari galeri.
            </p>
          )}
          <div className="mt-6 flex justify-between gap-3">
            <Button variant="secondary" icon={<ArrowLeft className="h-5 w-5" aria-hidden />} onClick={() => setStep('frame')}>
              Kembali
            </Button>
            <Button size="lg" icon={<Camera className="h-5 w-5" aria-hidden />} onClick={() => setStep('studio')}>
              Ke studio foto
            </Button>
          </div>
        </section>
      )}

      {step === 'studio' && (
        <CameraStudio
          mode={mode}
          timer={timer}
          filter={filter}
          photos={photos}
          setPhotos={setPhotos}
          mirror={mirror}
          onMirrorChange={setMirror}
          onBack={() => setStep('setup')}
          onDone={() => setStep('result')}
          onBusyChange={setBusy}
        />
      )}

      {step === 'result' && (
        <ResultView
          mode={mode}
          photos={photos}
          frame={frame}
          onFrameChange={updateFrame}
          filter={filter}
          onFilterChange={setFilter}
          stickers={stickers}
          setStickers={setStickers}
          caption={caption}
          onCaptionChange={setCaption}
          dateText={dateText}
          onDateChange={setDateText}
          remember={remember}
          onRememberChange={changeRemember}
          onBack={() => setStep('studio')}
          onNewSession={() => setConfirmNew(true)}
        />
      )}

      <Modal
        open={confirmNew}
        title="Mulai sesi baru?"
        confirmLabel="Ya, mulai baru"
        danger
        onConfirm={newSession}
        onCancel={() => setConfirmNew(false)}
      >
        Foto dan stiker di sesi ini akan dihapus. Pastikan hasilnya sudah kamu unduh.
      </Modal>

      <Modal
        open={pendingMode !== null}
        title="Ganti mode foto?"
        confirmLabel="Ya, ganti"
        danger
        onConfirm={() => {
          if (pendingMode) applyMode(pendingMode);
          setPendingMode(null);
        }}
        onCancel={() => setPendingMode(null)}
      >
        Foto yang sudah diambil akan dihapus karena jumlahnya berbeda.
      </Modal>
    </div>
  );
}
