'use client';

import React, { useState } from 'react';
import { Activity, X, Sun, Moon, RefreshCw, Terminal, Cpu } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { RateLimitInfo } from '@/lib/schemas';
import { Button } from './ui/button';

interface DevPulseIndicatorProps {
  rateLimit?: RateLimitInfo;
  isDemo?: boolean;
  onResetHome?: () => void;
}

export function DevPulseIndicator({ rateLimit, isDemo, onResetHome }: DevPulseIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-4 left-4 z-50 select-none">
      {/* DevTools Menu Modal */}
      {isOpen && (
        <div className="panel-surface specular-top mb-2.5 w-76 rounded-2xl p-4 text-xs text-zinc-800 dark:text-zinc-200 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-150 border border-zinc-200/90 dark:border-white/10">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-white/[0.08] pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 rounded-md bg-indigo-600 text-white shadow-xs">
                <Cpu className="w-3 h-3" />
              </div>
              <span className="font-bold tracking-tight text-zinc-950 dark:text-zinc-100 text-[11px] font-mono uppercase">
                System Diagnostics
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-white/[0.04]">
              <span className="text-zinc-500 dark:text-zinc-400">Environment:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                Next.js 16 (App Router)
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-white/[0.04]">
              <span className="text-zinc-500 dark:text-zinc-400">CSS Engine:</span>
              <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                Tailwind CSS v4
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-white/[0.04]">
              <span className="text-zinc-500 dark:text-zinc-400">API Quota:</span>
              <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                {rateLimit ? `${rateLimit.remaining} / ${rateLimit.limit}` : 'Ready'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-white/[0.04]">
              <span className="text-zinc-500 dark:text-zinc-400">Data Source:</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                {isDemo ? 'Curated Demo Data' : 'Live GitHub API'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-zinc-500 dark:text-zinc-400">Theme:</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/[0.06] hover:bg-zinc-200 dark:hover:bg-white/[0.1] transition-colors font-medium cursor-pointer"
              >
                {theme === 'dark' ? (
                  <>
                    <Moon className="w-3 h-3 text-indigo-400" />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>Light</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {onResetHome && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                onResetHome();
                setIsOpen(false);
              }}
              className="mt-3 w-full text-[11px] gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset to Default Profile</span>
            </Button>
          )}
        </div>
      )}

      {/* Floating launcher trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="DevPulse System Diagnostics"
        className="group relative flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white/[0.08] text-white hover:bg-zinc-800 dark:hover:bg-white/[0.12] border border-white/10 shadow-lg shadow-black/20 hover:scale-105 active:scale-95 transition-all duration-150 focus:outline-none cursor-pointer"
        title="System Diagnostics & Quota"
      >
        <Activity className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
        </span>
      </button>
    </div>
  );
}
