'use client';

import React, { useState } from 'react';
import { Activity, X, ChevronUp, Sun, Moon, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { RateLimitInfo } from '@/lib/schemas';

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
        <div className="mb-2 w-72 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl p-4 text-xs text-zinc-800 dark:text-zinc-200 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white shadow-sm">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                DevPulse Tools
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between py-1 border-b border-zinc-100/60 dark:border-zinc-800/60">
              <span className="text-zinc-400">Route:</span>
              <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                / (Static)
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-zinc-100/60 dark:border-zinc-800/60">
              <span className="text-zinc-400">Bundler:</span>
              <span className="font-mono font-medium text-indigo-500">
                Webpack + PostCSS
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-zinc-100/60 dark:border-zinc-800/60">
              <span className="text-zinc-400">GitHub Quota:</span>
              <span className="font-mono font-semibold">
                {rateLimit ? `${rateLimit.remaining} / ${rateLimit.limit}` : 'Ready'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-zinc-100/60 dark:border-zinc-800/60">
              <span className="text-zinc-400">Profile Mode:</span>
              <span className="font-medium text-cyan-600 dark:text-cyan-400">
                {isDemo ? 'Demo Mode' : 'Live GitHub API'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-zinc-400">Active Theme:</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors font-medium text-[11px]"
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
            <button
              onClick={() => {
                onResetHome();
                setIsOpen(false);
              }}
              className="mt-3 w-full py-1.5 px-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors text-center flex items-center justify-center gap-1.5 text-[11px]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset to Default Profile</span>
            </button>
          )}
        </div>
      )}

      {/* Floating DevPulse Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="DevPulse Tools Indicator"
        className="group relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none ring-2 ring-white/20"
        title="DevPulse Tools"
      >
        <Activity className="w-5 h-5 group-hover:animate-pulse" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-300"></span>
        </span>
      </button>
    </div>
  );
}
