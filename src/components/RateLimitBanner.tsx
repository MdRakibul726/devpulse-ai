'use client';

import React from 'react';
import { ShieldAlert, Sparkles, KeyRound, CheckCircle2 } from 'lucide-react';
import { RateLimitInfo } from '@/lib/schemas';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface RateLimitBannerProps {
  rateLimit?: RateLimitInfo;
  isDemo?: boolean;
  onSwitchToDemo?: () => void;
}

export function RateLimitBanner({ rateLimit, isDemo, onSwitchToDemo }: RateLimitBannerProps) {
  if (!rateLimit) return null;

  const isLow = rateLimit.remaining <= 10 && !isDemo;
  const isExceeded = rateLimit.isExceeded;
  const quotaPercent = rateLimit.limit > 0 ? Math.round((rateLimit.remaining / rateLimit.limit) * 100) : 100;

  if (isDemo) {
    return (
      <div className="panel-surface specular-top rounded-2xl p-3 sm:px-4 mb-6 flex items-center justify-between flex-wrap gap-3 text-xs border border-indigo-500/20 bg-indigo-500/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-lg bg-indigo-500/15 text-indigo-500 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                Curated Demo Mode
              </span>
              <Badge variant="indigo" className="text-[10px] py-0 px-1.5 font-mono">
                Zero Rate Limits
              </Badge>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Exploring curated high-fidelity GitHub development data with full feature availability.
            </p>
          </div>
        </div>

        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
          <span>Add <code className="font-mono text-zinc-700 dark:text-zinc-300">GITHUB_TOKEN</code> to <code className="font-mono text-zinc-700 dark:text-zinc-300">.env.local</code> for 5,000 req/hr</span>
        </div>
      </div>
    );
  }

  if (isExceeded) {
    return (
      <div className="panel-surface rounded-2xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3 text-xs border border-rose-500/30 bg-rose-500/[0.05]">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
          <div>
            <p className="font-semibold text-rose-600 dark:text-rose-400">
              GitHub API Hourly Rate Limit Reached
            </p>
            <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 mt-0.5">
              Unauthenticated queries reached 60/hr. Resets at {rateLimit.resetDate}.
            </p>
          </div>
        </div>
        {onSwitchToDemo && (
          <Button
            size="xs"
            variant="destructive"
            onClick={onSwitchToDemo}
            className="text-xs"
          >
            Switch to Demo Mode
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="panel-surface specular-top rounded-xl px-4 py-2 text-xs text-zinc-500 dark:text-zinc-400 mb-6 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <span className="flex h-2 w-2 relative">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLow ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
        </span>
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          GitHub API Quota:{' '}
          <strong className="text-zinc-950 dark:text-white font-mono tabular-nums">
            {rateLimit.remaining}
          </strong>{' '}
          / <span className="font-mono tabular-nums">{rateLimit.limit}</span> remaining
        </span>
      </div>

      <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400">
        <span>Resets at: {rateLimit.resetDate}</span>
      </div>
    </div>
  );
}
