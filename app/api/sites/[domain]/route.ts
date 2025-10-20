import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string } }
) {
  try {
    const domain = params.domain;
    const { searchParams } = new URL(request.url);
    const storySlug = searchParams.get('story');

    // Handle different domain formats
    let searchDomain = domain;
    
    // If it's just a slug, add the domain suffix
    if (!domain.includes('.')) {
      searchDomain = `${domain}.evertory.com`;
    }
    
    console.log('Searching for domain:', searchDomain);

    // Build-safe database access
    try {
      // If a specific story is requested
      if (storySlug) {
        const story = await prisma.story.findFirst({
          where: {
            slug: storySlug,
            user: {
              domain: searchDomain
            } as any,
            isPublic: true,
          },
          include: {
            chapters: {
              include: {
                mediaReferences: {
                  include: {
                    media: true,
                  },
                  orderBy: { order: 'asc' },
                },
              } as any,
              orderBy: { order: 'asc' },
            },
            mediaReferences: {
              include: {
                media: true,
              },
              orderBy: { order: 'asc' },
            } as any,
            settings: true,
            user: {
              select: {
                name: true,
                domain: true,
              } as any,
            },
          } as any,
        });

        if (!story) {
          return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        }

        // Remove user info from response for privacy
        const { user, ...storyData } = story as any;

        return NextResponse.json({
          ...storyData,
          authorName: (user as any).name,
          userDomain: (user as any).domain,
        });
      } else {
        // Return all public stories for this user domain
        const user = await prisma.user.findUnique({
          where: { domain: searchDomain } as any,
          include: {
            stories: {
              where: { isPublic: true },
              include: {
                _count: {
                  select: {
                    chapters: true,
                    mediaReferences: true,
                  } as any,
                },
              },
              orderBy: { updatedAt: 'desc' },
            },
          },
        });

        if (!user) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
          user: {
            name: (user as any).name,
            domain: (user as any).domain,
          },
          stories: (user as any).stories,
        });
      }
    } catch (dbError) {
      // If database is not available (during build), return not found
      console.log('Database not available during build');
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching public content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}