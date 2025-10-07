'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  CalendarIcon, 
  ShareIcon, 
  ArrowDownIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { TimelineTemplate } from '@/components/templates/TimelineTemplate';
import { GalleryTemplate } from '@/components/templates/GalleryTemplate';

interface Story {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  template: string;
  chapters: Chapter[];
  media: Media[];
  settings: StorySettings;
}

interface Chapter {
  id: string;
  title: string;
  content?: string;
  date?: string;
  order: number;
  media: Media[];
}

interface Media {
  id: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  order: number;
}

interface StorySettings {
  primaryColor: string;
  fontFamily: string;
  coverImage?: string;
  logoImage?: string;
  enableComments: boolean;
  enableDownload: boolean;
}

export default function PublicStoryPage() {
  const params = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.domain) {
      fetchStory(params.domain as string);
    }
  }, [params.domain]);

  const fetchStory = async (domain: string) => {
    try {
      const response = await fetch(`/api/sites/${domain}`);
      if (response.ok) {
        const data = await response.json();
        setStory(data);
      } else if (response.status === 404) {
        setError('Story not found');
      } else {
        setError('Failed to load story');
      }
    } catch (error) {
      console.error('Error fetching story:', error);
      setError('Failed to load story');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <HeartIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">
            {error || 'Story not found'}
          </h1>
          <p className="text-neutral-600 mb-6">
            This story may be private or the URL might be incorrect.
          </p>
        </div>
      </div>
    );
  }

  const renderTemplate = () => {
    switch (story.template) {
      case 'gallery':
        return <GalleryTemplate story={story} />;
      case 'timeline':
      default:
        return <TimelineTemplate story={story} />;
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        '--primary-color': story.settings.primaryColor,
        fontFamily: story.settings.fontFamily === 'serif' 
          ? 'Playfair Display, Georgia, serif' 
          : 'Inter, system-ui, sans-serif'
      } as React.CSSProperties}
    >
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50">
        {story.settings.coverImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${story.settings.coverImage})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        )}
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {story.settings.logoImage && (
              <img
                src={story.settings.logoImage}
                alt="Logo"
                className="h-16 mx-auto mb-6"
              />
            )}
            
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${
              story.settings.coverImage ? 'text-white' : 'text-neutral-800'
            } ${story.settings.fontFamily === 'serif' ? 'font-serif' : ''}`}>
              {story.title}
            </h1>
            
            {story.subtitle && (
              <p className={`text-xl md:text-2xl mb-8 ${
                story.settings.coverImage ? 'text-neutral-200' : 'text-neutral-600'
              }`}>
                {story.subtitle}
              </p>
            )}
            
            {story.description && (
              <p className={`text-lg max-w-2xl mx-auto mb-12 leading-relaxed ${
                story.settings.coverImage ? 'text-neutral-300' : 'text-neutral-700'
              }`}>
                {story.description}
              </p>
            )}
            
            <div className="flex items-center justify-center space-x-6">
              <div className={`flex items-center space-x-2 ${
                story.settings.coverImage ? 'text-neutral-300' : 'text-neutral-600'
              }`}>
                <CalendarIcon className="h-5 w-5" />
                <span>{story.chapters.length} chapters</span>
              </div>
              <div className={`flex items-center space-x-2 ${
                story.settings.coverImage ? 'text-neutral-300' : 'text-neutral-600'
              }`}>
                <PhotoIcon className="h-5 w-5" />
                <span>{story.media.length} photos</span>
              </div>
              <button className={`flex items-center space-x-2 hover:opacity-80 transition-opacity ${
                story.settings.coverImage ? 'text-neutral-300' : 'text-neutral-600'
              }`}>
                <ShareIcon className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDownIcon className={`h-6 w-6 ${
            story.settings.coverImage ? 'text-white' : 'text-neutral-400'
          }`} />
        </motion.div>
      </section>

      {/* Story Content */}
      {renderTemplate()}

      {/* Footer */}
      <footer className="bg-neutral-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <HeartIcon className="h-6 w-6 text-primary-400" />
            <span className="text-lg font-semibold">Evertory</span>
          </div>
          <p className="text-neutral-400 mb-4">
            This story was created with Evertory
          </p>
          <a
            href="https://evertory.com"
            className="text-primary-400 hover:text-primary-300 transition-colors"
          >
            Create your own story →
          </a>
        </div>
      </footer>
    </div>
  );
}
