import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, language, source, limit = 5 } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Build where clause
    let where: any = {};

    if (language && language !== 'all') {
      where.language = language;
    }

    if (source && source !== 'all') {
      where.source = source;
    }

    // Get all matching documents
    const documents = await db.knowledgeBase.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100 // Get more, then filter by relevance
    });

    // Simple keyword matching for relevance
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(/\s+/).filter((k: string) => k.length > 2);

    const scoredDocs = documents.map(doc => {
      const contentLower = doc.content.toLowerCase();
      const fileNameLower = doc.fileName.toLowerCase();
      let score = 0;

      // Score based on keyword matches in content
      keywords.forEach((keyword: string) => {
        if (contentLower.includes(keyword)) {
          score += 1;
        }
        // Bonus for matches in filename
        if (fileNameLower.includes(keyword)) {
          score += 0.5;
        }
        // Bonus for multiple occurrences
        const count = (contentLower.match(new RegExp(keyword, 'g')) || []).length;
        score += Math.min(count * 0.1, 2);
      });

      // Bonus for recent documents
      const daysSinceCreation = (Date.now() - doc.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      score += Math.max(0, 1 - daysSinceCreation / 365);

      return { ...doc, score };
    })
    .filter(doc => doc.score > 0) // Only include documents with matches
    .sort((a, b) => b.score - a.score) // Sort by relevance
    .slice(0, limit); // Take top N

    // Format context for AI
    const context = scoredDocs.map(doc => {
      let sourceInfo = '';
      if (doc.source === 'repository') {
        sourceInfo = ` [from ${doc.repoOwner}/${doc.repoName}]`;
      } else if (doc.source === 'upload') {
        sourceInfo = ` [uploaded document: ${doc.fileName}]`;
      }

      // Truncate very long content
      let content = doc.content;
      const maxLength = 10000; // 10K chars max per document
      if (content.length > maxLength) {
        content = content.substring(0, maxLength) + '\n...[content truncated]';
      }

      return `
### ${doc.fileName}${sourceInfo}
\`\`\`${doc.language || 'text'}
${content}
\`\`\`
      `.trim();
    }).join('\n\n');

    return NextResponse.json({
      documents: scoredDocs,
      context,
      count: scoredDocs.length
    });
  } catch (error) {
    console.error('Knowledge search error:', error);
    return NextResponse.json({ error: 'Failed to search knowledge base' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stats = searchParams.get('stats') === 'true';

    if (stats) {
      // Return statistics
      const [totalDocs, uploadedDocs, repoDocs, externalDocs] = await Promise.all([
        db.knowledgeBase.count(),
        db.knowledgeBase.count({ where: { source: 'upload' } }),
        db.knowledgeBase.count({ where: { source: 'repository' } }),
        db.knowledgeBase.count({ where: { source: 'external' } })
      ]);

      const languageStats = await db.knowledgeBase.groupBy({
        by: ['language'],
        _count: true,
        orderBy: { _count: { language: 'desc' } }
      });

      const repoStats = await db.knowledgeBase.groupBy({
        by: ['repoName'],
        where: { source: 'repository' },
        _count: true,
        orderBy: { _count: { repoName: 'desc' } }
      });

      return NextResponse.json({
        total: totalDocs,
        bySource: {
          uploaded: uploadedDocs,
          repository: repoDocs,
          external: externalDocs
        },
        byLanguage: languageStats,
        byRepo: repoStats
      });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Knowledge stats error:', error);
    return NextResponse.json({ error: 'Failed to get knowledge base statistics' }, { status: 500 });
  }
}
