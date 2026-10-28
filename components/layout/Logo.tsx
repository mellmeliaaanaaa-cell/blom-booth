export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
        <rect x="4" y="12" width="40" height="28" rx="9" fill="#FFC93C" stroke="#1F2340" strokeWidth="3" />
        <rect x="15" y="6" width="14" height="9" rx="3" fill="#4CC9F0" stroke="#1F2340" strokeWidth="3" />
        <circle cx="24" cy="27" r="10" fill="#fff" stroke="#1F2340" strokeWidth="3" />
        <circle cx="24" cy="27" r="4" fill="#FF8FB8" stroke="#1F2340" strokeWidth="2" />
      </svg>
      <span className="font-display text-2xl font-bold tracking-tight">
        Bloom<span className="text-coral"> Booth</span>
      </span>
    </span>
  );
}
