import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { randomUUID } from 'crypto';

// Helper function to detect language from file extension
function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const langMap: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'py': 'python',
    'java': 'java',
    'go': 'go',
    'rs': 'rust',
    'cpp': 'cpp',
    'c': 'c',
    'cs': 'csharp',
    'php': 'php',
    'rb': 'ruby',
    'swift': 'swift',
    'kt': 'kotlin',
    'scala': 'scala',
    'sh': 'shell',
    'bash': 'shell',
    'json': 'json',
    'yaml': 'yaml',
    'yml': 'yaml',
    'xml': 'xml',
    'md': 'markdown',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sql': 'sql'
  };
  return langMap[ext] || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repoId } = body;

    if (!repoId) {
      return NextResponse.json({ error: 'Repository ID required' }, { status: 400 });
    }

    // Fetch repo from database
    const repo = await db.externalRepo.findUnique({
      where: { id: repoId }
    });

    if (!repo) {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
    }

    const ghToken = process.env.GITHUB_TOKEN;
    if (!ghToken) {
      return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
    }

    // Fetch repository tree from GitHub
    const treeResponse = await fetch(
      `https://api.github.com/repos/${repo.repoOwner}/${repo.repoName}/git/trees/${repo.branch}?recursive=1`,
      {
        headers: {
          'Authorization': `token ${ghToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Self-Evolving-AI'
        }
      }
    );

    if (!treeResponse.ok) {
      const errorText = await treeResponse.text();
      console.error('GitHub tree fetch error:', errorText);
      return NextResponse.json(
        { error: `Failed to fetch repository tree: ${treeResponse.statusText}` },
        { status: treeResponse.status }
      );
    }

    const treeData = await treeResponse.json();
    const files = treeData.tree.filter((f: any) =>
      f.type === 'blob' &&
      f.path.match(/\.(ts|tsx|js|jsx|py|java|go|rs|cpp|c|cs|php|rb|swift|kt|scala|sh|bash|json|yaml|yml|xml|md|html|css|scss|sql)$/) &&
      f.size < 100000 // Limit to 100KB files
    );

    console.log(`Found ${files.length} files in ${repo.repoOwner}/${repo.repoName}`);

    let syncedCount = 0;
    let failedCount = 0;

    // Process files (limit to prevent rate limiting)
    const maxFiles = 50;
    for (let i = 0; i < Math.min(files.length, maxFiles); i++) {
      const file = files[i];

      try {
        // Fetch file content
        const contentResponse = await fetch(
          `https://api.github.com/repos/${repo.repoOwner}/${repo.repoName}/contents/${file.path}?ref=${repo.branch}`,
          {
            headers: {
              'Authorization': `token ${ghToken}`,
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'Self-Evolving-AI'
            }
          }
        );

        if (!contentResponse.ok) {
          console.warn(`Failed to fetch ${file.path}`);
          failedCount++;
          continue;
        }

        const contentData = await contentResponse.json();
        const content = Buffer.from(contentData.content, 'base64').toString('utf-8');

        // Check if already exists
        const existing = await db.knowledgeBase.findFirst({
          where: {
            repoOwner: repo.repoOwner,
            repoName: repo.repoName,
            filePath: file.path
          }
        });

        if (existing) {
          // Update existing
          await db.knowledgeBase.update({
            where: { id: existing.id },
            data: { content }
          });
        } else {
          // Create new
          await db.knowledgeBase.create({
            data: {
              id: randomUUID(),
              fileName: file.path.split('/').pop() || file.path,
              filePath: file.path,
              content,
              source: 'repository',
              fileType: file.path.split('.').pop() || 'unknown',
              repoOwner: repo.repoOwner,
              repoName: repo.repoName,
              language: detectLanguage(file.path),
              tags: `repository,${detectLanguage(file.path)},${repo.repoOwner}`
            }
          });
        }

        syncedCount++;

        // Rate limiting: sleep 100ms between requests
        if (i < Math.min(files.length, maxFiles) - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`Error processing ${file.path}:`, error);
        failedCount++;
      }
    }

    // Update repo metadata
    await db.externalRepo.update({
      where: { id: repoId },
      data: {
        lastSync: new Date(),
        filesCount: syncedCount
      }
    });

    return NextResponse.json({
      success: true,
      syncedCount,
      failedCount,
      totalFiles: files.length
    });
  } catch (error) {
    console.error('Sync repo error:', error);
    return NextResponse.json({ error: 'Failed to sync repository' }, { status: 500 });
  }
}
