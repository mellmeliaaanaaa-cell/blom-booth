'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { TimerOption } from '@/lib/types';

export type SessionStatus = 'idle' | 'running' | 'paused';
export type Phase = 'none' | 'ready' | 'counting' | 'flash' | 'gap';

interface Options {
  timer: TimerOption;
  photos: (string | null)[];
  setPhotos: Dispatch<SetStateAction<(string | null)[]>>;
  capture: () => string | null;
}

/**
 * Mengatur jalannya sesi foto: countdown, pengambilan otomatis, jeda, batal, dan retake.
 * Hanya satu sesi yang bisa berjalan pada satu waktu.
 */
export function useSession({ timer, photos, setPhotos, capture }: Options) {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [phase, setPhase] = useState<Phase>('none');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualTarget, setManualTarget] = useState<number | null>(null);

  const token = useRef(0);
  const running = useRef(false);
  const wake = useRef<(() => void) | null>(null);
  const photosRef = useRef(photos);
  photosRef.current = photos;
  const captureRef = useRef(capture);
  captureRef.current = capture;
  const timerRef = useRef(timer);
  timerRef.current = timer;

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
      const id = setTimeout(() => {
        wake.current = null;
        resolve();
      }, ms);
      wake.current = () => {
        clearTimeout(id);
        wake.current = null;
        resolve();
      };
    });

  const store = useCallback(
    (idx: number, shot: string) => setPhotos((prev) => prev.map((p, i) => (i === idx ? shot : p))),
    [setPhotos],
  );

  const halt = useCallback((next: SessionStatus) => {
    token.current += 1;
    running.current = false;
    wake.current?.();
    setPhase('none');
    setCountdown(null);
    setCurrent(null);
    setStatus(next);
  }, []);

  const run = useCallback(
    async (targets: number[]) => {
      if (running.current || targets.length === 0) return;
      running.current = true;
      token.current += 1;
      const my = token.current;
      const alive = () => token.current === my;
      setStatus('running');
      setError(null);

      for (const idx of targets) {
        if (!alive()) return;
        setCurrent(idx);
        setPhase('ready');
        await sleep(900);
        if (!alive()) return;
        setPhase('counting');
        for (let s = timerRef.current; s > 0; s--) {
          setCountdown(s);
          await sleep(1000);
          if (!alive()) return;
        }
        setCountdown(null);
        const shot = captureRef.current();
        if (!shot) {
          setError('Gagal mengambil foto. Pastikan kamera aktif dan coba lagi.');
          halt('paused');
          return;
        }
        store(idx, shot);
        setPhase('flash');
        await sleep(450);
        if (!alive()) return;
        setPhase('gap');
        await sleep(700);
        if (!alive()) return;
      }
      running.current = false;
      setPhase('none');
      setCurrent(null);
      setStatus('idle');
    },
    [halt, store],
  );

  const emptyTargets = (): number[] =>
    photosRef.current.map((p, i) => (p ? -1 : i)).filter((i) => i >= 0);

  /** Mulai sesi, atau lanjutkan mengisi foto yang masih kosong. */
  const startRemaining = useCallback(() => {
    void run(emptyTargets());
  }, [run]);

  const pause = useCallback(() => halt('paused'), [halt]);
  const cancel = useCallback(() => {
    halt('idle');
    setManualTarget(null);
    setError(null);
  }, [halt]);

  const retake = useCallback(
    (i: number) => {
      if (running.current) return;
      if (timerRef.current === 0) setManualTarget(i);
      else void run([i]);
    },
    [run],
  );

  /** Mode tanpa timer: ambil satu foto sekarang juga. */
  const snap = useCallback(() => {
    const target = manualTarget ?? emptyTargets()[0];
    if (target === undefined) return;
    const shot = captureRef.current();
    if (!shot) {
      setError('Gagal mengambil foto. Pastikan kamera aktif dan coba lagi.');
      return;
    }
    setError(null);
    store(target, shot);
    setManualTarget(null);
    setPhase('flash');
    setTimeout(() => setPhase('none'), 450);
  }, [manualTarget, store]);

  useEffect(
    () => () => {
      token.current += 1;
      running.current = false;
      wake.current?.();
    },
    [],
  );

  return { status, phase, countdown, current, error, manualTarget, startRemaining, pause, cancel, retake, snap };
}
