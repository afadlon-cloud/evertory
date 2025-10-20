'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  TrashIcon,
  DocumentTextIcon,
  PhotoIcon,
  EyeIcon,
  CalendarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { buttonStyles, cardStyles, textStyles, iconStyles } from '@/lib/styles';

interface Story {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  template: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    chapters: number;
    mediaReferences: number;
  };
}

export default function StoriesPage() {
  const { data: session } = useSession();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/stories');
        
        if (response.ok) {
          const data = await response.json();
          setStories(data.stories || []);
        } else {
          const errorData = await response.json();
          setError(`Failed to fetch stories: ${errorData.error || 'Unknown error'}`);
        }
      } catch (err) {
        setError('An error occurred while fetching stories');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchStories();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleDeleteStory = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setStories(stories.filter(story => story.id !== storyId));
      } else {
        alert('Failed to delete story');
      }
    } catch (error) {
      alert('An error occurred while deleting the story');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-light text-gray-900 tracking-tight">
                My Stories
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Create, manage, and share your life stories
              </p>
            </div>
          </div>
        </div>


        {/* Actions */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard/stories/new"
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium text-sm uppercase tracking-wide shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-3"
            >
              <PlusIcon className="h-4 w-4" />
              <span>New Story</span>
            </Link>
          </div>
        </div>

        {/* Stories Grid */}
        {stories.length === 0 ? (
          <div className="py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-2xl mx-auto mb-8 flex items-center justify-center">
                <DocumentTextIcon className="h-12 w-12 text-gray-600" />
              </div>
              <h3 className="text-3xl font-light text-gray-900 mb-4">No stories yet</h3>
              <p className="text-gray-600 mb-12 max-w-md mx-auto text-lg leading-relaxed">
                Create your first story to start documenting your memories and sharing them with loved ones.
              </p>
              <Link
                href="/dashboard/stories/new"
                className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-4 rounded-full font-medium text-sm uppercase tracking-wide shadow-sm hover:shadow-md transition-all duration-200"
              >
                Create Your First Story
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <motion.div
                key={story.id}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Template Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium uppercase tracking-wide">
                    {story.template}
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-light text-gray-900 group-hover:text-gray-700 transition-colors">
                        {story.title}
                      </h3>
                      {story.subtitle && (
                        <p className="text-gray-600 text-sm font-medium">
                          {story.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span className="flex items-center space-x-2">
                      <DocumentTextIcon className="h-4 w-4" />
                      <span>{story._count.chapters} chapters</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <PhotoIcon className="h-4 w-4" />
                      <span>{story._count.mediaReferences} photos</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(story.updatedAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide ${
                    story.isPublic 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {story.isPublic ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Link
                        href={`/dashboard/stories/${story.id}`}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2"
                      >
                        <DocumentTextIcon className="h-4 w-4" />
                        <span>Edit</span>
                      </Link>
                      {story.isPublic && (
                        <Link
                          href={`/site/${story.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2"
                        >
                          <EyeIcon className="h-4 w-4" />
                          <span>View</span>
                        </Link>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteStory(story.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200"
                      title="Delete story"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
