import slugify from 'slugify';
import { prisma } from '@/lib/prisma';

/**
 * Generate a unique domain for a user based on their preferred domain name
 */
export async function generateUserDomain(preferredDomain: string): Promise<string> {
  // Clean and validate the preferred domain
  let baseDomain = slugify(preferredDomain, { lower: true, strict: true });
  
  // Ensure it's not too long
  if (baseDomain.length > 30) {
    baseDomain = baseDomain.substring(0, 30);
  }
  
  // Remove trailing hyphens
  baseDomain = baseDomain.replace(/-+$/, '');
  
  // Ensure it's not empty
  if (!baseDomain) {
    baseDomain = 'my-story';
  }
  
  let domain = `${baseDomain}.evertory.com`;
  let counter = 1;
  
  // Ensure unique domain
  while (await prisma.user.findUnique({ where: { domain } })) {
    domain = `${baseDomain}-${counter}.evertory.com`;
    counter++;
  }
  
  return domain;
}

/**
 * Check if a domain name is available
 */
export async function isDomainAvailable(domainName: string): Promise<boolean> {
  const cleanDomain = slugify(domainName, { lower: true, strict: true });
  const fullDomain = `${cleanDomain}.evertory.com`;
  
  const existingUser = await prisma.user.findUnique({
    where: { domain: fullDomain }
  });
  
  return !existingUser;
}

/**
 * Get or create a user domain
 */
export async function ensureUserDomain(userId: string, preferredDomain?: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { domain: true, name: true, email: true }
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // If user already has a domain, return it
  if (user.domain) {
    return user.domain;
  }
  
  // Generate new domain based on preference or fallback to name/email
  let domainToUse = preferredDomain;
  if (!domainToUse) {
    domainToUse = user.name || user.email.split('@')[0];
  }
  
  const domain = await generateUserDomain(domainToUse);
  
  // Update user with new domain
  await prisma.user.update({
    where: { id: userId },
    data: { domain }
  });
  
  return domain;
}
