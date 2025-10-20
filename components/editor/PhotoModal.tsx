'use client';

import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface PhotoModalProps {
  isOpen: boolean;
  photoUrl: string | null;
  onClose: () => void;
}

export function PhotoModal({ isOpen, photoUrl, onClose }: PhotoModalProps) {
  if (!isOpen || !photoUrl) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative max-w-6xl max-h-[95vh] p-8"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <button
          onClick={onClose}
          className="absolute -top-6 -right-6 z-10 p-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-white"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-200">
          <img
            src={photoUrl}
            alt="Full size photo"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
