'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PhotoIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Media {
  id: string;
  type: string;
  url: string;
  title?: string;
  createdAt: string;
}

interface MediaSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: Media[]) => void;
  selectedMediaIds?: string[];
  multiSelect?: boolean;
  chapterId?: string;
  chapterTitle?: string;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}

export function MediaSelector({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedMediaIds = [],
  multiSelect = true,
  chapterId,
  chapterTitle,
  onUploadStart,
  onUploadEnd
}: MediaSelectorProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedMediaIds);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      // Clear previous selections when opening
      setSelectedIds([]);
    }
  }, [isOpen]);

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
      setLoading(false);
    }
  };

  const toggleSelection = (mediaId: string) => {
    if (multiSelect) {
      setSelectedIds(prev => 
        prev.includes(mediaId) 
          ? prev.filter(id => id !== mediaId)
          : [...prev, mediaId]
      );
    } else {
      setSelectedIds([mediaId]);
    }
  };

  const handleConfirm = () => {
    const selectedMedia = media.filter(item => selectedIds.includes(item.id));
    onSelect(selectedMedia);
    setSelectedIds([]); // Clear selections after confirming
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-800">
                Select Media from Gallery
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                {chapterTitle 
                  ? `Choose photos to add to "${chapterTitle}" chapter`
                  : 'Choose photos from your gallery to add to this story'
                }
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedIds([]);
                onClose();
              }}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-neutral-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-square bg-neutral-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-12">
              <PhotoIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-600 mb-2">
                No media in gallery
              </h3>
              <p className="text-neutral-500">
                Upload some photos to your gallery first
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  className={`
                    relative aspect-square bg-neutral-100 rounded-lg overflow-hidden cursor-pointer
                    transition-all duration-200 hover:shadow-md
                    ${selectedIds.includes(item.id) 
                      ? 'ring-2 ring-primary-500 ring-offset-2' 
                      : 'hover:ring-1 hover:ring-neutral-300'
                    }
                  `}
                  onClick={() => toggleSelection(item.id)}
                >
                  <img
                    src={item.url}
                    alt={item.title || 'Media'}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Selection indicator */}
                  <div className={`
                    absolute top-2 right-2 w-6 h-6 rounded-full transition-all duration-200
                    ${selectedIds.includes(item.id)
                      ? 'bg-primary-500 text-white'
                      : 'bg-white bg-opacity-80 text-neutral-400'
                    }
                    flex items-center justify-center
                  `}>
                    {selectedIds.includes(item.id) ? (
                      <CheckCircleIcon className="h-4 w-4" />
                    ) : (
                      <div className="w-3 h-3 border-2 border-current rounded-full" />
                    )}
                  </div>

                  {/* Title overlay */}
                  {item.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                      <p className="text-xs truncate">{item.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={selectedIds.length === 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Selected Media
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
