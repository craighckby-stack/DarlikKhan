import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file type
    const fileType = file.type;
    if (
      fileType !== 'application/pdf' &&
      fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return NextResponse.json({ error: 'Only PDF and DOCX files are supported' }, { status: 400 });
    }

    const fileExtension = fileType === 'application/pdf' ? 'pdf' : 'docx';
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // For now, store the file directly as base64
    // In production, you might want to use a proper file storage service
    const fileContent = buffer.toString('base64');

    // Store in database
    const document = await db.knowledgeBase.create({
      data: {
        id: randomUUID(),
        fileName: file.name,
        filePath: `uploads/${randomUUID()}.${fileExtension}`,
        content: fileContent,
        source: 'upload',
        fileType: fileExtension,
        language: 'document',
        tags: 'uploaded,document'
      }
    });

    return NextResponse.json({
      success: true,
      id: document.id,
      fileName: document.fileName,
      fileType: document.fileType
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'all';

    let where = {};
    if (source !== 'all') {
      where = { source };
    }

    const documents = await db.knowledgeBase.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Document list error:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    await db.knowledgeBase.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Document delete error:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
