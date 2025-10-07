'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PhotoIcon, VideoCameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Media {
  id: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  order: number;
}

interface MediaUploadProps {
  storyId: string;
  chapterId?: string;
  onUpload: (media: Media) => void;
}

export function MediaUpload({ storyId, chapterId, onUpload }: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);

    for (const file of acceptedFiles) {
      const fileId = `${file.name}-${Date.now()}`;
      
      // Create preview
      const preview = URL.createObjectURL(file);
      setPreviews(prev => ({ ...prev, [fileId]: preview }));
      
      try {
        // Upload file
        const formData = new FormData();
        formData.append('file', file);
        formData.append('storyId', storyId);
        if (chapterId) formData.append('chapterId', chapterId);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const media = await response.json();
          onUpload(media);
          
          // Clean up preview
          URL.revokeObjectURL(preview);
          setPreviews(prev => {
            const { [fileId]: removed, ...rest } = prev;
            return rest;
          });
        } else {
          console.error('Upload failed');
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    setIsUploading(false);
    setUploadProgress({});
  }, [storyId, chapterId, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removePreview = (fileId: string) => {
    const preview = previews[fileId];
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreviews(prev => {
        const { [fileId]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-400 bg-primary-50'
            : 'border-neutral-300 hover:border-primary-400 hover:bg-primary-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex justify-center space-x-4 mb-4">
          <PhotoIcon className="h-12 w-12 text-neutral-400" />
          <VideoCameraIcon className="h-12 w-12 text-neutral-400" />
        </div>
        
        {isDragActive ? (
          <p className="text-primary-600 font-medium">Drop your files here...</p>
        ) : (
          <div>
            <p className="text-neutral-600 font-medium mb-2">
              Drop photos and videos here, or click to browse
            </p>
            <p className="text-sm text-neutral-500">
              Supports JPEG, PNG, GIF, WebP, MP4, MOV up to 50MB
            </p>
          </div>
        )}
      </div>

      {/* Upload Previews */}
      {Object.keys(previews).length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-neutral-800">Uploading...</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(previews).map(([fileId, preview]) => (
              <div key={fileId} className="relative">
                <div className="relative">
                  <img
                    src={preview}
                    alt="Upload preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePreview(fileId)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-2">
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress[fileId] || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    {isUploading ? 'Uploading...' : 'Processing...'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Tips */}
      <div className="text-xs text-neutral-500 space-y-1">
        <p>💡 <strong>Tips:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Upload high-quality images for the best results</li>
          <li>Videos will be automatically compressed for web</li>
          <li>You can drag and drop multiple files at once</li>
          <li>Files are automatically backed up to the cloud</li>
        </ul>
      </div>
    </div>
  );
}
