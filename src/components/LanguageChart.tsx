'use client';

import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { LanguageDistributionItem } from '@/lib/schemas';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Code2 } from 'lucide-react';

interface LanguageChartProps {
  languages: LanguageDistributionItem[];
}

export function LanguageChart({ languages }: LanguageChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!languages || languages.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-500" />
            Language Distribution
          </CardTitle>
          <CardDescription>Primary languages across public repositories</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-xs text-zinc-400">
          No language data available for this profile
        </CardContent>
      </Card>
    );
  }

  // Top 5 languages + "Other" bucket if > 5
  const topLanguages = languages.slice(0, 5);
  const remaining = languages.slice(5);
  const chartData = [...topLanguages];

  if (remaining.length > 0) {
    const otherCount = remaining.reduce((sum, item) => sum + item.count, 0);
    const otherPercentage = remaining.reduce((sum, item) => sum + item.percentage, 0);
    chartData.push({
      name: 'Other',
      count: otherCount,
      percentage: otherPercentage,
      color: '#64748b',
    });
  }

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-500" />
            Language Distribution
          </CardTitle>
          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200/60 dark:border-white/[0.06]">
            {languages.length} {languages.length === 1 ? 'stack' : 'stacks'}
          </span>
        </div>
        <CardDescription>Breakdown based on primary repository codebase</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-0">
        {/* Recharts Donut */}
        <div className="h-52 w-full relative flex items-center justify-center">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={2}
                  dataKey="count"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="transition-opacity hover:opacity-85"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as LanguageDistributionItem;
                      return (
                        <div className="rounded-xl border border-zinc-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0e111a]/95 p-3 shadow-xl text-xs backdrop-blur-xl ring-1 ring-black/5 min-w-[150px]">
                          <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                              style={{ backgroundColor: data.color }}
                            />
                            <span>{data.name}</span>
                          </div>
                          <div className="space-y-1 text-zinc-500 dark:text-zinc-400 text-[11px]">
                            <div className="flex items-center justify-between">
                              <span>Share:</span>
                              <strong className="font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">
                                {data.percentage}%
                              </strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Repositories:</span>
                              <strong className="font-mono text-indigo-500 tabular-nums">
                                {data.count}
                              </strong>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            </div>
          )}
        </div>

        {/* Language Breakdown with Progress Bars */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-white/[0.06] space-y-2">
          {chartData.map((item) => (
            <div key={item.name} className="group text-xs">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium truncate">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-[11px] font-mono">
                    {item.count} {item.count === 1 ? 'repo' : 'repos'}
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-100 font-mono text-[11px] font-semibold tabular-nums min-w-[32px] text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>
              {/* Progress bar track */}
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
