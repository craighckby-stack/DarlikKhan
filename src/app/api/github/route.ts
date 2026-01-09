import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const method = searchParams.get('method') || 'GET';

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const ghToken = process.env.GITHUB_TOKEN;
    if (!ghToken) {
      return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
    }

    const response = await fetch(`https://api.github.com${path}`, {
      method,
      headers: {
        'Authorization': `token ${ghToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Evolving-Machine-Next.js'
      }
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      return NextResponse.json({ error: data?.message || 'GitHub API error', status: response.status }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, method = 'GET', payload } = body;

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const ghToken = process.env.GITHUB_TOKEN;
    if (!ghToken) {
      return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
    }

    const response = await fetch(`https://api.github.com${path}`, {
      method,
      headers: {
        'Authorization': `token ${ghToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Evolving-Machine-Next.js'
      },
      body: payload ? JSON.stringify(payload) : undefined
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      return NextResponse.json({ error: data?.message || 'GitHub API error', status: response.status }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
