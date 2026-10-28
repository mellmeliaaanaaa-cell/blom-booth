'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CameraOff,
  Check,
  FlipHorizontal2,
  ImagePlus,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  SwitchCamera,
} from 'lucide-react';
import type { FilterId, PhotoMode, TimerOption } from '@/lib/types';
import { getLayout } from '@/lib/layouts';
import { getFilter } from '@/lib/filters';
import { detectInAppBrowser } from '@/lib/browserSupport';
import { fileToPhoto } from '@/lib/image';
import { useCamera } from '@/hooks/useCamera';
import { useSession } from '@/hooks/useSession';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import Countdown from './Countdown';
import ShotTray from './ShotTray';

interface Props {
  mode: PhotoMode;
  timer: TimerOption;
  filter: FilterId;
  photos: (string | null)[];
  setPhotos: Dispatch<SetStateAction<(string | null)[]>>;
  mirror: boolean;
  onMirrorChange: (v: boolean) => void;
  onBack: () => void;
  onDone: () => void;
  onBusyChange: (busy: boolean) => void;
}

export default function CameraStudio({
  mode,
  timer,
  filter,
  photos,
  setPhotos,
  mirror,
  onMirrorChange,
  onBack,
  onDone,
  onBusyChange,
}: Props) {
  const cam = useCamera();
  const capture = useCallback(() => cam.capture(mirror), [cam.capture, mirror]);
  const session = useSession({ timer, photos, setPhotos, capture });

  const [inApp, setInApp] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const layout = getLayout(mode);
  const filterCss = getFilter(filter).css;
  const active = cam.status === 'active';
  const running = session.status === 'running';
  const filled = photos.filter(Boolean).length;
  const full = filled === mode;
  const manual = timer === 0;

  useEffect(() => setInApp(detectInAppBrowser()), []);
  useEffect(() => {
    if (active) onMirrorChange(cam.facing === 'user');
  }, [active, cam.facing, onMirrorChange]);
  useEffect(() => {
    onBusyChange(running);
  }, [running, onBusyChange]);
  useEffect(() => () => onBusyChange(false), [onBusyChange]);
  useEffect(() => {
    if (!active && running) session.pause();
  }, [active, running, session.pause]);

  const askReset = () => {
    if (running) session.pause();
    setConfirmReset(true);
  };
  const doReset = () => {
    session.cancel();
    setPhotos(Array<string | null>(mode).fill(null));
    setConfirmReset(false);
  };

  const onFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!files.length) return;
    setUploadBusy(true);
    setUploadError(null);
    try {
      const empties = photos.map((p, i) => (p ? -1 : i)).filter((i) => i >= 0);
      const idxs = empties.length ? empties : photos.map((_, i) => i);
      const results = await Promise.all(files.slice(0, idxs.length).map((f) => fileToPhoto(f)));
      setPhotos((prev) =>
        prev.map((p, i) => {
          const k = idxs.indexOf(i);
          return k >= 0 && k < results.length ? results[k] : p;
        }),
      );
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Gagal membaca foto dari galeri.');
    } finally {
      setUploadBusy(false);
    }
  };

  const primary = () => {
    if (manual && session.manualTarget !== null) {
      return (
        <Button size="lg" icon={<Camera className="h-5 w-5" aria-hidden />} disabled={!active} onClick={session.snap}>
          Ambil ulang foto {session.manualTarget + 1}
        </Button>
      );
    }
    if (full && !running) {
      return (
        <Button size="lg" variant="mint" icon={<Check className="h-5 w-5" aria-hidden />} onClick={onDone}>
          Lihat Hasil
        </Button>
      );
    }
    if (manual) {
      return (
        <Button size="lg" icon={<Camera className="h-5 w-5" aria-hidden />} disabled={!active} onClick={session.snap}>
          Ambil Foto {filled + 1}/{mode}
        </Button>
      );
    }
    if (running) {
      return (
        <Button size="lg" variant="secondary" icon={<Pause className="h-5 w-5" aria-hidden />} onClick={session.pause}>
          Jeda
        </Button>
      );
    }
    return (
      <Button size="lg" icon={<Play className="h-5 w-5" aria-hidden />} disabled={!active} onClick={session.startRemaining}>
        {filled > 0 ? 'Lanjutkan' : 'Mulai Sesi'}
      </Button>
    );
  };

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Studio foto</h1>
          <p className="font-semibold text-ink/70">
            {manual ? 'Tekan tombol untuk setiap foto.' : `Timer ${timer} detik, foto diambil otomatis.`}
          </p>
        </div>
        <Button variant="secondary" icon={<ArrowLeft className="h-5 w-5" aria-hidden />} disabled={running} onClick={onBack}>
          Kembali
        </Button>
      </div>

      {inApp && (
        <div className="mb-4 flex gap-3 rounded-2xl border-2 border-ink bg-sun/40 p-3 text-sm font-semibold" role="alert">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <p>
            Kamu membuka Bloom Booth lewat {inApp}. Browser di dalam aplikasi sering memblokir kamera. Buka link ini di Chrome atau Safari
            (menu titik tiga, lalu &quot;Buka di browser&quot;). Atau pakai foto dari galeri.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div
            className="relative overflow-hidden rounded-3xl border-2 border-ink bg-ink shadow-pop"
            style={{ aspectRatio: layout.cellAspect }}
          >
            <video
              ref={cam.videoRef}
              playsInline
              muted
              autoPlay
              className={`h-full w-full object-cover ${active ? '' : 'hidden'}`}
              style={{
                transform: mirror ? 'scaleX(-1)' : undefined,
                filter: filterCss === 'none' ? undefined : filterCss,
                objectPosition: '50% 40%',
              }}
            />

            {!active && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-sky/40 to-grape/40 p-4 text-center">
                {cam.status === 'requesting' ? (
                  <Spinner label="Menunggu izin kamera..." />
                ) : (
                  <>
                    <CameraOff className="h-10 w-10 text-white" aria-hidden />
                    <Button icon={<Camera className="h-5 w-5" aria-hidden />} onClick={() => cam.start()}>
                      Aktifkan Kamera
                    </Button>
                  </>
                )}
              </div>
            )}

            {active && <Countdown phase={session.phase} count={session.countdown} />}
            {active && running && session.current !== null && (
              <span className="absolute left-3 top-3 rounded-full border-2 border-ink bg-white px-3 py-1 font-display text-sm font-bold">
                Foto {session.current + 1} dari {mode}
              </span>
            )}
          </div>

          {cam.status === 'idle' && (
            <p className="mt-3 flex gap-2 rounded-2xl border-2 border-ink/20 bg-white p-3 text-sm font-semibold">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-mint" aria-hidden />
              Bloom Booth meminta izin kamera lewat browser untuk menampilkan preview dan mengambil foto. Gambar hanya diproses di
              perangkatmu dan tidak dikirim ke server.
            </p>
          )}

          {cam.error && (
            <div className="mt-3 rounded-2xl border-2 border-ink bg-coral/15 p-4" role="alert">
              <p className="flex items-center gap-2 font-display text-lg font-bold">
                <AlertTriangle className="h-5 w-5" aria-hidden />
                {cam.error.title}
              </p>
              <p className="mt-1 text-sm font-semibold">{cam.error.hint}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => cam.start()}>
                  Coba lagi
                </Button>
                <Button size="sm" variant="secondary" icon={<ImagePlus className="h-4 w-4" aria-hidden />} onClick={() => fileRef.current?.click()}>
                  Pakai foto dari galeri
                </Button>
              </div>
            </div>
          )}

          {active && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {cam.devices.length > 1 && (
                <select
                  className="field max-w-[14rem]"
                  aria-label="Pilih kamera"
                  value={cam.deviceId ?? ''}
                  disabled={running}
                  onChange={(e) => cam.start({ deviceId: e.target.value })}
                >
                  {cam.devices.map((d, i) => (
                    <option key={d.deviceId || i} value={d.deviceId}>
                      {d.label || `Kamera ${i + 1}`}
                    </option>
                  ))}
                </select>
              )}
              {cam.canSwitch && (
                <Button variant="secondary" size="sm" icon={<SwitchCamera className="h-4 w-4" aria-hidden />} disabled={running} onClick={cam.switchCamera}>
                  Ganti kamera
                </Button>
              )}
              <Button
                variant={mirror ? 'mint' : 'secondary'}
                size="sm"
                icon={<FlipHorizontal2 className="h-4 w-4" aria-hidden />}
                aria-pressed={mirror}
                disabled={running}
                onClick={() => onMirrorChange(!mirror)}
              >
                Cermin
              </Button>
              <Button variant="secondary" size="sm" disabled={running} onClick={cam.stop}>
                Hentikan kamera
              </Button>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {primary()}
            {(filled > 0 || running) && (
              <Button variant="secondary" icon={<RotateCcw className="h-4 w-4" aria-hidden />} onClick={askReset}>
                {running ? 'Batal sesi' : 'Ulang semua'}
              </Button>
            )}
          </div>
          {session.error && (
            <p className="mt-3 text-sm font-bold text-coral" role="alert">
              {session.error}
            </p>
          )}
        </div>

        <aside className="card self-start p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Foto kamu</h2>
            <span className="chip">
              {filled}/{mode}
            </span>
          </div>
          <ShotTray
            photos={photos}
            aspect={layout.cellAspect}
            filterCss={filterCss}
            currentIndex={session.current ?? session.manualTarget}
            disabled={running || !active}
            onRetake={session.retake}
          />
          {!active && filled > 0 && <p className="mt-2 text-xs font-semibold text-ink/60">Aktifkan kamera untuk mengulang satu foto.</p>}

          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onFiles} />
          <Button
            variant="secondary"
            size="sm"
            className="mt-4 w-full"
            icon={<ImagePlus className="h-4 w-4" aria-hidden />}
            loading={uploadBusy}
            disabled={running}
            onClick={() => fileRef.current?.click()}
          >
            Pakai foto dari galeri
          </Button>
          {uploadError && (
            <p className="mt-2 text-xs font-bold text-coral" role="alert">
              {uploadError}
            </p>
          )}
        </aside>
      </div>

      <Modal
        open={confirmReset}
        title="Hapus semua foto?"
        confirmLabel="Ya, hapus"
        danger
        onConfirm={doReset}
        onCancel={() => setConfirmReset(false)}
      >
        Semua foto di sesi ini akan dihapus dan kamu mulai dari awal.
      </Modal>
    </section>
  );
}
