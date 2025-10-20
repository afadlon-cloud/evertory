const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log('🧹 Resetting database...');

  try {
    // Delete all data in the correct order (respecting foreign key constraints)
    console.log('Deleting Media...');
    await prisma.media.deleteMany();

    console.log('Deleting Comments...');
    await prisma.comment.deleteMany();

    console.log('Deleting Chapters...');
    await prisma.chapter.deleteMany();

    console.log('Deleting Story Settings...');
    await prisma.storySettings.deleteMany();

    console.log('Deleting Stories...');
    await prisma.story.deleteMany();

    console.log('Deleting Sessions...');
    await prisma.session.deleteMany();

    console.log('Deleting Accounts...');
    await prisma.account.deleteMany();

    console.log('Deleting Users...');
    await prisma.user.deleteMany();

    console.log('✅ Database reset complete!');
    console.log('📊 All tables are now empty and ready for fresh testing.');

  } catch (error) {
    console.error('❌ Error resetting database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
