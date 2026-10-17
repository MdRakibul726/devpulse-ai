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
import { Code } from 'lucide-react';

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
            <Code className="w-4 h-4 text-indigo-500" />
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
  let chartData = [...topLanguages];

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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-500" />
            Language Distribution
          </CardTitle>
          <span className="text-[11px] font-medium text-zinc-400">
            {languages.length} {languages.length === 1 ? 'language' : 'languages'} detected
          </span>
        </div>
        <CardDescription>Breakdown based on primary repository language</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="h-56 w-full">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as LanguageDistributionItem;
                      return (
                        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 p-2.5 shadow-md text-xs backdrop-blur-sm">
                          <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: data.color }}
                            />
                            {data.name}
                          </div>
                          <div className="mt-1 text-zinc-500 dark:text-zinc-400">
                            {data.count} repos ({data.percentage}%)
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
              <div className="w-28 h-28 rounded-full border-4 border-indigo-500/20 animate-pulse" />
            </div>
          )}
        </div>

        {/* Legend list */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 grid grid-cols-2 gap-2 text-xs">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-1 rounded-md hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-zinc-700 dark:text-zinc-300 font-medium truncate">
                  {item.name}
                </span>
              </div>
              <span className="text-zinc-400 font-mono text-[11px] shrink-0">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
