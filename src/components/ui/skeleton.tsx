import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'skeleton-shimmer rounded-xl border border-zinc-200/50 dark:border-white/[0.04]',
        className
      )}
      {...props}
    />
  );
}
