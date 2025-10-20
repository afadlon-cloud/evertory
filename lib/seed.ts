import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 12);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@evertory.com' },
    update: {},
    create: {
      email: 'demo@evertory.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  console.log('✅ Created demo user');

  // Create demo story
  const demoStory = await prisma.story.create({
    data: {
      title: 'Our Family Journey',
      subtitle: 'A story of love, growth, and precious memories',
      description: 'Welcome to our family\'s digital memory book. Here you\'ll find the moments that matter most to us, from everyday adventures to milestone celebrations.',
      slug: 'our-family-journey',
      domain: 'our-family-journey.evertory.com',
      template: 'timeline',
      isPublic: true,
      userId: demoUser.id,
    },
  });

  console.log('✅ Created demo story');

  // Create demo chapters
  const chapters = [
    {
      title: 'The Beginning',
      content: '<h2>Where It All Started</h2><p>Every great story has a beginning, and ours started with a chance meeting at a local coffee shop. What began as a simple conversation over lattes would eventually become the foundation of our beautiful family.</p><p>Looking back, it\'s amazing how one small moment can change everything. We never imagined that sharing a table on a busy Saturday morning would lead to a lifetime of shared memories.</p>',
      date: new Date('2018-03-15'),
      order: 0,
    },
    {
      title: 'Our Wedding Day',
      content: '<h2>The Best Day of Our Lives</h2><p>Surrounded by family and friends, we promised to love and support each other through all of life\'s adventures. The day was perfect - from the morning preparations to the last dance under the stars.</p><p>Every detail was carefully planned, but what we remember most are the unexpected moments: the flower girl who forgot her petals, the best man\'s hilarious speech, and the way the sunset painted the sky just as we said our vows.</p>',
      date: new Date('2019-09-21'),
      order: 1,
    },
    {
      title: 'Welcome Home, Emma',
      content: '<h2>Our Little Miracle</h2><p>After months of anticipation, Emma Grace finally arrived on a snowy December morning. At 7 pounds, 3 ounces, she was perfect in every way. Her tiny fingers, button nose, and peaceful sleeping face melted our hearts instantly.</p><p>The first few weeks were a whirlwind of diaper changes, feeding schedules, and very little sleep. But every coo, every smile, and every milestone made it all worthwhile. We were officially a family of three.</p>',
      date: new Date('2020-12-08'),
      order: 2,
    },
    {
      title: 'First Steps & Big Dreams',
      content: '<h2>Watching Her Grow</h2><p>Emma took her first steps on a sunny Tuesday afternoon in our living room. One moment she was crawling toward her favorite toy, and the next, she was standing up and taking those wobbly first steps toward her dad.</p><p>We cheered, we cried, and we immediately called the grandparents. It was one of those moments you dream about as new parents - a milestone that marks the beginning of so many adventures to come.</p>',
      date: new Date('2021-08-15'),
      order: 3,
    },
  ];

  for (const chapterData of chapters) {
    await prisma.chapter.create({
      data: {
        ...chapterData,
        storyId: demoStory.id,
      },
    });
  }

  console.log('✅ Created demo chapters');

  // Create demo media
  const mediaItems = [
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop',
      title: 'Family Portrait',
      description: 'Our first professional family photo',
      order: 0,
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
      title: 'Wedding Day',
      description: 'Walking down the aisle',
      order: 1,
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&h=600&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=300&fit=crop',
      title: 'Baby Emma',
      description: 'First moments with our little one',
      order: 2,
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=600&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop',
      title: 'First Steps',
      description: 'Emma taking her first independent steps',
      order: 3,
    },
  ];

  for (const mediaData of mediaItems) {
    await prisma.media.create({
      data: {
        ...mediaData,
        userId: demoUser.id,
      },
    });
  }

  console.log('✅ Created demo media');

  // Create story settings
  await prisma.storySettings.create({
    data: {
      storyId: demoStory.id,
      primaryColor: '#df8548',
      fontFamily: 'serif',
      enableComments: true,
      enableDownload: true,
    },
  });

  console.log('✅ Created story settings');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
