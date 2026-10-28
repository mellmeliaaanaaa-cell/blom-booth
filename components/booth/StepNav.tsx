'use client';

import { Check } from 'lucide-react';
import { STEPS } from '@/lib/constants';

export type StepId = (typeof STEPS)[number]['id'];

interface Props {
  current: StepId;
  locked: boolean;
  onGo: (step: StepId) => void;
}

export default function StepNav({ current, locked, onGo }: Props) {
  const idx = STEPS.findIndex((s) => s.id === current);
  return (
    <nav aria-label="Langkah" className="mb-6">
      <ol className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {STEPS.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          const clickable = done && !locked;
          return (
            <li key={s.id} className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => onGo(s.id)}
                aria-current={active ? 'step' : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1 font-display text-sm font-semibold transition ${
                  active ? 'bg-sun shadow-pop-sm' : done ? 'bg-mint/70 hover:brightness-105' : 'bg-white text-ink/50'
                } disabled:cursor-default`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-xs text-white">
                  {done ? <Check className="h-3 w-3" aria-hidden /> : i + 1}
                </span>
                {s.label}
              </button>
              {i < STEPS.length - 1 && <span className="h-0.5 w-3 bg-ink/30" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
