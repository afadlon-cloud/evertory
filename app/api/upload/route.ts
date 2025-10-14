import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

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
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: `evertory/${session.user.id}/${storyId}`,
          public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const result = uploadResult as any;

    // Get the next order number
    const lastMedia = await prisma.media.findFirst({
      where: {
        storyId,
        chapterId: chapterId || null,
      },
      orderBy: { order: 'desc' },
    });

    const nextOrder = (lastMedia?.order || 0) + 1;

    // Save to database
    const media = await prisma.media.create({
      data: {
        type: result.resource_type === 'video' ? 'VIDEO' : 'IMAGE',
        url: result.secure_url,
        filename: file.name,
        size: file.size,
        order: nextOrder,
        storyId,
        chapterId: chapterId || null,
      },
    });

    return NextResponse.json({
      success: true,
      media: {
        id: media.id,
        type: media.type,
        url: media.url,
        filename: media.filename,
        size: media.size,
        order: media.order,
      },
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}