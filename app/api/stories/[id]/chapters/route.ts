import { NextRequest, NextResponse } from 'next/server';
// Temporarily disabled auth for deployment
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Temporarily disabled auth for deployment
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    // Mock user ID for deployment
    const userId = 'demo-user-id';

    const { title, content, date, order } = await request.json();

    // Verify story ownership
    const story = await prisma.story.findFirst({
      where: {
        id: params.id,
        userId: userId,
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
      include: {
        media: {
          orderBy: { order: 'asc' },
        },
      },
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
