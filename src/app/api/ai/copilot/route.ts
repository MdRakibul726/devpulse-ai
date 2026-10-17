import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  generateRepoSummary,
  generateCVBulletPoints,
  generateReadmeRecommendations,
  generateWeeklyReport,
} from '@/lib/ai';
import { GitHubRepoSchema, GitHubEventSchema } from '@/lib/schemas';

const CopilotRequestSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('summary'),
    repo: GitHubRepoSchema,
  }),
  z.object({
    type: z.literal('cv'),
    repo: GitHubRepoSchema,
    role: z.string().optional(),
  }),
  z.object({
    type: z.literal('readme'),
    repo: GitHubRepoSchema,
  }),
  z.object({
    type: z.literal('weekly'),
    username: z.string(),
    events: z.array(GitHubEventSchema),
    repos: z.array(GitHubRepoSchema),
  }),
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = CopilotRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request payload for AI Copilot',
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const payload = validation.data;

    switch (payload.type) {
      case 'summary': {
        const summary = await generateRepoSummary(payload.repo);
        return NextResponse.json({ success: true, data: summary });
      }
      case 'cv': {
        const cv = await generateCVBulletPoints(payload.repo, payload.role);
        return NextResponse.json({ success: true, data: cv });
      }
      case 'readme': {
        const readme = await generateReadmeRecommendations(payload.repo);
        return NextResponse.json({ success: true, data: readme });
      }
      case 'weekly': {
        const weekly = await generateWeeklyReport(
          payload.username,
          payload.events,
          payload.repos
        );
        return NextResponse.json({ success: true, data: weekly });
      }
    }
  } catch (error) {
    console.error('AI Copilot route error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal Copilot Error',
      },
      { status: 500 }
    );
  }
}
