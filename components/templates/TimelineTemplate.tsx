'use client';

import { motion } from 'framer-motion';
import { CalendarIcon, PhotoIcon } from '@heroicons/react/24/outline';

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

interface TimelineTemplateProps {
  story: Story;
}

export function TimelineTemplate({ story }: TimelineTemplateProps) {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        {story.chapters.map((chapter, index) => (
          <motion.div
            key={chapter.id}
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-neutral-200">
              {index === story.chapters.length - 1 && (
                <div className="absolute bottom-0 w-3 h-3 bg-primary-500 rounded-full -left-1.25"></div>
              )}
            </div>

            {/* Timeline Node */}
            <div className="absolute left-6 top-8 w-4 h-4 bg-primary-500 rounded-full border-4 border-white shadow-sm"></div>

            {/* Content */}
            <div className="ml-20 pb-16">
              {/* Date */}
              {chapter.date && (
                <div className="flex items-center space-x-2 text-sm text-neutral-500 mb-4">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{new Date(chapter.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              )}

              {/* Chapter Title */}
              <h2 className={`text-3xl font-bold text-neutral-800 mb-6 ${
                story.settings.fontFamily === 'serif' ? 'font-serif' : ''
              }`}>
                {chapter.title}
              </h2>

              {/* Chapter Media */}
              {chapter.media.length > 0 && (
                <div className="mb-8">
                  {chapter.media.length === 1 ? (
                    <img
                      src={chapter.media[0].url}
                      alt={chapter.media[0].title || chapter.title}
                      className="w-full h-96 object-cover rounded-xl shadow-lg"
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {chapter.media.slice(0, 4).map((media) => (
                        <img
                          key={media.id}
                          src={media.thumbnailUrl || media.url}
                          alt={media.title || ''}
                          className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                        />
                      ))}
                      {chapter.media.length > 4 && (
                        <div className="relative">
                          <img
                            src={chapter.media[4].thumbnailUrl || chapter.media[4].url}
                            alt=""
                            className="w-full h-48 object-cover rounded-lg shadow-md"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center">
                            <div className="text-white text-center">
                              <PhotoIcon className="h-8 w-8 mx-auto mb-2" />
                              <span className="text-lg font-semibold">
                                +{chapter.media.length - 4} more
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Chapter Content */}
              {chapter.content && (
                <div 
                  className="prose prose-lg max-w-none text-neutral-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: chapter.content }}
                />
              )}
            </div>
          </motion.div>
        ))}

        {/* End of Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 w-4 h-4 bg-neutral-300 rounded-full border-4 border-white"></div>
          <div className="ml-20">
            <p className="text-neutral-500 italic">
              Thank you for reading our story. ❤️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
