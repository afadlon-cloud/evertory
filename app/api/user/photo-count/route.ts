import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Count all unique media items associated with this user
    const mediaCount = await prisma.media.count({
      where: {
        userId: session.user.id
      }
    });

    // Update the user's photo count in the database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { photoCount: mediaCount }
    });

    return NextResponse.json({ 
      photoCount: mediaCount,
      success: true 
    });
  } catch (error) {
    console.error('Error counting photos:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
