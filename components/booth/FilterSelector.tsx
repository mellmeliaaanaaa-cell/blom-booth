'use client';

import type { FilterId } from '@/lib/types';
import { FILTERS } from '@/lib/filters';

export default function FilterSelector({ value, onChange }: { value: FilterId; onChange: (f: FilterId) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Filter foto">
      {FILTERS.map((f) => {
        const on = f.id === value;
        return (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(f.id)}
            className={`rounded-xl border-2 border-ink p-1.5 text-center transition ${on ? 'bg-sun shadow-pop-sm' : 'bg-white hover:bg-cream'}`}
          >
            <span
              className="block h-12 w-full rounded-lg"
              style={{
                background: 'linear-gradient(135deg,#ffb38a,#ff7eb3 35%,#7ee8fa 70%,#80ff72)',
                filter: f.css === 'none' ? undefined : f.css,
              }}
            />
            <span className="mt-1 block text-xs font-bold">{f.label}</span>
          </button>
        );
      })}
    </div>
  );
}
