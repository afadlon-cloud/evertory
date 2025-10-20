const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createDemoUser() {
  try {
    console.log('Creating demo user...');
    
    // Check if demo user already exists
    let demoUser = await prisma.user.findUnique({
      where: { email: 'demo@evertory.com' }
    });

    if (!demoUser) {
      // Create demo user
      demoUser = await prisma.user.create({
        data: {
          email: 'demo@evertory.com',
          name: 'The Johnson Family',
          password: 'demo123', // This will be hashed by NextAuth
          domain: 'johnson-family',
          tier: 'premium',
          photoCount: 0,
          photoLimit: 5000,
        }
      });
      console.log('Demo user created:', demoUser.id);
    } else {
      console.log('Demo user already exists:', demoUser.id);
      
      // Delete existing stories and media for fresh demo
      await prisma.mediaReference.deleteMany({
        where: { media: { userId: demoUser.id } }
      });
      await prisma.media.deleteMany({
        where: { userId: demoUser.id }
      });
      await prisma.chapter.deleteMany({
        where: { story: { userId: demoUser.id } }
      });
      await prisma.story.deleteMany({
        where: { userId: demoUser.id }
      });
      console.log('Cleared existing demo data');
    }

    // Create sample stories
    const stories = [
      {
        title: 'Our Wedding Day',
        subtitle: 'The most magical day of our lives',
        description: 'From the first look to the last dance, every moment was perfect.',
        template: 'timeline',
        isPublic: true,
        slug: 'our-wedding-day',
        domain: 'johnson-family',
        coverPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop'
      },
      {
        title: 'Baby Emma\'s First Year',
        subtitle: 'Watching our little miracle grow',
        description: 'Every milestone, every smile, every precious moment captured.',
        template: 'gallery',
        isPublic: true,
        slug: 'baby-emma-first-year',
        domain: 'johnson-family',
        coverPhoto: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&h=600&fit=crop'
      },
      {
        title: 'Family Vacation 2024',
        subtitle: 'Our amazing trip to the mountains',
        description: 'Hiking, camping, and making memories that will last forever.',
        template: 'blog',
        isPublic: true,
        slug: 'family-vacation-2024',
        domain: 'johnson-family',
        coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      },
      {
        title: 'Holiday Traditions',
        subtitle: 'Celebrating the season together',
        description: 'From decorating the tree to opening presents, our favorite time of year.',
        template: 'timeline',
        isPublic: true,
        slug: 'holiday-traditions',
        domain: 'johnson-family',
        coverPhoto: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=600&fit=crop'
      },
      {
        title: 'Family Reunion 2024',
        subtitle: 'Three generations together',
        description: 'Grandparents, parents, and kids all under one roof for a weekend of fun.',
        template: 'gallery',
        isPublic: true,
        slug: 'family-reunion-2024',
        domain: 'johnson-family',
        coverPhoto: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop'
      },
      {
        title: 'Emma\'s Birthday Party',
        subtitle: 'Turning 2 in style',
        description: 'Balloons, cake, and lots of love for our little princess.',
        template: 'blog',
        isPublic: true,
        slug: 'emma-birthday-party',
        domain: 'johnson-family',
        coverPhoto: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=600&fit=crop'
      }
    ];

    console.log('Creating stories...');
    for (const storyData of stories) {
      const story = await prisma.story.create({
        data: {
          ...storyData,
          userId: demoUser.id,
        }
      });

      console.log(`Created story: ${story.title}`);

      // Add chapters for timeline and blog stories
      if (story.template === 'timeline' || story.template === 'blog') {
        const chapters = [
          {
            title: 'Getting Ready',
            content: 'The morning preparations were filled with excitement and anticipation.',
            date: new Date('2024-06-15'),
            order: 1
          },
          {
            title: 'The Ceremony',
            content: 'Walking down the aisle was the most emotional moment of our lives.',
            date: new Date('2024-06-15'),
            order: 2
          },
          {
            title: 'The Reception',
            content: 'Dancing, laughing, and celebrating with all our loved ones.',
            date: new Date('2024-06-15'),
            order: 3
          }
        ];

        for (const chapterData of chapters) {
          await prisma.chapter.create({
            data: {
              ...chapterData,
              storyId: story.id,
            }
          });
        }
      }

      // Add sample media for all stories
      const sampleImages = [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop'
      ];

      for (let i = 0; i < 3; i++) {
        const media = await prisma.media.create({
          data: {
            type: 'image',
            url: sampleImages[i],
            thumbnailUrl: sampleImages[i],
            title: `${story.title} - Photo ${i + 1}`,
            description: `A beautiful moment from ${story.title}`,
            userId: demoUser.id,
          }
        });

        // Create media reference for the story
        await prisma.mediaReference.create({
          data: {
            mediaId: media.id,
            storyId: story.id,
          }
        });

        // If it's a timeline/blog story, also add to first chapter
        if (story.template === 'timeline' || story.template === 'blog') {
          const firstChapter = await prisma.chapter.findFirst({
            where: { storyId: story.id },
            orderBy: { order: 'asc' }
          });

          if (firstChapter) {
            await prisma.mediaReference.create({
              data: {
                mediaId: media.id,
                chapterId: firstChapter.id,
              }
            });
          }
        }
      }
    }

    // Update photo count
    const totalMedia = await prisma.media.count({
      where: { userId: demoUser.id }
    });

    await prisma.user.update({
      where: { id: demoUser.id },
      data: { photoCount: totalMedia }
    });

    console.log(`Demo user created successfully!`);
    console.log(`Email: demo@evertory.com`);
    console.log(`Password: demo123`);
    console.log(`Domain: johnson-family.evertory.com`);
    console.log(`Stories created: ${stories.length}`);
    console.log(`Total photos: ${totalMedia}`);

  } catch (error) {
    console.error('Error creating demo user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUser();
