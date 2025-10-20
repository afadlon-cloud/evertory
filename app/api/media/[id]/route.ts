import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { extractCloudinaryPublicId, isCloudinaryUrl } from '@/lib/cloudinary-utils';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the media belongs to the user
    const media = await prisma.media.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Check if any other media records use the same URL before deletion
    const otherMediaWithSameUrl = await prisma.media.findFirst({
      where: {
        url: media.url,
        id: { not: params.id }, // Exclude the current one
      },
    });

    // Extract public_id from Cloudinary URL for deletion
    let cloudinaryPublicId = null;
    let shouldDeleteFromCloudinary = !otherMediaWithSameUrl && isCloudinaryUrl(media.url);

    if (shouldDeleteFromCloudinary) {
      cloudinaryPublicId = extractCloudinaryPublicId(media.url);
    }

    // Delete from database
    await prisma.media.delete({
      where: {
        id: params.id,
      },
    });

    // Update user's photo count
    const remainingPhotoCount = await prisma.media.count({
      where: { userId: session.user.id }
    });
    
    await prisma.user.update({
      where: { id: session.user.id },
      data: { photoCount: remainingPhotoCount }
    });

    // Delete from Cloudinary if safe to do so
    if (shouldDeleteFromCloudinary && cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(cloudinaryPublicId);
        console.log('✅ Deleted from Cloudinary:', cloudinaryPublicId);
      } catch (cloudinaryError) {
        console.warn('⚠️ Failed to delete from Cloudinary:', cloudinaryError);
        // Don't fail the whole operation if Cloudinary deletion fails
      }
    } else if (!shouldDeleteFromCloudinary) {
      console.log('ℹ️ Skipped Cloudinary deletion - image still used by other media records');
    }

    return NextResponse.json({ 
      success: true,
      message: shouldDeleteFromCloudinary 
        ? 'Media deleted successfully from database and Cloudinary'
        : 'Media deleted successfully from database'
    });

  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
