import type { Phase } from '@/hooks/useSession';

interface Props {
  phase: Phase;
  count: number | null;
}

/** Overlay di atas preview kamera: aba-aba, angka countdown besar, kilatan, dan jeda antar foto. */
export default function Countdown({ phase, count }: Props) {
  if (phase === 'none') return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-live="assertive">
      {phase === 'flash' && <div className="absolute inset-0 animate-flash bg-white" />}
      {phase === 'ready' && (
        <span className="animate-pop rounded-2xl border-2 border-ink bg-sun px-5 py-2 font-display text-2xl font-bold shadow-pop">
          Siap-siap!
        </span>
      )}
      {phase === 'counting' && count !== null && (
        <span
          key={count}
          className="animate-pop font-display text-[7rem] font-bold leading-none text-white [text-shadow:4px_4px_0_#1F2340] sm:text-[10rem]"
        >
          {count}
        </span>
      )}
      {phase === 'gap' && (
        <span className="animate-pop rounded-2xl border-2 border-ink bg-mint px-5 py-2 font-display text-xl font-bold shadow-pop">
          Ganti pose!
        </span>
      )}
    </div>
  );
}
