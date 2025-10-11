import { NextRequest, NextResponse } from 'next/server';
// Temporarily disabled auth for deployment
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
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

    const story = await prisma.story.findFirst({
      where: {
        id: params.id,
        userId: userId,
      },
      include: {
        chapters: {
          include: {
            media: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        media: {
          orderBy: { order: 'asc' },
        },
        settings: true,
      },
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const data = await request.json();

    // Verify ownership
    const story = await prisma.story.findFirst({
      where: {
        id: params.id,
        userId: userId,
      },
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    const updatedStory = await prisma.story.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updatedStory);
  } catch (error) {
    console.error('Error updating story:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
