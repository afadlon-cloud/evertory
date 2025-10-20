const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createBetterDemo() {
  try {
    console.log('Creating better demo with relevant photos...');
    
    // Clear existing demo data
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@evertory.com' }
    });

    if (demoUser) {
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

    // Create better stories with more relevant content
    const stories = [
      {
        title: 'Our Wedding Day',
        subtitle: 'The most magical day of our lives',
        description: 'From the first look to the last dance, every moment was perfect.',
        template: 'timeline',
        isPublic: true,
        slug: 'our-wedding-day',
        domain: 'johnson-family.evertory.com',
        coverPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&q=80',
        chapters: [
          {
            title: 'Getting Ready',
            content: 'The morning preparations were filled with excitement and anticipation. Sarah spent the morning with her bridesmaids, while Mike got ready with his groomsmen.',
            date: new Date('2024-06-15T08:00:00'),
            order: 1
          },
          {
            title: 'The Ceremony',
            content: 'Walking down the aisle was the most emotional moment of our lives. The ceremony was held in a beautiful garden with 150 of our closest friends and family.',
            date: new Date('2024-06-15T14:00:00'),
            order: 2
          },
          {
            title: 'The Reception',
            content: 'Dancing, laughing, and celebrating with all our loved ones. The reception lasted until midnight with amazing food, drinks, and music.',
            date: new Date('2024-06-15T18:00:00'),
            order: 3
          }
        ],
        photos: [
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop&q=80',
          'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop&q=80',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop&q=80'
        ]
      },
      {
        title: 'Baby Emma\'s First Year',
        subtitle: 'Watching our little miracle grow',
        description: 'Every milestone, every smile, every precious moment captured.',
        template: 'gallery',
        isPublic: true,
        slug: 'baby-emma-first-year',
        domain: 'johnson-family.evertory.com',
        coverPhoto: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&h=600&fit=crop&q=80',
        photos: [
          'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=300&fit=crop&q=80',
          'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop&q=80',
          'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop&q=80'
        ]
      },
      {
        title: 'Family Vacation 2024',
        subtitle: 'Our amazing trip to the mountains',
        description: 'Hiking, camping, and making memories that will last forever.',
        template: 'blog',
        isPublic: true,
        slug: 'family-vacation-2024',
        domain: 'johnson-family.evertory.com',
        coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
        chapters: [
          {
            title: 'Day 1: Arrival',
            content: 'We arrived at the mountain cabin and immediately fell in love with the view. The kids were so excited to explore the area.',
            date: new Date('2024-08-15'),
            order: 1
          },
          {
            title: 'Day 2: Hiking Adventure',
            content: 'Our first big hike was challenging but rewarding. Emma did great in her carrier and we saw some amazing wildlife.',
            date: new Date('2024-08-16'),
            order: 2
          },
          {
            title: 'Day 3: Lake Day',
            content: 'We spent the day at the crystal clear mountain lake. Perfect weather for swimming and relaxing.',
            date: new Date('2024-08-17'),
            order: 3
          }
        ],
        photos: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&q=80'
        ]
      },
      {
        title: 'Holiday Traditions',
        subtitle: 'Celebrating the season together',
        description: 'From decorating the tree to opening presents, our favorite time of year.',
        template: 'timeline',
        isPublic: true,
        slug: 'holiday-traditions',
        domain: 'johnson-family.evertory.com',
        coverPhoto: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=600&fit=crop&q=80',
        chapters: [
          {
            title: 'Tree Decorating',
            content: 'Every year we decorate the tree together as a family. Emma loves putting the ornaments on the lower branches.',
            date: new Date('2024-12-01'),
            order: 1
          },
          {
            title: 'Cookie Baking',
            content: 'We spend a whole day baking cookies for friends and neighbors. It\'s become one of our favorite traditions.',
            date: new Date('2024-12-15'),
            order: 2
          },
          {
            title: 'Christmas Morning',
            content: 'The magic of Christmas morning never gets old. Watching Emma\'s face light up when she sees the presents.',
            date: new Date('2024-12-25'),
            order: 3
          }
        ],
        photos: [
          'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=300&fit=crop&q=80',
          'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=300&fit=crop&q=80',
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&q=80'
        ]
      },
      {
        title: 'Family Reunion 2024',
        subtitle: 'Three generations together',
        description: 'Grandparents, parents, and kids all under one roof for a weekend of fun.',
        template: 'gallery',
        isPublic: true,
        slug: 'family-reunion-2024',
        domain: 'johnson-family.evertory.com',
        coverPhoto: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop&q=80',
        photos: [
          'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop&q=80',
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=300&fit=crop&q=80',
          'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=400&h=300&fit=crop&q=80'
        ]
      },
      {
        title: 'Emma\'s Birthday Party',
        subtitle: 'Turning 2 in style',
        description: 'Balloons, cake, and lots of love for our little princess.',
        template: 'blog',
        isPublic: true,
        slug: 'emma-birthday-party',
        domain: 'johnson-family.evertory.com',
        coverPhoto: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=600&fit=crop&q=80',
        chapters: [
          {
            title: 'Party Setup',
            content: 'We decorated the house with balloons and streamers. Emma was so excited to see all the decorations.',
            date: new Date('2024-09-15T10:00:00'),
            order: 1
          },
          {
            title: 'Cake Time',
            content: 'The highlight of the party was definitely the cake. Emma\'s face when we sang happy birthday was priceless.',
            date: new Date('2024-09-15T14:00:00'),
            order: 2
          },
          {
            title: 'Gift Opening',
            content: 'Emma loved opening all her presents. She got so many toys and books from family and friends.',
            date: new Date('2024-09-15T15:00:00'),
            order: 3
          }
        ],
        photos: [
          'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop&q=80',
          'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop&q=80',
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&q=80'
        ]
      }
    ];

    console.log('Creating stories with better content...');
    for (const storyData of stories) {
      const { chapters, photos, ...storyInfo } = storyData;
      
      const story = await prisma.story.create({
        data: {
          ...storyInfo,
          userId: demoUser.id,
        }
      });

      console.log(`Created story: ${story.title}`);

      // Add chapters for timeline and blog stories
      if (chapters) {
        for (const chapterData of chapters) {
          await prisma.chapter.create({
            data: {
              ...chapterData,
              storyId: story.id,
            }
          });
        }
      }

      // Add relevant photos
      for (let i = 0; i < photos.length; i++) {
        const media = await prisma.media.create({
          data: {
            type: 'image',
            url: photos[i],
            thumbnailUrl: photos[i],
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
        if (chapters && chapters.length > 0) {
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

    console.log(`Better demo created successfully!`);
    console.log(`Stories created: ${stories.length}`);
    console.log(`Total photos: ${totalMedia}`);

  } catch (error) {
    console.error('Error creating better demo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createBetterDemo();
