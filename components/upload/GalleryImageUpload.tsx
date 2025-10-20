'use client';

import { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface GalleryImageUploadProps {
  onUploadSuccess?: (media: any[]) => void;
  className?: string;
}

export function GalleryImageUpload({ 
  onUploadSuccess, 
  className = '' 
}: GalleryImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;

    // Convert FileList to Array and validate all files
    const fileArray = Array.from(files);
    const validFiles = [];
    
    for (const file of fileArray) {
      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        setError(`${file.name}: Please select an image or video file`);
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError(`${file.name}: File size must be less than 10MB`);
        return;
      }
      
      validFiles.push(file);
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    setUploadedCount(0);
    setTotalFiles(validFiles.length);

    const uploadedMedia = [];

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        
        const formData = new FormData();
        formData.append('file', file);
        // Don't include storyId for gallery uploads

        const response = await fetch('/api/upload-gallery', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 403 && errorData.error?.includes('Photo limit reached')) {
            throw new Error(`Photo limit reached! You've used ${errorData.photoCount} of ${errorData.photoLimit} photos. Please upgrade your plan to upload more photos.`);
          }
          throw new Error(`${file.name}: ${errorData.error || 'Upload failed'}`);
        }

        const data = await response.json();
        uploadedMedia.push(data.media);
        
        // Update progress
        const completed = i + 1;
        setUploadedCount(completed);
        setUploadProgress((completed / validFiles.length) * 100);
      }
      
      if (onUploadSuccess) {
        onUploadSuccess(uploadedMedia);
      }
      
      // Reset after success
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadedCount(0);
        setTotalFiles(0);
      }, 1000);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
      setUploadedCount(0);
      setTotalFiles(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <div className="space-y-2">
              <p className="text-sm text-neutral-600">
                Uploading to your gallery... ({uploadedCount}/{totalFiles})
              </p>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-neutral-500">
                {Math.round(uploadProgress)}% complete
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <PhotoIcon className="h-12 w-12 text-neutral-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-neutral-700">
                Add photos to your gallery
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                Drop multiple images here, or click to select • JPG, PNG, GIF, MP4 (max 10MB each)
              </p>
              <p className="text-xs text-neutral-400 mt-2">
                Select multiple files to upload them all at once
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-center justify-between">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
