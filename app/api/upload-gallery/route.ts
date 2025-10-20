import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { canUploadPhoto } from '@/lib/tiers';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check user's tier and photo limits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tier: true, photoCount: true, photoLimit: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!canUploadPhoto(user.tier, user.photoCount)) {
      return NextResponse.json({ 
        error: 'Photo limit reached. Please upgrade your plan to upload more photos.',
        tier: user.tier,
        photoCount: user.photoCount,
        photoLimit: user.photoLimit
      }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary (in user's general gallery folder)
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: `evertory/${session.user.id}/gallery`,
          public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const result = uploadResult as any;

    // Save to database as gallery upload (no story/chapter association)
    const media = await prisma.media.create({
      data: {
        type: result.resource_type === 'video' ? 'video' : 'image',
        url: result.secure_url,
        title: file.name, // Store filename as title
        userId: session.user.id,
        // Gallery uploads are not associated with stories/chapters
      } as any,
    });

    // Update user's photo count by counting all media
    const totalPhotoCount = await prisma.media.count({
      where: { userId: session.user.id }
    });
    
    await prisma.user.update({
      where: { id: session.user.id },
      data: { photoCount: totalPhotoCount }
    });

    return NextResponse.json({
      success: true,
      media: {
        id: media.id,
        type: media.type,
        url: media.url,
        title: media.title,
        createdAt: media.createdAt,
      },
    });

  } catch (error) {
    console.error('Gallery upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
