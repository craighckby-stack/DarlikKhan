import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const repos = await db.externalRepo.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ repos });
  } catch (error) {
    console.error('Repos list error:', error);
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repoOwner, repoName, branch = 'main' } = body;

    if (!repoOwner || !repoName) {
      return NextResponse.json({ error: 'repoOwner and repoName are required' }, { status: 400 });
    }

    // Check if already exists
    const existing = await db.externalRepo.findFirst({
      where: { repoOwner, repoName }
    });

    if (existing) {
      return NextResponse.json({ error: 'Repository already exists' }, { status: 400 });
    }

    const repo = await db.externalRepo.create({
      data: {
        id: randomUUID(),
        repoOwner,
        repoName,
        branch,
        isActive: true,
        filesCount: 0
      }
    });

    return NextResponse.json({ success: true, repo });
  } catch (error) {
    console.error('Add repo error:', error);
    return NextResponse.json({ error: 'Failed to add repository' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Repository ID required' }, { status: 400 });
    }

    await db.externalRepo.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete repo error:', error);
    return NextResponse.json({ error: 'Failed to delete repository' }, { status: 500 });
  }
}
