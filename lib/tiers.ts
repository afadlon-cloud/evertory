export interface TierInfo {
  name: string;
  price: number;
  photoLimit: number;
  features: string[];
  color: string;
  popular?: boolean;
}

export const TIERS: Record<string, TierInfo> = {
  free: {
    name: 'Free',
    price: 0,
    photoLimit: 20,
    features: [
      'Up to 20 photos',
      'Timeline template only',
      'Basic customization',
      'Public website'
    ],
    color: 'gray'
  },
  basic: {
    name: 'Basic',
    price: 5,
    photoLimit: 500,
    features: [
      'Up to 500 photos',
      'All templates (Timeline, Blog, Gallery)',
      'Cover photo selection'
    ],
    color: 'blue'
  },
  pro: {
    name: 'Pro',
    price: 10,
    photoLimit: 1500,
    features: [
      'Up to 1,500 photos',
      'All templates (Timeline, Blog, Gallery)',
      'Cover photo selection'
    ],
    color: 'purple',
    popular: true
  },
  premium: {
    name: 'Premium',
    price: 20,
    photoLimit: 5000,
    features: [
      'Up to 5,000 photos',
      'All templates (Timeline, Blog, Gallery)',
      'Cover photo selection'
    ],
    color: 'gold'
  }
};

export function getTierInfo(tier: string): TierInfo {
  return TIERS[tier] || TIERS.free;
}

export function canUploadPhoto(userTier: string, currentPhotoCount: number): boolean {
  const tierInfo = getTierInfo(userTier);
  return currentPhotoCount < tierInfo.photoLimit;
}

export function getRemainingPhotos(userTier: string, currentPhotoCount: number): number {
  const tierInfo = getTierInfo(userTier);
  return Math.max(0, tierInfo.photoLimit - currentPhotoCount);
}

export function getPhotoUsagePercentage(userTier: string, currentPhotoCount: number): number {
  const tierInfo = getTierInfo(userTier);
  return Math.min(100, (currentPhotoCount / tierInfo.photoLimit) * 100);
}

export function shouldShowUpgradePrompt(userTier: string, currentPhotoCount: number): boolean {
  const tierInfo = getTierInfo(userTier);
  const usagePercentage = getPhotoUsagePercentage(userTier, currentPhotoCount);
  
  // Show upgrade prompt when user reaches 80% of their limit
  return usagePercentage >= 80;
}

export function getNextTier(currentTier: string): TierInfo | null {
  const tierOrder = ['free', 'basic', 'pro', 'premium'];
  const currentIndex = tierOrder.indexOf(currentTier);
  
  if (currentIndex === -1 || currentIndex === tierOrder.length - 1) {
    return null; // Already at highest tier
  }
  
  return getTierInfo(tierOrder[currentIndex + 1]);
}

export function canUseTemplate(tier: string, template: string): boolean {
  // Free users can only use timeline template
  if (tier === 'free') {
    return template === 'timeline';
  }
  // All paid tiers can use all templates
  return ['timeline', 'blog', 'gallery'].includes(template);
}

export function canUseCoverPhoto(tier: string): boolean {
  // Only free users are restricted from cover photo feature
  return tier !== 'free';
}
