/**
 * Extract Cloudinary public_id from a Cloudinary URL
 * @param url - Cloudinary URL (e.g., https://res.cloudinary.com/cloud/image/upload/v123/folder/image.jpg)
 * @returns public_id or null if extraction fails
 */
export function extractCloudinaryPublicId(url: string): string | null {
  try {
    // URL format: https://res.cloudinary.com/[cloud]/image/upload/v[version]/[public_id].[format]
    // or: https://res.cloudinary.com/[cloud]/image/upload/[public_id].[format]
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1 || uploadIndex + 1 >= urlParts.length) {
      return null;
    }

    // Get everything after 'upload/'
    const afterUpload = urlParts.slice(uploadIndex + 1);
    
    // Skip version if present (starts with 'v' followed by numbers)
    const startIndex = afterUpload[0]?.match(/^v\d+$/) ? 1 : 0;
    
    if (startIndex >= afterUpload.length) {
      return null;
    }

    // Join the remaining parts and remove file extension
    const publicIdWithFormat = afterUpload.slice(startIndex).join('/');
    const publicId = publicIdWithFormat.replace(/\.[^/.]+$/, '');
    
    return publicId || null;
  } catch (error) {
    console.warn('Failed to extract Cloudinary public_id from URL:', url, error);
    return null;
  }
}

/**
 * Check if a URL is a Cloudinary URL
 * @param url - URL to check
 * @returns true if it's a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com');
}
