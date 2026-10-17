import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' | 'indigo';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-zinc-900 text-zinc-50 dark:bg-white dark:text-zinc-950 shadow-xs font-semibold',
    secondary: 'bg-zinc-100 text-zinc-800 dark:bg-white/[0.08] dark:text-zinc-200 border border-zinc-200/60 dark:border-white/[0.08]',
    outline: 'border border-zinc-200/90 dark:border-white/[0.1] text-zinc-700 dark:text-zinc-300 bg-white/40 dark:bg-white/[0.02] backdrop-blur-sm',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 font-semibold',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 font-semibold',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25 font-semibold',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 font-semibold',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all select-none',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
