'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CalendarIcon, PhotoIcon } from '@heroicons/react/24/outline';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

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

interface StoryEditorProps {
  storyId: string;
  chapterId: string;
  onUpdate: (chapter: Chapter) => void;
}

export function StoryEditor({ storyId, chapterId, onUpdate }: StoryEditorProps) {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    fetchChapter();
  }, [chapterId]);

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
    
    // Debounced save
    setTimeout(() => {
      saveChapter({ title });
    }, 1000);
  };

  const handleContentChange = (content: string) => {
    if (!chapter) return;
    
    const updatedChapter = { ...chapter, content };
    setChapter(updatedChapter);
    
    // Debounced save
    setTimeout(() => {
      saveChapter({ content });
    }, 2000);
  };

  const handleDateChange = (date: string) => {
    if (!chapter) return;
    saveChapter({ date });
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
          <div className="flex items-center space-x-4 text-sm text-neutral-500">
            {isSaving && (
              <span className="flex items-center space-x-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-500"></div>
                <span>Saving...</span>
              </span>
            )}
            {lastSaved && !isSaving && (
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            )}
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
                className="input pr-10"
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div className="card">
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Chapter Content
          </label>
        </div>
        
        <div className="prose-editor">
          <ReactQuill
            value={chapter.content || ''}
            onChange={handleContentChange}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Start writing your chapter..."
            style={{ minHeight: '400px' }}
          />
        </div>
      </div>

      {/* Chapter Media */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-800">Chapter Media</h3>
          <button className="btn-secondary flex items-center space-x-2">
            <PhotoIcon className="h-4 w-4" />
            <span>Add Media</span>
          </button>
        </div>

        {chapter.media.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-lg">
            <PhotoIcon className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 mb-4">No media in this chapter yet</p>
            <button className="btn-primary">
              Add Photos or Videos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {chapter.media.map((media) => (
              <div key={media.id} className="relative group">
                <img
                  src={media.thumbnailUrl || media.url}
                  alt={media.title || ''}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                    <button className="p-2 bg-white rounded-full text-neutral-600 hover:text-primary-600">
                      <PhotoIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
