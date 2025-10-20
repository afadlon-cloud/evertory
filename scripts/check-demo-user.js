const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDemoUser() {
  try {
    console.log('Checking demo user...');
    
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@evertory.com' },
      select: {
        id: true,
        email: true,
        name: true,
        domain: true,
        tier: true,
        stories: {
          select: {
            id: true,
            title: true,
            slug: true,
            template: true,
            isPublic: true
          }
        }
      }
    });
    
    if (demoUser) {
      console.log('Demo user found:');
      console.log('ID:', demoUser.id);
      console.log('Email:', demoUser.email);
      console.log('Name:', demoUser.name);
      console.log('Domain:', demoUser.domain);
      console.log('Tier:', demoUser.tier);
      console.log('Stories:', demoUser.stories.length);
      demoUser.stories.forEach(story => {
        console.log(`- ${story.title} (${story.template}) - Public: ${story.isPublic}`);
      });
    } else {
      console.log('Demo user not found');
    }
    
  } catch (error) {
    console.error('Error checking demo user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDemoUser();
