'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ActivityPoint } from '@/lib/schemas';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { GitCommit, TrendingUp } from 'lucide-react';

interface ActivityTimelineProps {
  activity: ActivityPoint[];
}

export function ActivityTimeline({ activity }: ActivityTimelineProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalEvents = activity.reduce((sum, item) => sum + item.total, 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            14-Day Activity Pulse
          </CardTitle>
          <span className="text-[11px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {totalEvents} events in 14 days
          </span>
        </div>
        <CardDescription>Daily commit, pull request, and issue distribution</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="h-56 w-full">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="prGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#71717a' }}
                  tickLine={false}
                  axisLine={{ stroke: '#3f3f46', opacity: 0.2 }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: '#71717a' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ActivityPoint;
                      return (
                        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 p-3 shadow-md text-xs backdrop-blur-sm">
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-1 mb-1.5">
                            Activity on {label}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-4 text-indigo-500">
                              <span>Commits:</span>
                              <strong className="font-mono">{data.commits}</strong>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-emerald-500">
                              <span>Pull Requests:</span>
                              <strong className="font-mono">{data.pullRequests}</strong>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-amber-500">
                              <span>Issues:</span>
                              <strong className="font-mono">{data.issues}</strong>
                            </div>
                            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-1 flex items-center justify-between gap-4 text-zinc-800 dark:text-zinc-200 font-bold">
                              <span>Total:</span>
                              <strong className="font-mono">{data.total}</strong>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="commits"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#commitGradient)"
                  name="Commits"
                />
                <Area
                  type="monotone"
                  dataKey="pullRequests"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#prGradient)"
                  name="Pull Requests"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <div className="w-full h-32 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 animate-pulse" />
            </div>
          )}
        </div>

        {/* Legend info */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-center gap-6 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>Commits</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Pull Requests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Issues</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
