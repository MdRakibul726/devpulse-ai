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
import { TrendingUp } from 'lucide-react';

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
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            14-Day Activity Pulse
          </CardTitle>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 tabular-nums">
            {totalEvents} events
          </span>
        </div>
        <CardDescription>Daily commit, pull request, and issue distribution</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-0">
        <div className="h-52 w-full">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activity} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="prGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.08} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#71717a' }}
                  tickLine={false}
                  axisLine={{ stroke: 'currentColor', opacity: 0.1 }}
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
                        <div className="rounded-xl border border-zinc-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0e111a]/95 p-3 shadow-xl text-xs backdrop-blur-xl ring-1 ring-black/5 min-w-[160px]">
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-white/[0.08] pb-1.5 mb-2">
                            {label}
                          </div>
                          <div className="space-y-1 text-[11px]">
                            <div className="flex items-center justify-between text-indigo-500">
                              <span>Commits:</span>
                              <strong className="font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">
                                {data.commits}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between text-emerald-500">
                              <span>Pull Requests:</span>
                              <strong className="font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">
                                {data.pullRequests}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between text-amber-500">
                              <span>Issues:</span>
                              <strong className="font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">
                                {data.issues}
                              </strong>
                            </div>
                            <div className="border-t border-zinc-100 dark:border-white/[0.08] pt-1.5 flex items-center justify-between text-zinc-900 dark:text-white font-semibold">
                              <span>Total:</span>
                              <strong className="font-mono text-indigo-500 tabular-nums">
                                {data.total}
                              </strong>
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
              <div className="w-full h-28 rounded-xl bg-zinc-100 dark:bg-white/[0.03] animate-pulse" />
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-center gap-5 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-xs" />
            <span>Commits</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
            <span>Pull Requests</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-xs" />
            <span>Issues</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
