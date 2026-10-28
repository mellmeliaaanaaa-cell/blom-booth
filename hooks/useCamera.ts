'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { isMobileDevice } from '@/lib/browserSupport';

export type Facing = 'user' | 'environment';
export type CameraStatus = 'idle' | 'requesting' | 'active' | 'error';
export interface CameraProblem {
  title: string;
  hint: string;
}

function describeError(err: unknown): CameraProblem {
  const name = (err as { name?: string } | null)?.name ?? '';
  switch (name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
    case 'SecurityError':
      return {
        title: 'Izin kamera ditolak',
        hint: 'Klik ikon gembok atau kamera di address bar, ubah izin Kamera menjadi "Izinkan", lalu muat ulang halaman. Di iPhone: Pengaturan > Safari > Kamera.',
      };
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return {
        title: 'Kamera tidak ditemukan',
        hint: 'Pastikan perangkat punya kamera dan tidak dinonaktifkan. Kamu juga bisa memakai foto dari galeri.',
      };
    case 'NotReadableError':
    case 'TrackStartError':
    case 'AbortError':
      return {
        title: 'Kamera sedang dipakai aplikasi lain',
        hint: 'Tutup aplikasi atau tab lain yang memakai kamera (Zoom, Meet, kamera bawaan), lalu coba lagi.',
      };
    case 'OverconstrainedError':
      return { title: 'Kamera tidak cocok dengan pengaturan', hint: 'Coba pilih kamera lain dari daftar kamera.' };
    default:
      return { title: 'Kamera tidak bisa dibuka', hint: 'Muat ulang halaman lalu coba lagi. Jika masih gagal, pakai foto dari galeri.' };
  }
}

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mounted = useRef(true);
  const facingRef = useRef<Facing>('user');

  const [status, setStatus] = useState<CameraStatus>('idle');
  const [error, setError] = useState<CameraProblem | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [facing, setFacing] = useState<Facing>('user');
  const [mobile, setMobile] = useState(false);

  useEffect(() => setMobile(isMobileDevice()), []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    const v = videoRef.current;
    if (v) v.srcObject = null;
  }, []);

  const refreshDevices = useCallback(async () => {
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      if (mounted.current) setDevices(all.filter((d) => d.kind === 'videoinput'));
    } catch {
      /* daftar kamera tidak wajib */
    }
  }, []);

  const start = useCallback(
    async (opts: { deviceId?: string | null; facing?: Facing } = {}) => {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError(
          window.isSecureContext
            ? { title: 'Browser belum mendukung kamera', hint: 'Coba Chrome, Safari, Edge, atau Firefox versi terbaru. Atau pakai foto dari galeri.' }
            : { title: 'Kamera butuh koneksi aman (HTTPS)', hint: 'Buka website lewat alamat https:// agar browser mengizinkan kamera.' },
        );
        setStatus('error');
        return;
      }
      stopStream();
      setStatus('requesting');
      setError(null);

      const wantFacing = opts.facing ?? facingRef.current;
      const size = { width: { ideal: 1280 }, height: { ideal: 960 } };
      const attempts: MediaStreamConstraints[] = [];
      if (opts.deviceId) attempts.push({ video: { ...size, deviceId: { exact: opts.deviceId } }, audio: false });
      attempts.push({ video: { ...size, facingMode: { ideal: wantFacing } }, audio: false });
      attempts.push({ video: true, audio: false });

      let stream: MediaStream | null = null;
      let lastErr: unknown = null;
      for (const c of attempts) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(c);
          break;
        } catch (e) {
          lastErr = e;
          const n = (e as { name?: string } | null)?.name;
          if (n === 'NotAllowedError' || n === 'SecurityError' || n === 'NotReadableError' || n === 'AbortError') break;
        }
      }

      if (!stream) {
        if (mounted.current) {
          setError(describeError(lastErr));
          setStatus('error');
        }
        return;
      }
      if (!mounted.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;
      const track = stream.getVideoTracks()[0];
      track.addEventListener('ended', () => {
        if (streamRef.current === stream) {
          stopStream();
          if (mounted.current) {
            setError({ title: 'Kamera terputus', hint: 'Pastikan kamera masih terhubung, lalu tekan Aktifkan Kamera lagi.' });
            setStatus('error');
          }
        }
      });
      const settings = track.getSettings();
      const f: Facing = settings.facingMode === 'environment' ? 'environment' : 'user';
      facingRef.current = f;
      setFacing(f);
      setDeviceId(settings.deviceId ?? null);

      const v = videoRef.current;
      if (v) {
        v.srcObject = stream;
        try {
          await v.play();
        } catch {
          /* autoplay bisa menolak, video tetap tampil saat siap */
        }
      }
      await refreshDevices();
      if (mounted.current) setStatus('active');
    },
    [refreshDevices, stopStream],
  );

  const stop = useCallback(() => {
    stopStream();
    setStatus('idle');
  }, [stopStream]);

  const switchCamera = useCallback(async () => {
    if (mobile) {
      await start({ facing: facingRef.current === 'user' ? 'environment' : 'user' });
      return;
    }
    if (devices.length > 1) {
      const i = devices.findIndex((d) => d.deviceId === deviceId);
      const next = devices[(i + 1) % devices.length];
      await start({ deviceId: next.deviceId });
    }
  }, [mobile, devices, deviceId, start]);

  /** Mengambil frame dari video. Jika `mirror` true, hasil dibalik seperti yang terlihat di preview. */
  const capture = useCallback((mirror: boolean): string | null => {
    const v = videoRef.current;
    if (!v || v.readyState < 2 || !v.videoWidth) return null;
    const c = document.createElement('canvas');
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext('2d');
    if (!ctx) return null;
    if (mirror) {
      ctx.translate(c.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(v, 0, 0);
    return c.toDataURL('image/jpeg', 0.92);
  }, []);

  useEffect(() => {
    mounted.current = true;
    const onHide = () => stopStream();
    window.addEventListener('pagehide', onHide);
    return () => {
      mounted.current = false;
      window.removeEventListener('pagehide', onHide);
      stopStream();
    };
  }, [stopStream]);

  return {
    videoRef,
    status,
    error,
    devices,
    deviceId,
    facing,
    canSwitch: mobile || devices.length > 1,
    start,
    stop,
    switchCamera,
    capture,
  };
}
