'use client';

import type { TimerOption } from '@/lib/types';
import { TIMER_OPTIONS } from '@/lib/constants';

export default function TimerSelector({ value, onChange }: { value: TimerOption; onChange: (t: TimerOption) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="radiogroup" aria-label="Timer">
      {TIMER_OPTIONS.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`rounded-2xl border-2 border-ink p-3 text-left transition ${on ? 'bg-sun shadow-pop-sm' : 'bg-white hover:bg-cream'}`}
          >
            <span className="block font-display text-lg font-bold">{o.label}</span>
            <span className="block text-xs font-semibold text-ink/70">{o.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
