const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking your database...\n');
    
    // Check users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            stories: true
          }
        }
      }
    });
    
    console.log('👥 Users:', users.length);
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user._count.stories} stories`);
    });
    
    // Check stories
    const stories = await prisma.story.findMany({
      select: {
        id: true,
        title: true,
        domain: true,
        isPublic: true,
        user: {
          select: {
            name: true
          }
        }
      }
    });
    
    console.log('\n📚 Stories:', stories.length);
    stories.forEach(story => {
      console.log(`  - "${story.title}" by ${story.user.name} (${story.isPublic ? 'Public' : 'Private'})`);
      console.log(`    ID: ${story.id}`);
      console.log(`    Domain: ${story.domain}`);
    });
    
    console.log('\n✅ Database exploration complete!');
    
    // Check media
    const media = await prisma.media.findMany({
      select: {
        id: true,
        type: true,
        url: true,
        title: true,
        story: {
          select: {
            title: true
          }
        }
      }
    });
    
    console.log('\n📸 Media:', media.length);
    media.forEach(item => {
      console.log(`  - ${item.title} (${item.type}) in "${item.story?.title}"`);
      console.log(`    URL: ${item.url.substring(0, 50)}...`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
