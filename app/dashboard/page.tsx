'use client';

import { useEffect, useState } from 'react';
// Temporarily disabled for deployment
// import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  DocumentTextIcon, 
  EyeIcon,
  ShareIcon,
  CalendarIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

interface Story {
  id: string;
  title: string;
  subtitle?: string;
  domain: string;
  template: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    chapters: number;
    media: number;
  };
}

export default function DashboardPage() {
  // Temporarily disabled for deployment
  // const { data: session } = useSession();
  const session = { user: { name: 'Demo User', email: 'demo@evertory.com' } };
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories');
      if (response.ok) {
        const data = await response.json();
        setStories(data);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 font-serif mb-2">
          Welcome back, {session?.user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-neutral-600">
          Continue building your stories or start a new one.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-primary-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-neutral-800">{stories.length}</p>
              <p className="text-sm text-neutral-600">Total Stories</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <PhotoIcon className="h-8 w-8 text-primary-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-neutral-800">
                {stories.reduce((total, story) => total + story._count.media, 0)}
              </p>
              <p className="text-sm text-neutral-600">Photos & Videos</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <EyeIcon className="h-8 w-8 text-primary-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-neutral-800">
                {stories.filter(story => story.isPublic).length}
              </p>
              <p className="text-sm text-neutral-600">Published Stories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stories Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-800 font-serif">Your Stories</h2>
          <Link href="/dashboard/stories/new" className="btn-primary flex items-center space-x-2">
            <PlusIcon className="h-4 w-4" />
            <span>New Story</span>
          </Link>
        </div>

        {stories.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <DocumentTextIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-600 mb-2">No stories yet</h3>
            <p className="text-neutral-500 mb-6 max-w-md mx-auto">
              Start your first story to begin documenting your memories and sharing your journey.
            </p>
            <Link href="/dashboard/stories/new" className="btn-primary">
              Create Your First Story
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                className="card hover:shadow-md transition-shadow duration-200 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-1 group-hover:text-primary-600 transition-colors">
                      {story.title}
                    </h3>
                    {story.subtitle && (
                      <p className="text-neutral-600 text-sm mb-2">{story.subtitle}</p>
                    )}
                    <div className="flex items-center text-xs text-neutral-500 space-x-4">
                      <div className="flex items-center space-x-1">
                        <DocumentTextIcon className="h-3 w-3" />
                        <span>{story._count.chapters} chapters</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <PhotoIcon className="h-3 w-3" />
                        <span>{story._count.media} media</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    story.isPublic 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {story.isPublic ? 'Published' : 'Draft'}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <div className="flex items-center text-xs text-neutral-500">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    Updated {new Date(story.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    {story.isPublic && (
                      <a
                        href={`https://${story.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-neutral-400 hover:text-primary-500 transition-colors"
                        title="View live site"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      className="p-1 text-neutral-400 hover:text-primary-500 transition-colors"
                      title="Share story"
                    >
                      <ShareIcon className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/dashboard/stories/${story.id}`}
                      className="text-xs text-primary-600 hover:text-primary-500 font-medium"
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
        <div className="card bg-primary-50 border-primary-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                Keep Building Your Story Collection
              </h3>
              <p className="text-neutral-600 mb-4">
                You're off to a great start! Consider creating stories for different aspects of your life - 
                family history, special events, or milestone moments.
              </p>
              <Link href="/dashboard/stories/new" className="btn-primary">
                Create Another Story
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
