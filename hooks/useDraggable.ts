'use client';

import { useCallback, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';

function clamp(v: number): number {
  return Math.min(1, Math.max(0, v));
}

/**
 * Drag untuk mouse dan layar sentuh (Pointer Events).
 * `bind(id, x, y)` mengembalikan props untuk elemen yang bisa digeser; x dan y berupa pecahan 0..1.
 */
export function useDraggable(
  containerRef: RefObject<HTMLElement | null>,
  onDrag: (id: string, x: number, y: number) => void,
  onStart?: (id: string) => void,
) {
  const active = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const bind = useCallback(
    (id: string, x: number, y: number) => ({
      onPointerDown: (e: ReactPointerEvent<HTMLElement>) => {
        const el = containerRef.current;
        if (!el) return;
        e.stopPropagation();
        const r = el.getBoundingClientRect();
        e.currentTarget.setPointerCapture(e.pointerId);
        active.current = { id, dx: (e.clientX - r.left) / r.width - x, dy: (e.clientY - r.top) / r.height - y };
        onStart?.(id);
      },
      onPointerMove: (e: ReactPointerEvent<HTMLElement>) => {
        const a = active.current;
        const el = containerRef.current;
        if (!a || a.id !== id || !el) return;
        const r = el.getBoundingClientRect();
        onDrag(id, clamp((e.clientX - r.left) / r.width - a.dx), clamp((e.clientY - r.top) / r.height - a.dy));
      },
      onPointerUp: (e: ReactPointerEvent<HTMLElement>) => {
        active.current = null;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
      },
      onPointerCancel: () => {
        active.current = null;
      },
    }),
    [containerRef, onDrag, onStart],
  );

  return bind;
}
