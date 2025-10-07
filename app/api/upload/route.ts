import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Mock upload - In production, you'd integrate with Cloudinary, AWS S3, etc.
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const storyId = formData.get('storyId') as string;
    const chapterId = formData.get('chapterId') as string | null;

    if (!file || !storyId) {
      return NextResponse.json({ error: 'Missing file or storyId' }, { status: 400 });
    }

    // Verify story ownership
    const story = await prisma.story.findFirst({
      where: {
        id: storyId,
        userId: session.user.id,
      },
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // In a real implementation, you would:
    // 1. Upload file to cloud storage (Cloudinary, S3, etc.)
    // 2. Generate thumbnails for images
    // 3. Process videos for web optimization
    // 4. Store the URLs in the database

    // For now, we'll create a mock URL
    const fileType = file.type.startsWith('image/') ? 'image' : 'video';
    const mockUrl = `https://images.unsplash.com/photo-${Date.now()}?w=800&h=600&fit=crop`;
    const mockThumbnailUrl = `https://images.unsplash.com/photo-${Date.now()}?w=400&h=300&fit=crop`;

    // Get the next order number
    const lastMedia = await prisma.media.findFirst({
      where: chapterId ? { chapterId } : { storyId },
      orderBy: { order: 'desc' },
    });

    const media = await prisma.media.create({
      data: {
        type: fileType,
        url: mockUrl,
        thumbnailUrl: fileType === 'image' ? mockThumbnailUrl : undefined,
        title: file.name,
        order: (lastMedia?.order ?? -1) + 1,
        storyId: chapterId ? null : storyId,
        chapterId: chapterId || null,
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
