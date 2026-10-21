import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' | 'indigo' | 'cyan' | 'purple';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-zinc-900 text-zinc-50 dark:bg-white dark:text-zinc-950 shadow-xs font-semibold',
    secondary: 'bg-zinc-100 text-zinc-700 dark:bg-white/[0.06] dark:text-zinc-300 border border-zinc-200/80 dark:border-white/[0.08]',
    outline: 'border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 bg-transparent',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-medium',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-medium',
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-medium',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-medium',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-tight transition-all select-none',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
