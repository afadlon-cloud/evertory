'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

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

interface GalleryTemplateProps {
  story: Story;
}

export function GalleryTemplate({ story }: GalleryTemplateProps) {
  const [selectedImage, setSelectedImage] = useState<Media | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Collect all media from chapters and story
  const allMedia = [
    ...story.media,
    ...story.chapters.flatMap(chapter => chapter.media)
  ].sort((a, b) => a.order - b.order);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const openLightbox = (media: Media, index: number) => {
    setSelectedImage(media);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (selectedIndex - 1 + allMedia.length) % allMedia.length
      : (selectedIndex + 1) % allMedia.length;
    
    setSelectedIndex(newIndex);
    setSelectedImage(allMedia[newIndex]);
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Introduction */}
        {story.description && (
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xl text-neutral-700 leading-relaxed">
              {story.description}
            </p>
          </div>
        )}

        {/* Masonry Gallery */}
        {allMedia.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
          >
            {allMedia.map((media, index) => (
              <motion.div
                key={media.id}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                onClick={() => openLightbox(media, index)}
              >
                <img
                  src={media.thumbnailUrl || media.url}
                  alt={media.title || ''}
                  className="w-full rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                    {media.title && (
                      <h3 className="font-semibold text-lg mb-1">{media.title}</h3>
                    )}
                    {media.description && (
                      <p className="text-sm">{media.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        ) : (
          <div className="text-center py-16">
            <p className="text-neutral-500 text-lg">No photos to display yet.</p>
          </div>
        )}

        {/* Chapter Sections */}
        {story.chapters.length > 0 && (
          <div className="mt-24 space-y-16">
            <h2 className={`text-3xl font-bold text-center text-neutral-800 ${
              story.settings.fontFamily === 'serif' ? 'font-serif' : ''
            }`}>
              Our Story
            </h2>
            
            {story.chapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold text-neutral-800 mb-4 ${
                    story.settings.fontFamily === 'serif' ? 'font-serif' : ''
                  }`}>
                    {chapter.title}
                  </h3>
                  
                  {chapter.date && (
                    <p className="text-neutral-500 text-sm">
                      {new Date(chapter.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>

                {chapter.content && (
                  <div 
                    className="prose prose-lg max-w-none text-neutral-700 leading-relaxed text-center"
                    dangerouslySetInnerHTML={{ __html: chapter.content }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            {allMedia.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={() => navigateLightbox('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={selectedImage.url}
              alt={selectedImage.title || ''}
              className="max-w-full max-h-full object-contain"
            />

            {/* Caption */}
            {(selectedImage.title || selectedImage.description) && (
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
                {selectedImage.title && (
                  <h3 className="font-semibold text-lg mb-1">{selectedImage.title}</h3>
                )}
                {selectedImage.description && (
                  <p className="text-sm opacity-90">{selectedImage.description}</p>
                )}
              </div>
            )}

            {/* Counter */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} of {allMedia.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
