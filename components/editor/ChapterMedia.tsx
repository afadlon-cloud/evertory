'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PhotoModal } from './PhotoModal';

interface MediaReference {
  id: string;
  order: number;
  media: Media;
}

interface Media {
  id: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
}

interface ChapterMediaProps {
  mediaReferences: MediaReference[];
  onRemovePhoto: (mediaRefId: string) => void;
  deletingPhotoId?: string | null;
}

export function ChapterMedia({ mediaReferences, onRemovePhoto, deletingPhotoId }: ChapterMediaProps) {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');

  const handlePhotoClick = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setShowPhotoModal(true);
  };

  const handleClosePhotoModal = () => {
    setShowPhotoModal(false);
    setSelectedPhoto('');
  };

  if (!mediaReferences || mediaReferences.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <PhotoIcon className="h-8 w-8 text-gray-600" />
        </div>
        <h3 className="text-lg font-light text-gray-900 mb-2">No media yet</h3>
        <p className="text-gray-600 text-sm">Add photos and videos to this chapter</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaReferences.map((ref, index) => (
          <motion.div 
            key={ref.id} 
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {deletingPhotoId === ref.id ? (
              <div className="w-full h-32 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-900 mx-auto mb-2"></div>
                  <p className="text-xs font-medium text-gray-600">Removing...</p>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl shadow-sm group-hover:shadow-md transition-all duration-200 border border-gray-100">
                <img
                  src={ref.media.thumbnailUrl || ref.media.url}
                  alt={ref.media.title || ''}
                  className="w-full h-32 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-200"
                  onClick={() => handlePhotoClick(ref.media.url)}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePhotoClick(ref.media.url)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-gray-900 hover:bg-white transition-all duration-200 shadow-lg"
                      title="View full size"
                    >
                      <PhotoIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onRemovePhoto(ref.id)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-red-600 hover:bg-white transition-all duration-200 shadow-lg"
                      title="Remove photo"
                      disabled={deletingPhotoId === ref.id}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <PhotoModal
        isOpen={showPhotoModal}
        photoUrl={selectedPhoto}
        onClose={handleClosePhotoModal}
      />
    </>
  );
}
