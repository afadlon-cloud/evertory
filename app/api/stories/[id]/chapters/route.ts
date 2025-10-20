import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, date, order } = await request.json();

    // Verify story ownership
    const story = await prisma.story.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    const chapter = await prisma.chapter.create({
      data: {
        title,
        content,
        date: date ? new Date(date) : null,
        order: order ?? 0,
        storyId: params.id,
      },
      // Note: mediaReferences will be empty for new chapters
      // They can be added later via the media linking API
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('Error creating chapter:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
