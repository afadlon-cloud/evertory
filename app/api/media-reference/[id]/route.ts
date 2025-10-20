import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the media reference and verify it belongs to the user's story
    const mediaReference = await prisma.mediaReference.findFirst({
      where: {
        id: params.id,
      },
      include: {
        media: true,
        story: true,
      },
    });

    if (!mediaReference) {
      return NextResponse.json({ error: 'Media reference not found' }, { status: 404 });
    }

    // Verify the story belongs to the user
    if (!mediaReference.story || mediaReference.story.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the media reference (this doesn't delete the actual media)
    await prisma.mediaReference.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Media removed from chapter successfully'
    });

  } catch (error) {
    console.error('Error deleting media reference:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
