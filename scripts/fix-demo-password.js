const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixDemoPassword() {
  try {
    console.log('Fixing demo user password...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('demo123', 12);
    
    // Update the demo user with hashed password
    const updatedUser = await prisma.user.update({
      where: { email: 'demo@evertory.com' },
      data: { password: hashedPassword }
    });
    
    console.log('Demo user password updated successfully!');
    console.log('Email: demo@evertory.com');
    console.log('Password: demo123');
    console.log('Domain: johnson-family.evertory.com');
    
  } catch (error) {
    console.error('Error fixing demo password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDemoPassword();
