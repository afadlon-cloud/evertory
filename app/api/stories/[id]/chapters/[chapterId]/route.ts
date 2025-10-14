import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; chapterId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    const chapter = await prisma.chapter.findFirst({
      where: {
        id: params.chapterId,
        storyId: params.id,
      },
      include: {
        media: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; chapterId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

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

    // Convert date if provided and not empty
    if (data.date && data.date.trim() !== '') {
      data.date = new Date(data.date);
    } else if (data.date === '') {
      // Remove empty date field
      delete data.date;
    }

    const chapter = await prisma.chapter.update({
      where: { id: params.chapterId },
      data,
      include: {
        media: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('Error updating chapter:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
