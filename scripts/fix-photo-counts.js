const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixPhotoCounts() {
  try {
    console.log('🔍 Starting photo count fix...');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, email: true, photoCount: true }
    });
    
    console.log(`📊 Found ${users.length} users to process`);
    
    for (const user of users) {
      // Count actual media for this user
      const actualPhotoCount = await prisma.media.count({
        where: { userId: user.id }
      });
      
      // Update the user's photo count
      await prisma.user.update({
        where: { id: user.id },
        data: { photoCount: actualPhotoCount }
      });
      
      console.log(`✅ Updated ${user.email}: ${user.photoCount} → ${actualPhotoCount} photos`);
    }
    
    console.log('🎉 Photo count fix completed!');
  } catch (error) {
    console.error('❌ Error fixing photo counts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPhotoCounts();
