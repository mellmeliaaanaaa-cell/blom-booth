import { Loader2 } from 'lucide-react';

export default function Spinner({ label = 'Memuat...' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-bold text-ink/70" role="status">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      {label}
    </span>
  );
}
