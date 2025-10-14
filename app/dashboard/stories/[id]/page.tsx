'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  PlusIcon,
  EyeIcon,
  ShareIcon,
  Cog6ToothIcon,
  PhotoIcon,
  DocumentTextIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { StoryEditor } from '@/components/editor/StoryEditor';
import { ImageUpload } from '@/components/upload/ImageUpload';

interface Story {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  slug: string;
  domain: string;
  template: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
  media: Media[];
  settings?: StorySettings;
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

export default function StoryEditPage() {
  const params = useParams();
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chapters' | 'media' | 'settings'>('chapters');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchStory(params.id as string);
    }
  }, [params.id]);

  const fetchStory = async (id: string) => {
    try {
      const response = await fetch(`/api/stories/${id}`);
      if (response.ok) {
        const data = await response.json();
        setStory(data);
      } else if (response.status === 404) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching story:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChapter = async () => {
    if (!story) return;
    
    setIsCreatingChapter(true);
    try {
      const response = await fetch(`/api/stories/${story.id}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'New Chapter',
          order: story.chapters.length,
        }),
      });

      if (response.ok) {
        const newChapter = await response.json();
        setStory(prev => prev ? {
          ...prev,
          chapters: [...prev.chapters, newChapter]
        } : null);
        setSelectedChapter(newChapter.id);
      }
    } catch (error) {
      console.error('Error creating chapter:', error);
    } finally {
      setIsCreatingChapter(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!story) return;

    try {
      const response = await fetch(`/api/stories/${story.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublic: !story.isPublic,
        }),
      });

      if (response.ok) {
        setStory(prev => prev ? { ...prev, isPublic: !prev.isPublic } : null);
      }
    } catch (error) {
      console.error('Error updating story:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mb-8"></div>
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="h-96 bg-neutral-200 rounded"></div>
            </div>
            <div className="lg:col-span-3">
              <div className="h-96 bg-neutral-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
        <h1 className="text-2xl font-bold text-neutral-800 mb-4">Story not found</h1>
        <Link href="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'chapters' as const, name: 'Chapters', icon: DocumentTextIcon, count: story.chapters.length },
    { id: 'media' as const, name: 'Media', icon: PhotoIcon, count: story.media.length },
    { id: 'settings' as const, name: 'Settings', icon: Cog6ToothIcon },
  ];

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
                {story.title}
              </h1>
              {story.subtitle && (
                <p className="text-neutral-600 mt-1">{story.subtitle}</p>
              )}
              <div className="flex items-center space-x-4 mt-2 text-sm text-neutral-500">
                <span>Domain: {story.domain}</span>
                <span>•</span>
                <span>Template: {story.template}</span>
                <span>•</span>
                <span>Updated: {new Date(story.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {story.isPublic && (
              <a
                href={`https://${story.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center space-x-2"
              >
                <EyeIcon className="h-4 w-4" />
                <span>View Live</span>
              </a>
            )}
            <button
              onClick={handlePublishToggle}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                story.isPublic
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {story.isPublic ? 'Published' : 'Publish'}
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <ShareIcon className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-0 overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-neutral-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <tab.icon className="h-4 w-4" />
                    <span className="font-medium">{tab.name}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className="text-xs bg-neutral-200 text-neutral-600 px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'chapters' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-neutral-800">Chapters</h3>
                    <button
                      onClick={handleCreateChapter}
                      disabled={isCreatingChapter}
                      className="p-1 text-primary-600 hover:text-primary-500 disabled:opacity-50"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                  {story.chapters.length === 0 ? (
                    <div className="text-center py-8">
                      <DocumentTextIcon className="h-12 w-12 text-neutral-300 mx-auto mb-2" />
                      <p className="text-sm text-neutral-500 mb-4">No chapters yet</p>
                      <button
                        onClick={handleCreateChapter}
                        disabled={isCreatingChapter}
                        className="btn-primary text-sm"
                      >
                        Add First Chapter
                      </button>
                    </div>
                  ) : (
                    story.chapters.map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => setSelectedChapter(chapter.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedChapter === chapter.id
                            ? 'bg-primary-50 border border-primary-200'
                            : 'hover:bg-neutral-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-neutral-800 truncate">
                              {chapter.title}
                            </h4>
                            {chapter.date && (
                              <p className="text-xs text-neutral-500 mt-1">
                                {new Date(chapter.date).toLocaleDateString()}
                              </p>
                            )}
                            <div className="flex items-center space-x-2 mt-2 text-xs text-neutral-400">
                              <span>{chapter.media.length} media</span>
                            </div>
                          </div>
                          <PencilIcon className="h-3 w-3 text-neutral-400 flex-shrink-0" />
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'media' && (
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-4">Media Library</h3>
                  <ImageUpload 
                    storyId={story.id} 
                    onUploadComplete={(media) => {
                      setStory(prev => prev ? {
                        ...prev,
                        media: [...prev.media, media]
                      } : null);
                    }} 
                  />
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-4">Story Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Primary Color
                      </label>
                      <input
                        type="color"
                        value={story.settings?.primaryColor || '#df8548'}
                        className="w-full h-10 rounded border border-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Font Family
                      </label>
                      <select className="input">
                        <option value="serif">Serif (Playfair Display)</option>
                        <option value="sans">Sans-serif (Inter)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'chapters' && selectedChapter && (
            <StoryEditor
              storyId={story.id}
              chapterId={selectedChapter}
              onUpdate={(updatedChapter) => {
                setStory(prev => prev ? {
                  ...prev,
                  chapters: prev.chapters.map(ch => 
                    ch.id === updatedChapter.id ? updatedChapter : ch
                  )
                } : null);
              }}
            />
          )}

          {activeTab === 'chapters' && !selectedChapter && story.chapters.length > 0 && (
            <div className="card text-center py-16">
              <DocumentTextIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-600 mb-2">
                Select a Chapter to Edit
              </h3>
              <p className="text-neutral-500">
                Choose a chapter from the sidebar to start editing your story.
              </p>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-neutral-800 mb-6 font-serif">
                Media Gallery
              </h2>
              {story.media.length === 0 ? (
                <div className="text-center py-16">
                  <PhotoIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-600 mb-2">
                    No media uploaded yet
                  </h3>
                  <p className="text-neutral-500">
                    Upload photos and videos to enhance your story.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {story.media.map((media) => (
                    <div key={media.id} className="relative group">
                      <img
                        src={media.thumbnailUrl || media.url}
                        alt={media.title || ''}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 bg-white rounded-full text-neutral-600 hover:text-red-600">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-neutral-800 mb-6 font-serif">
                Story Settings
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-neutral-800 mb-4">Appearance</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Primary Color
                      </label>
                      <input
                        type="color"
                        value={story.settings?.primaryColor || '#df8548'}
                        className="w-full h-12 rounded-lg border border-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Font Family
                      </label>
                      <select className="input">
                        <option value="serif">Serif (Elegant)</option>
                        <option value="sans">Sans-serif (Modern)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-neutral-800 mb-4">Features</h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={story.settings?.enableComments || false}
                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-neutral-700">Enable visitor comments</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={story.settings?.enableDownload || true}
                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-neutral-700">Allow photo downloads</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
