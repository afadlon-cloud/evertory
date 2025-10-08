import { NextRequest, NextResponse } from 'next/server';
// Temporarily disabled auth for deployment
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

export async function GET(request: NextRequest) {
  try {
    // Temporarily disabled auth for deployment
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    // Mock user ID for deployment
    const userId = 'demo-user-id';

    const stories = await prisma.story.findMany({
      where: {
        userId: userId,
      },
      include: {
        _count: {
          select: {
            chapters: true,
            media: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Temporarily disabled auth for deployment
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    // Mock user ID for deployment
    const userId = 'demo-user-id';

    const { title, subtitle, description, template = 'timeline' } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Generate slug and domain
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await prisma.story.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Generate domain
    const domain = `${slug}.evertory.com`;

    const story = await prisma.story.create({
      data: {
        title,
        subtitle,
        description,
        slug,
        domain,
        template,
        userId: userId,
      },
      include: {
        _count: {
          select: {
            chapters: true,
            media: true,
          },
        },
      },
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
