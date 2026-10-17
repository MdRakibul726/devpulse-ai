import { NextRequest, NextResponse } from 'next/server';
import { UsernameSchema } from '@/lib/schemas';
import { fetchGitHubDashboardData, getDemoProfile } from '@/lib/github';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('refresh') === 'true';
    const isDemoRequested = searchParams.get('demo') === 'true';

    // Quick demo mode shortcut
    if (isDemoRequested) {
      const demoData = getDemoProfile(username || 'shadcn');
      if (demoData) {
        return NextResponse.json(demoData, {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        });
      }
    }

    // Validate username format with Zod
    const validation = UsernameSchema.safeParse(username);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error.errors[0]?.message || 'Invalid GitHub username',
        },
        { status: 400 }
      );
    }

    const result = await fetchGitHubDashboardData(validation.data, forceRefresh);

    if (result.error) {
      return NextResponse.json(
        {
          error: result.error,
          rateLimit: result.rateLimit,
        },
        { status: result.status || 500 }
      );
    }

    return NextResponse.json(result.data, {
      headers: {
        'Cache-Control': forceRefresh
          ? 'no-store, no-cache, must-revalidate, max-age=0'
          : 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Unhandled API error in /api/github/[username]:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
