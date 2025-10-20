'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CalendarIcon, PhotoIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { ChapterMedia } from './ChapterMedia';
import { PhotoModal } from './PhotoModal';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

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
  order: number;
  mediaReferences?: MediaReference[];
}

interface Media {
  id: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
}

interface StoryEditorProps {
  storyId: string;
  chapterId: string;
  onUpdate: (chapter: Chapter) => void;
  onAddMedia?: () => void;
  refreshTrigger?: number; // Add refresh trigger
  isUploadingMedia?: boolean; // Add upload loading state
}

export function StoryEditor({ storyId, chapterId, onUpdate, onAddMedia, refreshTrigger, isUploadingMedia = false }: StoryEditorProps) {
  const router = useRouter();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);

  useEffect(() => {
    fetchChapter();
  }, [chapterId]);

  // Refresh chapter data when refreshTrigger changes (e.g., after media is added)
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      // Preserve local changes before refreshing
      const currentTitle = chapter?.title;
      const currentContent = chapter?.content;
      const currentDate = chapter?.date;
      
      fetchChapter().then(() => {
        // Restore local changes after refresh
        if (chapter && (currentTitle || currentContent || currentDate)) {
          setChapter(prev => prev ? {
            ...prev,
            title: currentTitle || prev.title,
            content: currentContent || prev.content,
            date: currentDate || prev.date
          } : null);
        }
      });
    }
  }, [refreshTrigger]);

  const fetchChapter = async () => {
    try {
      const response = await fetch(`/api/stories/${storyId}/chapters/${chapterId}`);
      if (response.ok) {
        const data = await response.json();
        setChapter(data);
      }
    } catch (error) {
      console.error('Error fetching chapter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveChapter = async (updatedData: Partial<Chapter>) => {
    if (!chapter) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/stories/${storyId}/chapters/${chapterId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedChapter = await response.json();
        setChapter(updatedChapter);
        onUpdate(updatedChapter);
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Error saving chapter:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (title: string) => {
    if (!chapter) return;
    
    const updatedChapter = { ...chapter, title };
    setChapter(updatedChapter);
  };

  const handleContentChange = (content: string) => {
    if (!chapter) return;
    
    const updatedChapter = { ...chapter, content };
    setChapter(updatedChapter);
  };

  const handleSave = () => {
    if (!chapter) return;
    saveChapter({
      title: chapter.title,
      content: chapter.content,
      date: chapter.date
    });
  };

  const handleDateChange = (date: string) => {
    if (!chapter) return;
    const updatedChapter = { ...chapter, date };
    setChapter(updatedChapter);
  };

  const handleExit = () => {
    router.push('/dashboard');
  };

  const handlePhotoClick = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setShowPhotoModal(true);
  };

  const handleClosePhotoModal = () => {
    setShowPhotoModal(false);
    setSelectedPhoto(null);
  };

  const handleRemovePhoto = async (mediaRefId: string) => {
    if (!chapter) return;
    
    setDeletingPhotoId(mediaRefId);
    try {
      const response = await fetch(`/api/media-reference/${mediaRefId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Preserve local changes before refreshing
        const currentTitle = chapter.title;
        const currentContent = chapter.content;
        const currentDate = chapter.date;
        
        // Refresh chapter data to show updated media
        await fetchChapter();
        
        // Restore local changes after refresh
        if (chapter) {
          setChapter(prev => prev ? {
            ...prev,
            title: currentTitle,
            content: currentContent,
            date: currentDate
          } : null);
        }
      } else {
        console.error('Failed to remove photo');
      }
    } catch (error) {
      console.error('Error removing photo:', error);
    } finally {
      setDeletingPhotoId(null);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'align', 'link', 'image'
  ];

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mb-6"></div>
          <div className="h-96 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="card text-center py-16">
        <h3 className="text-lg font-semibold text-neutral-600 mb-2">
          Chapter not found
        </h3>
        <p className="text-neutral-500">
          The selected chapter could not be loaded.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chapter Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-800 font-serif">
            Chapter Editor
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4 text-sm text-neutral-500">
              {isSaving && (
                <span className="flex items-center space-x-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-500"></div>
                  <span>Saving...</span>
                </span>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 text-sm bg-primary-600 text-white hover:bg-primary-700 disabled:bg-neutral-400 rounded-lg transition-colors"
            >
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
            <button
              onClick={handleExit}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Chapter Title
            </label>
            <input
              type="text"
              value={chapter.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="input text-lg font-semibold"
              placeholder="Enter chapter title..."
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Date (optional)
            </label>
            <div className="relative">
              <input
                type="date"
                value={chapter.date ? new Date(chapter.date).toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                style={{ 
                  colorScheme: 'light',
                  backgroundColor: 'white'
                }}
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              When did this chapter happen? Leave blank if not applicable.
            </p>
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div className="card">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-neutral-700">
              Chapter Content
            </label>
            <div className="flex items-center space-x-2 text-xs text-neutral-500">
              {isSaving && (
                <div className="flex items-center space-x-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600"></div>
                  <span>Saving...</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="prose-editor">
          <ReactQuill
            value={chapter.content || ''}
            onChange={handleContentChange}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Start writing your chapter..."
            style={{ 
              minHeight: '120px',
              maxHeight: '400px',
              overflow: 'auto'
            }}
          />
        </div>
      </div>

      {/* Chapter Media */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-800">Chapter Media</h3>
          <button 
            onClick={onAddMedia}
            className="btn-secondary flex items-center space-x-2"
          >
            <PhotoIcon className="h-4 w-4" />
            <span>Add Media</span>
          </button>
        </div>

        {isUploadingMedia ? (
          <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-500 mb-4">Uploading photos...</p>
            <p className="text-sm text-neutral-400">Please wait while your photos are being processed</p>
          </div>
        ) : (
          <ChapterMedia
            mediaReferences={chapter.mediaReferences || []}
            onRemovePhoto={handleRemovePhoto}
            deletingPhotoId={deletingPhotoId}
          />
        )}
      </div>

      <PhotoModal
        isOpen={showPhotoModal}
        photoUrl={selectedPhoto}
        onClose={handleClosePhotoModal}
      />
    </div>
  );
}
