'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  DocumentTextIcon, 
  EyeIcon,
  ShareIcon,
  CalendarIcon,
  PhotoIcon,
  TrashIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { getPublicSiteUrl, getDisplayUrl } from '@/lib/url-utils';
import { buttonStyles, cardStyles, textStyles, iconStyles } from '@/lib/styles';
import { getTierInfo, getPhotoUsagePercentage, shouldShowUpgradePrompt, getNextTier } from '@/lib/tiers';

interface Story {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  domain: string;
  template: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    chapters: number;
    mediaReferences: number;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  domain?: string;
  tier: string;
  photoCount: number;
  photoLimit: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stories, setStories] = useState<Story[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteStory = async (storyId: string, storyTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${storyTitle}"? This action cannot be undone and will remove all chapters and media associated with this story.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setStories(prev => prev.filter(story => story.id !== storyId));
      } else {
        alert('Failed to delete story. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Failed to delete story. Please try again.');
    }
  };

  const fetchData = async () => {
    try {
      // First, update the photo count
      await fetch('/api/user/photo-count');
      
      const [storiesResponse, userResponse] = await Promise.all([
        fetch('/api/stories'),
        fetch('/api/user')
      ]);
      
      if (storiesResponse.ok) {
        const storiesData = await storiesResponse.json();
        setStories(storiesData.stories || []);
      }
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card h-48 bg-neutral-100"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
          Welcome back, {session?.user?.name?.split(' ')[0]}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
          Continue building your beautiful stories or start a new one.
        </p>
        
        {/* Quick Tier Status */}
        {user && (
          <div className="mt-6 flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200">
              <div className={`w-2 h-2 rounded-full ${
                getTierInfo(user.tier).color === 'gray' ? 'bg-gray-500' :
                getTierInfo(user.tier).color === 'blue' ? 'bg-blue-500' :
                getTierInfo(user.tier).color === 'purple' ? 'bg-purple-500' :
                'bg-yellow-500'
              }`}></div>
              <span className="text-sm font-medium text-gray-700">
                {getTierInfo(user.tier).name} Plan
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {user.photoCount} of {user.photoLimit} photos
            </div>
            {shouldShowUpgradePrompt(user.tier, user.photoCount) && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-yellow-600 font-medium">
                  {Math.round(getPhotoUsagePercentage(user.tier, user.photoCount))}% used
                </span>
                <Link 
                  href="/dashboard/settings"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Upgrade →
                </Link>
              </div>
            )}
          </div>
        )}
        
      </div>


      {/* Public Website Section */}
      {user?.domain && (
        <div className="mb-16">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-light mb-2">Your Public Website</h2>
                <p className="text-gray-300 mb-4">Share your stories with the world</p>
                <div className="flex items-center space-x-4">
                  <div className="bg-white/10 rounded-xl px-4 py-2">
                    <span className="text-sm font-medium">{getDisplayUrl(user.domain)}</span>
                  </div>
                  <Link 
                    href={getPublicSiteUrl(user.domain)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-gray-900 px-6 py-3 rounded-full font-medium text-sm uppercase tracking-wide hover:bg-gray-100 transition-all duration-200 flex items-center space-x-2"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span>View Live</span>
                  </Link>
                  <a
                    href={`https://wa.me/?text=Check out my personal website: ${getPublicSiteUrl(user.domain)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium text-sm uppercase tracking-wide transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    <span>Share on WhatsApp</span>
                  </a>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center">
                  <GlobeAltIcon className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className={cardStyles.base}>
          <div className="flex items-center">
            <div className={iconStyles.small}>
              <DocumentTextIcon className={iconStyles.iconSmall} />
            </div>
            <div className="ml-6">
              <p className="text-4xl font-light text-gray-900">{stories.length}</p>
              <p className={textStyles.body.small}>Total Stories</p>
            </div>
          </div>
        </div>
        <div className={cardStyles.base}>
          <div className="flex items-center">
            <div className={iconStyles.small}>
              <PhotoIcon className={iconStyles.iconSmall} />
            </div>
            <div className="ml-6">
              <p className="text-4xl font-light text-gray-900">
                {stories.reduce((total, story) => total + story._count.mediaReferences, 0)}
              </p>
              <p className={textStyles.body.small}>Photos & Videos</p>
            </div>
          </div>
        </div>
        <div className={cardStyles.base}>
          <div className="flex items-center">
            <div className={iconStyles.small}>
              <EyeIcon className={iconStyles.iconSmall} />
            </div>
            <div className="ml-6">
              <p className="text-4xl font-light text-gray-900">
                {stories.filter(story => story.isPublic).length}
              </p>
              <p className={textStyles.body.small}>Published Stories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stories Section */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-light text-gray-900">Your Stories</h2>
            <p className="text-gray-600 mt-2">Manage and organize your life stories</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/stories" className="text-gray-600 hover:text-gray-900 font-medium flex items-center space-x-2">
              <span>View All</span>
              <EyeIcon className="h-4 w-4" />
            </Link>
            <Link href="/dashboard/stories/new" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium text-sm uppercase tracking-wide shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-3">
              <PlusIcon className="h-4 w-4" />
              <span>New Story</span>
            </Link>
          </div>
        </div>

        {stories.length === 0 ? (
          <motion.div
            className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-6 bg-gray-100 rounded-2xl w-24 h-24 mx-auto mb-8 flex items-center justify-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-600" />
            </div>
            <h3 className="text-3xl font-light text-gray-900 mb-4">No stories yet</h3>
            <p className="text-gray-600 mb-12 max-w-md mx-auto text-lg leading-relaxed">
              Start your first story to begin documenting your beautiful memories and sharing your journey.
            </p>
            <Link href="/dashboard/stories/new" className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-4 rounded-full font-medium text-sm uppercase tracking-wide shadow-sm hover:shadow-md transition-all duration-200">
              Create Your First Story
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-light text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                      {story.title}
                    </h3>
                    {story.subtitle && (
                      <p className="text-gray-600 text-sm mb-4 font-medium">{story.subtitle}</p>
                    )}
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      {story.template !== 'gallery' && (
                        <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                          <DocumentTextIcon className="h-3 w-3" />
                          <span className="font-medium uppercase tracking-wide">{story._count.chapters} chapters</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                        <PhotoIcon className="h-3 w-3" />
                        <span className="font-medium uppercase tracking-wide">{story._count.mediaReferences} media</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${
                    story.isPublic 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {story.isPublic ? 'Published' : 'Draft'}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500 font-medium uppercase tracking-wide">
                    <CalendarIcon className="h-3 w-3 mr-2" />
                    Updated {new Date(story.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    {story.isPublic && user?.domain && (
                      <a
                        href={getPublicSiteUrl(user.domain, story.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all duration-200"
                        title="View live story"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all duration-200"
                      title="Share story"
                    >
                      <ShareIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStory(story.id, story.title)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200"
                      title="Delete story"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/dashboard/stories/${story.id}`}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full font-medium text-xs uppercase tracking-wide transition-all duration-200"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Getting Started */}
      {stories.length > 0 && stories.length < 3 && (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                <DocumentTextIcon className="h-8 w-8 text-gray-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-light text-gray-900 mb-4">
                Keep Building Your Story Collection
              </h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                You're off to a great start! Consider creating stories for different aspects of your life - 
                family history, special events, or milestone moments.
              </p>
              <Link href="/dashboard/stories/new" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium text-sm uppercase tracking-wide shadow-sm hover:shadow-md transition-all duration-200">
                Create Another Story
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
