import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mediaIds, storyId, chapterId } = await request.json();

    if (!mediaIds || !Array.isArray(mediaIds) || mediaIds.length === 0) {
      return NextResponse.json({ error: 'Media IDs are required' }, { status: 400 });
    }

    if (!storyId) {
      return NextResponse.json({ error: 'Story ID is required' }, { status: 400 });
    }

    // Verify story belongs to user
    const story = await prisma.story.findFirst({
      where: {
        id: storyId,
        userId: session.user.id,
      },
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // Verify all media belongs to user
    const mediaItems = await prisma.media.findMany({
      where: {
        id: { in: mediaIds },
        userId: session.user.id,
      },
    });

    if (mediaItems.length !== mediaIds.length) {
      return NextResponse.json({ error: 'Some media items not found' }, { status: 404 });
    }

    // Create media references instead of duplicating media
    // This allows the same photo to exist in multiple places without duplication
    const newReferences = [];
    
    for (const media of mediaItems) {
      // Check if reference already exists
      const existingReference = await prisma.mediaReference.findFirst({
        where: {
          mediaId: media.id,
          storyId: storyId,
          chapterId: chapterId || null,
        },
      });

      if (!existingReference) {
        const reference = await prisma.mediaReference.create({
          data: {
            mediaId: media.id,
            storyId: storyId,
            chapterId: chapterId || null,
            order: 0, // Will be updated by the frontend if needed
          },
          include: {
            media: true,
          },
        });
        newReferences.push(reference);
      }
    }

    return NextResponse.json({ 
      success: true,
      message: `${newReferences.length} media item(s) linked to ${chapterId ? 'chapter' : 'story'}`,
      newReferences: newReferences
    });

  } catch (error) {
    console.error('Error linking media:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
