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
        'inline-flex h-12 items-center justify-start rounded-2xl bg-white/70 dark:bg-zinc-900/70 p-1.5 text-zinc-500 dark:text-zinc-400 border border-zinc-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-sm overflow-x-auto max-w-full gap-1',
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
        'inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 gap-2 cursor-pointer select-none',
        isActive
          ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-md shadow-zinc-950/5 dark:shadow-indigo-500/10 font-semibold border border-zinc-200/80 dark:border-white/10 scale-[1.02]'
          : 'hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50',
        className
      )}
    >
      {icon && <span className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110">{icon}</span>}
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

  return <div className={cn('mt-4 focus-visible:outline-none', className)}>{children}</div>;
}
