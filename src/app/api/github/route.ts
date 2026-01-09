import { NextRequest, NextResponse } from 'next/server';

const GITHUB_API_BASE = 'https://api.github.com';
const DEFAULT_HEADERS = {
  'Accept': 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
  'User-Agent': 'Evolving-Machine-Next.js'
};

async function handleGitHubRequest(request: NextRequest, path: string, method: string, payload?: any) {
  const ghToken = process.env.GITHUB_TOKEN;
  if (!ghToken) {
    throw new Error('GitHub token not configured');
  }

  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    method,
    headers: {
      ...DEFAULT_HEADERS,
      'Authorization': `token ${ghToken}`
    },
    body: payload ? JSON.stringify(payload) : undefined
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || 'GitHub API error');
  }

  return data;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const method = searchParams.get('method') || 'GET';

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const data = await handleGitHubRequest(request, path, method);
    return NextResponse.json(data);
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, method = 'GET', payload } = body;

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const data = await handleGitHubRequest(request, path, method, payload);
    return NextResponse.json(data);
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}