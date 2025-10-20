'use client';

import { motion } from 'framer-motion';

interface Media {
  id: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
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
  mediaReferences: MediaReference[];
}

interface Story {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  chapters: Chapter[];
  mediaReferences: MediaReference[];
  settings?: {
    fontFamily?: string;
    primaryColor?: string;
  };
  authorName: string;
}

interface BlogTemplateProps {
  story: Story;
}

export function BlogTemplate({ story }: BlogTemplateProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-12">
        {/* Story Description */}
        {story.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none text-neutral-700 leading-relaxed"
          >
            <p className="text-xl text-neutral-600 leading-relaxed">
              {story.description}
            </p>
          </motion.div>
        )}

        {/* Chapters as Blog Posts */}
        {story.chapters.map((chapter, index) => (
          <motion.article
            key={chapter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden"
          >
            {/* Chapter Header */}
            <div className="p-8 pb-6">
              <h2 className={`text-3xl font-bold text-neutral-800 mb-4 ${
                story.settings?.fontFamily === 'serif' ? 'font-serif' : ''
              }`}>
                {chapter.title}
              </h2>
              
              {chapter.date && (
                <p className="text-sm text-neutral-500 mb-6">
                  {new Date(chapter.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>

            {/* Chapter Media */}
            {chapter.mediaReferences.length > 0 && (
              <div className="px-8 pb-6">
                {chapter.mediaReferences.length === 1 ? (
                  <img
                    src={chapter.mediaReferences[0].media.url}
                    alt={chapter.mediaReferences[0].media.title || chapter.title}
                    className="w-full h-96 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {chapter.mediaReferences.slice(0, 4).map((ref) => (
                      <img
                        key={ref.id}
                        src={ref.media.thumbnailUrl || ref.media.url}
                        alt={ref.media.title || ''}
                        className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Chapter Content */}
            {chapter.content && (
              <div className="px-8 pb-8">
                <div 
                  className="prose prose-lg max-w-none text-neutral-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: chapter.content }}
                />
              </div>
            )}
          </motion.article>
        ))}


        {/* End Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: (story.chapters.length + 1) * 0.1 }}
          className="text-center py-12"
        >
          <p className="text-neutral-500 italic text-lg">
            Thank you for reading our story. ❤️
          </p>
        </motion.div>
      </div>
    </div>
  );
}
