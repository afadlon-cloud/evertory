import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string } }
) {
  try {
    const domain = params.domain;

    // Handle different domain formats
    let searchDomain = domain;
    
    // If it's just a slug, add the domain suffix
    if (!domain.includes('.')) {
      searchDomain = `${domain}.evertory.com`;
    }

    // Build-safe database access
    let story;
    try {
      story = await prisma.story.findFirst({
        where: {
          domain: searchDomain,
          isPublic: true,
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
          user: {
            select: {
              name: true,
            },
          },
        },
      });
    } catch (dbError) {
      // If database is not available (during build), return not found
      console.log('Database not available during build');
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // Remove user info from response for privacy
    const { user, ...storyData } = story;

    return NextResponse.json({
      ...storyData,
      authorName: user.name,
    });
  } catch (error) {
    console.error('Error fetching public story:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
