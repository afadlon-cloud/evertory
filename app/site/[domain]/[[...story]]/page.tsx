'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  CalendarIcon, 
  ShareIcon, 
  ArrowDownIcon,
  PhotoIcon,
  BookOpenIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { TimelineTemplate } from '@/components/templates/TimelineTemplate';
import { GalleryTemplate } from '@/components/templates/GalleryTemplate';
import { BlogTemplate } from '@/components/templates/BlogTemplate';
import Link from 'next/link';

interface Story {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  slug: string;
  template: string;
  coverPhoto?: string;
  chapters: Chapter[];
  mediaReferences?: MediaReference[];
  settings: StorySettings;
  authorName?: string;
  userDomain?: string;
  updatedAt: string;
  _count?: {
    chapters: number;
    mediaReferences: number;
  };
}

interface MediaReference {
  id: string;
  order: number;
  media: Media;
}

interface Chapter {
  id: string;
  title: string;
  content?: string;
  date?: string;
  order: number;
  mediaReferences?: MediaReference[];
}

interface Media {
  id: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
}

interface StorySettings {
  primaryColor: string;
  fontFamily: string;
  coverImage?: string;
  logoImage?: string;
  enableComments: boolean;
  enableDownload: boolean;
}

interface UserSite {
  user: {
    name: string;
    domain: string;
  };
  stories: Story[];
}

export default function PublicSitePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [content, setContent] = useState<Story | UserSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const domain = params.domain as string;
  const storySlug = params.story?.[0]; // Get first segment of story array

  const fetchContent = async (domain: string, storySlug?: string) => {
    try {
      // For local development, convert domain format
      const isDevelopment = window.location.hostname === 'localhost';
      let apiDomain = domain;
      
      // If it's a localhost request and domain doesn't include .evertory.com, add it
      if (isDevelopment && !domain.includes('.evertory.com')) {
        apiDomain = `${domain}.evertory.com`;
      }
      
      let url = `/api/sites/${apiDomain}`;
      if (storySlug) {
        url += `?story=${storySlug}`;
      }
      
      console.log('Fetching from:', url); // Debug log
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Content not found');
      }
      
      const data = await response.json();
      setContent(data);
    } catch (err) {
      console.error('Fetch error:', err); // Debug log
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (domain) {
      fetchContent(domain, storySlug);
    }
  }, [domain, storySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">Content Not Found</h1>
          <p className="text-neutral-600 mb-8">{error}</p>
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Go to Evertory
          </Link>
        </div>
      </div>
    );
  }

  // If it's a specific story, render the story
  if (storySlug && content && 'template' in content) {
    const story = content as Story;
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Story Header */}
        <div className="bg-white border-b border-gray-100 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
                {story.title}
              </h1>
              {story.subtitle && (
                <p className="text-xl text-gray-600 mb-6">
                  {story.subtitle}
                </p>
              )}
              {story.description && (
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {story.description}
                </p>
              )}
              <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500 font-medium uppercase tracking-wide">
                {story.template !== 'gallery' && (
                  <span className="flex items-center">
                    <BookOpenIcon className="h-4 w-4 mr-2" />
                    {story.chapters.length} chapters
                  </span>
                )}
                <span className="flex items-center">
                  <PhotoIcon className="h-4 w-4 mr-2" />
                  {story.template === 'gallery' 
                    ? (story.mediaReferences?.length || 0)
                    : (story.chapters?.reduce((total, chapter) => total + (chapter.mediaReferences?.length || 0), 0) || 0)
                  } photos
                </span>
                {story.authorName && (
                  <span>by {story.authorName}</span>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Story Content */}
        <div className="py-12">
          {story.template === 'timeline' && <TimelineTemplate story={story as any} />}
          {story.template === 'gallery' && <GalleryTemplate story={story as any} />}
          {story.template === 'blog' && <BlogTemplate story={story as any} />}
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-gray-400 font-medium">
              Powered by{' '}
              <a 
                href="https://evertory.com" 
                className="text-white hover:text-gray-300 transition-colors"
              >
                Evertory
              </a>
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // If it's a user landing page, show all their stories
  if (content && 'user' in content) {
    const userSite = content as UserSite;
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* User Header */}
        <div className="bg-white border-b border-gray-100 py-24">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-6 tracking-tight">
                {userSite.user.name || 'Welcome'}
              </h1>
              <p className="text-xl text-gray-600 mb-12">
                Our Story Collection
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 font-medium uppercase tracking-wide">
                <span className="flex items-center">
                  <BookOpenIcon className="h-4 w-4 mr-2" />
                  {userSite.stories.length} stories
                </span>
                <span className="flex items-center">
                  <HeartIcon className="h-4 w-4 mr-1" />
                  Memories preserved
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            {userSite.stories.length === 0 ? (
              <div className="text-center py-16">
                <BookOpenIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-600 mb-2">
                  No stories yet
                </h3>
                <p className="text-neutral-500">
                  Stories will appear here when they're published.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userSite.stories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/site/${domain}/${story.slug}`}>
                      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
                        {/* Story Cover */}
                        <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-100 relative overflow-hidden">
                          {story.coverPhoto ? (
                            <img 
                              src={story.coverPhoto} 
                              alt={story.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : story.template === 'gallery' && story.mediaReferences?.[0]?.media ? (
                            <img 
                              src={story.mediaReferences[0].media.url} 
                              alt={story.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : story.chapters?.[0]?.mediaReferences?.[0]?.media ? (
                            <img 
                              src={story.chapters[0].mediaReferences[0].media.url} 
                              alt={story.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <PhotoIcon className="h-16 w-16 text-orange-300" />
                            </div>
                          )}
                        </div>
                        
                        {/* Story Info */}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-neutral-800 mb-2 group-hover:text-orange-600 transition-colors">
                            {story.title}
                          </h3>
                          {story.subtitle && (
                            <p className="text-neutral-600 mb-4 line-clamp-2">
                              {story.subtitle}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-sm text-neutral-500">
                            <div className="flex items-center space-x-4">
                              {story.template !== 'gallery' && (
                                <span className="flex items-center">
                                  <BookOpenIcon className="h-4 w-4 mr-1" />
                                  {story._count?.chapters || 0}
                                </span>
                              )}
                              <span className="flex items-center">
                                <PhotoIcon className="h-4 w-4 mr-1" />
                                {story._count?.mediaReferences || 0}
                              </span>
                            </div>
                            <span className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {new Date(story.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-neutral-900 text-white py-8">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-neutral-400">
              Powered by{' '}
              <a 
                href="https://evertory.com" 
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                Evertory
              </a>
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return null;
}
