import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'subtle';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer tracking-tight';

    const variants = {
      default:
        'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/40 shadow-sm shadow-indigo-600/30 hover:shadow-md hover:shadow-indigo-600/25 active:scale-[0.98]',
      secondary:
        'bg-white dark:bg-white/[0.05] hover:bg-zinc-50 dark:hover:bg-white/[0.08] text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-white/[0.08] shadow-xs active:scale-[0.98]',
      outline:
        'border border-zinc-200 dark:border-white/10 bg-transparent hover:bg-zinc-100/70 dark:hover:bg-white/[0.06] text-zinc-800 dark:text-zinc-200 active:scale-[0.98]',
      ghost:
        'bg-transparent hover:bg-zinc-100/80 dark:hover:bg-white/[0.06] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-[0.98]',
      destructive:
        'bg-rose-600 hover:bg-rose-500 text-white border border-rose-500/30 shadow-xs shadow-rose-600/30 active:scale-[0.98]',
      subtle:
        'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/15 border border-indigo-500/20 active:scale-[0.98]',
    };

    const sizes = {
      xs: 'h-7 px-2.5 text-[11px] rounded-lg gap-1.5',
      sm: 'h-8 px-3 text-xs rounded-xl gap-1.5',
      md: 'h-9 px-3.5 text-xs sm:text-sm rounded-xl gap-2',
      lg: 'h-10 px-5 text-sm rounded-xl gap-2',
      icon: 'h-8 w-8 sm:h-9 sm:w-9 rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
