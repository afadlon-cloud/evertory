const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteDemoUser() {
  try {
    console.log('Deleting demo user and all data...');
    
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@evertory.com' }
    });

    if (demoUser) {
      // Delete all related data
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
      
      // Finally delete the user
      await prisma.user.delete({
        where: { id: demoUser.id }
      });
      
      console.log('Demo user and all data deleted successfully!');
    } else {
      console.log('Demo user not found');
    }
    
  } catch (error) {
    console.error('Error deleting demo user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteDemoUser();
