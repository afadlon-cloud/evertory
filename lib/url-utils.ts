/**
 * Utility functions for handling URLs in development vs production
 */

export function getPublicSiteUrl(userDomain: string, storySlug?: string): string {
  const isDevelopment = typeof window !== 'undefined' 
    ? window.location.hostname === 'localhost'
    : process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    const domainSlug = userDomain.replace('.evertory.com', '');
    // Use current port if available, fallback to 3000
    const port = typeof window !== 'undefined' ? window.location.port || '3000' : '3000';
    const baseUrl = `http://localhost:${port}/site/${domainSlug}`;
    return storySlug ? `${baseUrl}/${storySlug}` : baseUrl;
  } else {
    const baseUrl = `https://${userDomain}`;
    return storySlug ? `${baseUrl}/${storySlug}` : baseUrl;
  }
}

export function getDisplayUrl(userDomain: string, storySlug?: string): string {
  const isDevelopment = typeof window !== 'undefined' 
    ? window.location.hostname === 'localhost'
    : process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    const domainSlug = userDomain.replace('.evertory.com', '');
    // Use current port if available, fallback to 3000
    const port = typeof window !== 'undefined' ? window.location.port || '3000' : '3000';
    const baseUrl = `localhost:${port}/site/${domainSlug}`;
    return storySlug ? `${baseUrl}/${storySlug}` : baseUrl;
  } else {
    return storySlug ? `${userDomain}/${storySlug}` : userDomain;
  }
}
