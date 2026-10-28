'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'mint' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'border-ink bg-sun text-ink shadow-pop hover:brightness-105',
  secondary: 'border-ink bg-white text-ink shadow-pop hover:bg-cream',
  mint: 'border-ink bg-mint text-ink shadow-pop hover:brightness-105',
  danger: 'border-ink bg-coral text-white shadow-pop hover:brightness-105',
  ghost: 'border-transparent bg-transparent text-ink hover:bg-ink/5',
};

const SIZES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  children,
  disabled,
  type = 'button',
  ...rest
}: Props) {
  const press = variant === 'ghost' ? '' : 'active:translate-x-[3px] active:translate-y-[3px] active:shadow-none';
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border-2 font-display font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${press} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
}
