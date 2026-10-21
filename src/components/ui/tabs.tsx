'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  value: string;
  onValueChange: (val: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export function Tabs({
  value,
  onValueChange,
  defaultValue,
  children,
  className,
}: {
  value?: string;
  onValueChange?: (val: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [current, setCurrent] = React.useState<string>(defaultValue || '');
  const activeValue = value !== undefined ? value : current;
  const handleValueChange = onValueChange || setCurrent;

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'inline-flex h-11 items-center justify-start rounded-xl bg-zinc-200/60 dark:bg-white/[0.04] p-1 text-zinc-500 dark:text-zinc-400 border border-zinc-200/80 dark:border-white/[0.06] backdrop-blur-md overflow-x-auto max-w-full gap-1 scrollbar-none',
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
  icon,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('TabsTrigger must be within Tabs');
  const isActive = ctx.value === value;

  return (
    <button
      type="button"
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        'group inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:pointer-events-none disabled:opacity-50 gap-2 cursor-pointer select-none tracking-tight',
        isActive
          ? 'bg-white dark:bg-white/[0.1] text-zinc-950 dark:text-white shadow-xs font-semibold border border-black/5 dark:border-white/[0.1]'
          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]',
        className
      )}
    >
      {icon && <span className={cn('w-3.5 h-3.5 shrink-0 transition-opacity', isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100')}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('TabsContent must be within Tabs');
  if (ctx.value !== value) return null;

  return (
    <div
      role="tabpanel"
      tabIndex={0}
      className={cn('mt-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded-xl', className)}
    >
      {children}
    </div>
  );
}
