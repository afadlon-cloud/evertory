'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  PhotoIcon,
  PlusIcon,
  FolderIcon,
  CalendarIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { GalleryImageUpload } from '@/components/upload/GalleryImageUpload';

interface Media {
  id: string;
  type: string;
  url: string;
  title?: string;
  description?: string;
  createdAt: string;
  story?: {
    title: string;
    id: string;
  };
}

export default function GalleryPage() {
  const { data: session } = useSession();
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await fetch('/api/media');
      if (response.ok) {
        const data = await response.json();
        setMedia(data);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = (newMedia: any[]) => {
    setMedia(prev => [...newMedia, ...prev]);
    setShowUpload(false);
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this photo? This will permanently remove it from:\n• Your gallery\n• All stories and chapters\n• Cloudinary storage\n\nThis action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/media/${mediaId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMedia(prev => prev.filter(item => item.id !== mediaId));
      } else {
        alert('Failed to delete photo. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Failed to delete photo. Please try again.');
    }
  };

  // Group media by date
  const groupedMedia = media.reduce((groups: { [key: string]: Media[] }, item) => {
    const date = new Date(item.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square bg-neutral-200 rounded-lg"></div>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-neutral-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-neutral-800 font-serif">
                Media Gallery
              </h1>
              <p className="text-neutral-600 mt-1">
                All your photos and videos in one place
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowUpload(!showUpload)}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Upload Media</span>
          </button>
        </div>

        {/* Upload Section */}
        {showUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-6 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-300"
          >
            <GalleryImageUpload onUploadSuccess={handleUploadSuccess} />
          </motion.div>
        )}
      </div>

      {/* Media Grid */}
      {Object.keys(groupedMedia).length === 0 ? (
        <div className="text-center py-16">
          <PhotoIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-600 mb-2">
            No media yet
          </h3>
          <p className="text-neutral-500 mb-6">
            Start building your gallery by uploading your first photo or video
          </p>
          <button
            onClick={() => setShowUpload(true)}
            className="btn-primary"
          >
            Upload Your First Photo
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMedia)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, items]) => (
              <div key={date}>
                <div className="flex items-center space-x-2 mb-4">
                  <CalendarIcon className="h-5 w-5 text-neutral-500" />
                  <h2 className="text-lg font-semibold text-neutral-700">{date}</h2>
                  <span className="text-sm text-neutral-500">({items.length} items)</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group relative aspect-square bg-neutral-100 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
                    >
                      <img
                        src={item.url}
                        alt={item.title || 'Media'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-end">
                        <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-1">
                          <p className="text-xs font-medium truncate">
                            {item.title}
                          </p>
                          {item.story && (
                            <p className="text-xs text-neutral-300 truncate">
                              in "{item.story.title}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMedia(item.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                        title="Delete photo"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
