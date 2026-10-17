'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert, Sparkles, KeyRound } from 'lucide-react';
import { RateLimitInfo } from '@/lib/schemas';
import { Badge } from './ui/badge';

interface RateLimitBannerProps {
  rateLimit?: RateLimitInfo;
  isDemo?: boolean;
  onSwitchToDemo?: () => void;
}

export function RateLimitBanner({ rateLimit, isDemo, onSwitchToDemo }: RateLimitBannerProps) {
  if (!rateLimit) return null;

  const isLow = rateLimit.remaining <= 10 && !isDemo;
  const isExceeded = rateLimit.isExceeded;

  if (isDemo) {
    return (
      <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-cyan-500/5 to-transparent p-3.5 mb-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              Demo Profile Loaded
              <Badge variant="indigo" className="text-[10px] py-0 px-2">Offline Ready</Badge>
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Exploring curated high-fidelity GitHub statistics with zero rate-limit constraints.
            </p>
          </div>
        </div>
        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
          <span>Add <code>GITHUB_TOKEN</code> to <code>.env.local</code> for unlimited live queries</span>
        </div>
      </div>
    );
  }

  if (isExceeded) {
    return (
      <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3.5 mb-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              GitHub API Rate Limit Reached
            </p>
            <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80">
              Unauthenticated GitHub API limit reached (60/hr). Resets at {rateLimit.resetDate}.
            </p>
          </div>
        </div>
        {onSwitchToDemo && (
          <button
            onClick={onSwitchToDemo}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors shadow-sm"
          >
            Switch to Demo Mode
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/40 text-[11px] text-zinc-500 dark:text-zinc-400 mb-6">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLow ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
        </span>
        <span>
          GitHub API Quota: <strong className="text-zinc-700 dark:text-zinc-300">{rateLimit.remaining}</strong> / {rateLimit.limit} remaining
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-2">
        <span>Resets at: {rateLimit.resetDate}</span>
      </div>
    </div>
  );
}
