'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  PlusIcon,
  EyeIcon,
  PhotoIcon,
  DocumentTextIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StoryEditor } from '@/components/editor/StoryEditor';
import { ImageUpload } from '@/components/upload/ImageUpload';
import { MediaSelector } from '@/components/media/MediaSelector';
import { getPublicSiteUrl, getDisplayUrl } from '@/lib/url-utils';
import { canUseCoverPhoto } from '@/lib/tiers';

interface Story {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  slug: string;
  domain: string;
  template: string;
  isPublic: boolean;
  coverPhoto?: string;
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
  mediaReferences?: MediaReference[];
  settings?: StorySettings;
}

interface Chapter {
  id: string;
  title: string;
  content?: string;
  date?: string;
  order: number;
  mediaReferences?: MediaReference[];
}

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
  const [activeTab, setActiveTab] = useState<'chapters' | 'media' | 'cover' | 'settings'>('chapters');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [selectedChapterForMedia, setSelectedChapterForMedia] = useState<string | null>(null);
  const [chapterRefreshTrigger, setChapterRefreshTrigger] = useState(0);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
  const [showCoverPhotoSelector, setShowCoverPhotoSelector] = useState(false);
  const [userTier, setUserTier] = useState('free');

  useEffect(() => {
    if (params.id) {
      fetchStory(params.id as string);
    }
  }, [params.id]);

  useEffect(() => {
    const fetchUserTier = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUserTier(userData.tier);
        }
      } catch (error) {
        console.error('Error fetching user tier:', error);
      }
    };

    fetchUserTier();
  }, []);

  const fetchStory = async (id: string) => {
    try {
      const response = await fetch(`/api/stories/${id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched story data:', data);
        console.log('Cover photo in fetched data:', data.coverPhoto);
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

  // Set default tab for Gallery stories
  useEffect(() => {
    if (story && story.template === 'gallery') {
      setActiveTab('media');
    }
  }, [story]);

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

  const handleMediaSelection = async (selectedMedia: any[]) => {
    if (!story) return;

    setIsUploadingMedia(true);
    try {
      const mediaIds = selectedMedia.map(media => media.id);
      
      const response = await fetch('/api/media/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mediaIds,
          storyId: story.id,
          chapterId: story.template === 'gallery' ? null : selectedChapterForMedia, // For Gallery stories, link to story only
        }),
      });

      if (response.ok) {
        // Refresh story data to show newly linked media
        fetchStory(story.id);
        // Trigger chapter refresh to show new media (only for non-gallery stories)
        if (story.template !== 'gallery') {
          setChapterRefreshTrigger(prev => prev + 1);
        }
        // Reset chapter selection
        setSelectedChapterForMedia(null);
      } else {
        console.error('Failed to link media to story');
      }
    } catch (error) {
      console.error('Error linking media to story:', error);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string, chapterTitle: string) => {
    if (!story) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete the chapter "${chapterTitle}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/stories/${story.id}/chapters/${chapterId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the chapter from the local state
        setStory(prev => prev ? {
          ...prev,
          chapters: prev.chapters.filter(chapter => chapter.id !== chapterId)
        } : null);
        
        // Clear selected chapter if it was the deleted one
        if (selectedChapter === chapterId) {
          setSelectedChapter(null);
        }
      } else {
        const errorData = await response.json();
        alert(`Failed to delete chapter: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error deleting chapter:', error);
      alert('Failed to delete chapter. Please try again.');
    }
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
    if (!story) return;
    
    setDeletingPhotoId(mediaRefId);
    try {
      const response = await fetch(`/api/media-reference/${mediaRefId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Refresh story data to show updated media
        fetchStory(story.id);
      } else {
        console.error('Failed to remove photo');
      }
    } catch (error) {
      console.error('Error removing photo:', error);
    } finally {
      setDeletingPhotoId(null);
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

  const tabs = story.template === 'gallery' 
    ? [
        { id: 'media' as const, name: 'Gallery', icon: PhotoIcon, count: story.mediaReferences?.length || 0 },
        ...(canUseCoverPhoto(userTier) ? [{ id: 'cover' as const, name: 'Cover Photo', icon: PhotoIcon }] : []),
      ]
    : [
        { id: 'chapters' as const, name: 'Chapters', icon: DocumentTextIcon, count: story.chapters.length },
        { id: 'media' as const, name: 'Media', icon: PhotoIcon, count: story.mediaReferences?.length || 0 },
        ...(canUseCoverPhoto(userTier) ? [{ id: 'cover' as const, name: 'Cover Photo', icon: PhotoIcon }] : []),
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
            <div className="flex-1">
              <div className="space-y-2">
                <input
                  type="text"
                  value={story.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setStory(prev => prev ? { ...prev, title: newTitle } : null);
                  }}
                  onBlur={(e) => {
                    const newTitle = e.target.value;
                    if (newTitle !== story.title) {
                      fetch(`/api/stories/${story.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: newTitle }),
                      });
                    }
                  }}
                  className="text-3xl font-bold text-neutral-800 font-serif bg-transparent border-none outline-none focus:bg-white focus:border focus:border-neutral-300 focus:rounded px-2 py-1 -mx-2 -my-1 transition-all duration-200"
                  placeholder="Story title..."
                />
                
              </div>
              <div className="flex items-center space-x-4 mt-2 text-sm text-neutral-500">
                <span>URL: {getDisplayUrl(story.domain, story.slug)}</span>
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
                href={getPublicSiteUrl(story.domain, story.slug)}
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

            {/* Free User Notice */}
            {!canUseCoverPhoto(userTier) && (
              <div className="p-4 bg-blue-50 border-t border-blue-200">
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Upgrade to unlock:</p>
                  <ul className="text-xs space-y-1">
                    <li>• Cover photo selection</li>
                    <li>• Gallery & Blog templates</li>
                    <li>• 500+ photos</li>
                  </ul>
                  <Link 
                    href="/dashboard/settings"
                    className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Plans →
                  </Link>
                </div>
              </div>
            )}

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
                              <span>{chapter.mediaReferences?.length || 0} media</span>
                            </div>
                            
                            {/* Chapter Media Preview */}
                            {chapter.mediaReferences && chapter.mediaReferences.length > 0 && (
                              <div className="flex space-x-1 mt-2">
                                {chapter.mediaReferences.slice(0, 3).map((ref) => (
                                  <img
                                    key={ref.id}
                                    src={ref.media.url}
                                    alt={ref.media.title || ''}
                                    className="w-8 h-8 object-cover rounded border"
                                  />
                                ))}
                                {chapter.mediaReferences.length > 3 && (
                                  <div className="w-8 h-8 bg-neutral-200 rounded border flex items-center justify-center text-xs text-neutral-500">
                                    +{chapter.mediaReferences.length - 3}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2 mt-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedChapterForMedia(chapter.id);
                                  setShowMediaSelector(true);
                                }}
                                className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded hover:bg-primary-200 transition-colors"
                              >
                                Add Media
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteChapter(chapter.id, chapter.title);
                                }}
                                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                                title="Delete chapter"
                              >
                                <TrashIcon className="h-3 w-3" />
                              </button>
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
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <PhotoIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                      Shared Media Gallery
                    </h3>
                    <p className="text-neutral-600 mb-6">
                      All your photos are stored in one shared gallery. Use chapter "Add Media" buttons to add photos to specific chapters.
                    </p>
                    <a
                      href="/dashboard/gallery"
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <PhotoIcon className="h-4 w-4 mr-2" />
                      Go to Gallery
                    </a>
                  </div>
                  
                  <div className="border-t border-neutral-200 pt-6">
                    <h4 className="font-semibold text-neutral-800 mb-3">How to Add Photos to Chapters:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-600">
                      <li>Go to the <strong>Chapters</strong> tab</li>
                      <li>Click <strong>"Add Media"</strong> on any chapter</li>
                      <li>Select photos from your gallery</li>
                      <li>Photos will appear in that specific chapter</li>
                    </ol>
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
              onAddMedia={() => {
                setSelectedChapterForMedia(selectedChapter);
                setShowMediaSelector(true);
              }}
              refreshTrigger={chapterRefreshTrigger}
              isUploadingMedia={isUploadingMedia}
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
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 p-8 border-b border-gray-100">
              <h2 className="text-2xl font-light text-gray-900 mb-3">
                {story.template === 'gallery' ? 'Gallery' : 'Media Gallery'}
              </h2>
              <p className="text-gray-600 text-lg">
                {story.template === 'gallery' ? 'Create your visual story' : 'Manage your story media'}
              </p>
            </div>
              <div className="p-8">
              
              {story.template === 'gallery' ? (
                // Gallery template - direct upload to story
                <div className="space-y-8">
                  {isUploadingMedia ? (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                      <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900 mx-auto mb-6"></div>
                      <h3 className="text-xl font-light text-gray-900 mb-4">
                        Uploading Media...
                      </h3>
                      <p className="text-gray-600">Your photos are being processed</p>
                    </div>
                  ) : (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-6">
                        <PhotoIcon className="h-8 w-8 text-gray-600" />
                      </div>
                      <h3 className="text-2xl font-light text-gray-900 mb-4">
                        Create Your Gallery
                      </h3>
                      <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Add photos and videos to create a beautiful visual story
                      </p>
                      <button
                        onClick={() => setShowMediaSelector(true)}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium text-sm uppercase tracking-wide shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <PhotoIcon className="h-4 w-4 mr-3" />
                        Add Media
                      </button>
                    </div>
                  )}
                  
                  {story.mediaReferences && story.mediaReferences.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-light text-gray-900">
                          Your Gallery ({story.mediaReferences.length})
                        </h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-500 font-medium uppercase tracking-wide">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span>Live Gallery</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {story.mediaReferences.map((ref, index) => (
                          <motion.div 
                            key={ref.id} 
                            className="relative group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {deletingPhotoId === ref.id ? (
                              <div className="w-full h-48 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
                                <div className="text-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900 mx-auto mb-4"></div>
                                  <p className="text-sm font-medium text-gray-600">Removing...</p>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="relative overflow-hidden rounded-2xl shadow-sm group-hover:shadow-md transition-all duration-200 border border-gray-100">
                                  <img
                                    src={ref.media.thumbnailUrl || ref.media.url}
                                    alt={ref.media.title || ''}
                                    className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-200"
                                    onClick={() => handlePhotoClick(ref.media.url)}
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <div className="flex space-x-3">
                                      <button
                                        onClick={() => handlePhotoClick(ref.media.url)}
                                        className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-gray-900 hover:bg-white transition-all duration-200 shadow-lg"
                                        title="View full size"
                                      >
                                        <PhotoIcon className="h-5 w-5" />
                                      </button>
                                      <button
                                        onClick={() => handleRemovePhoto(ref.id)}
                                        className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-red-600 hover:bg-white transition-all duration-200 shadow-lg"
                                        title="Remove photo"
                                        disabled={deletingPhotoId === ref.id}
                                      >
                                        <TrashIcon className="h-6 w-6" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Timeline/Blog template - show instructions
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-6">
                    <PhotoIcon className="h-8 w-8 text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-light text-gray-900 mb-3">
                    Chapter Media
                  </h3>
                  <p className="text-gray-600 mb-4 font-medium">
                    For {story.template} stories, add media to individual chapters.
                  </p>
                  <p className="text-sm text-gray-500">
                    Use the "Add Media" button in each chapter to link photos from your gallery.
                  </p>
                </div>
              )}
              </div>
            </div>
          )}


          {/* Cover Photo Tab */}
          {activeTab === 'cover' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-50 p-8 border-b border-gray-100">
                <h2 className="text-2xl font-light text-gray-900 mb-3">
                  Cover Photo
                </h2>
                <p className="text-gray-600 text-lg">
                  Choose a photo to represent your story on the public website
                </p>
              </div>
              <div className="p-8">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Current Cover Photo</h3>
                    <button
                      onClick={() => setShowCoverPhotoSelector(true)}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      {story.coverPhoto ? 'Change' : 'Select'} Cover Photo
                    </button>
                  </div>
                  
                  {story.coverPhoto ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <img 
                          src={story.coverPhoto} 
                          alt="Cover photo" 
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">Cover photo selected</p>
                          <p className="text-xs text-gray-500">This photo will be displayed on your public website</p>
                          <button
                            onClick={() => {
                              setStory(prev => prev ? { ...prev, coverPhoto: undefined } : null);
                              fetch(`/api/stories/${story.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ coverPhoto: null }),
                              });
                            }}
                            className="text-xs text-red-600 hover:text-red-800 font-medium mt-2"
                          >
                            Remove cover photo
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                      <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Cover Photo Selected</h3>
                      <p className="text-gray-500 mb-6">Choose a photo from your story chapters to represent your story</p>
                      <button
                        onClick={() => setShowCoverPhotoSelector(true)}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium text-sm uppercase tracking-wide shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <PhotoIcon className="h-4 w-4 mr-2" />
                        Select Cover Photo
                      </button>
                    </div>
                  )}
                  
                  <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">How it works:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Cover photos are selected from your story chapters</li>
                      <li>• They appear on your public website and story cards</li>
                      <li>• If no cover photo is set, the first chapter photo will be used</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Media Selector Modal */}
      <MediaSelector
        isOpen={showMediaSelector}
        onClose={() => {
          setShowMediaSelector(false);
          setSelectedChapterForMedia(null);
        }}
        onSelect={handleMediaSelection}
        chapterId={story?.template === 'gallery' ? undefined : (selectedChapterForMedia || undefined)}
        chapterTitle={story?.template === 'gallery' ? 'Gallery' : (selectedChapterForMedia ? story?.chapters.find(c => c.id === selectedChapterForMedia)?.title : undefined)}
      />

      {/* Cover Photo Selector Modal */}
      {showCoverPhotoSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-gray-900">Select Cover Photo</h2>
                <button
                  onClick={() => setShowCoverPhotoSelector(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                {story?.template === 'gallery' 
                  ? 'Choose a photo from your gallery' 
                  : 'Choose a photo from your story chapters'
                }
              </p>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {story && story.template === 'gallery' ? (
                // Gallery stories - use story media
                story.mediaReferences && story.mediaReferences.length > 0 ? (
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Gallery Photos</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {story.mediaReferences.map((ref) => (
                          <button
                            key={ref.id}
                            onClick={() => {
                              const coverPhotoUrl = ref.media.url;
                              console.log('Setting cover photo URL:', coverPhotoUrl);
                              setStory(prev => prev ? { ...prev, coverPhoto: coverPhotoUrl } : null);
                              fetch(`/api/stories/${story.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ coverPhoto: coverPhotoUrl }),
                              }).then(response => {
                                console.log('Cover photo save response:', response.status);
                                return response.json();
                              }).then(data => {
                                console.log('Cover photo save data:', data);
                              }).catch(error => {
                                console.error('Cover photo save error:', error);
                              });
                              setShowCoverPhotoSelector(false);
                            }}
                            className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-300 transition-all duration-200"
                          >
                            <img
                              src={ref.media.url}
                              alt={ref.media.title || 'Gallery media'}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="bg-white/90 rounded-full p-2">
                                  <PhotoIcon className="h-4 w-4 text-gray-700" />
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <PhotoIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Photos Available</h3>
                    <p className="text-gray-500">Add photos to your gallery first, then you can select a cover photo.</p>
                  </div>
                )
              ) : story && story.chapters && story.chapters.length > 0 ? (
                // Timeline/Blog stories - use chapter media
                <div className="space-y-6">
                  {story.chapters.map((chapter) => (
                    <div key={chapter.id} className="border border-gray-200 rounded-xl p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">{chapter.title}</h3>
                      {chapter.mediaReferences && chapter.mediaReferences.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {chapter.mediaReferences.map((ref) => (
                            <button
                              key={ref.id}
                              onClick={() => {
                                const coverPhotoUrl = ref.media.url;
                                console.log('Setting cover photo URL:', coverPhotoUrl);
                                setStory(prev => prev ? { ...prev, coverPhoto: coverPhotoUrl } : null);
                                fetch(`/api/stories/${story.id}`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ coverPhoto: coverPhotoUrl }),
                                }).then(response => {
                                  console.log('Cover photo save response:', response.status);
                                  return response.json();
                                }).then(data => {
                                  console.log('Cover photo save data:', data);
                                }).catch(error => {
                                  console.error('Cover photo save error:', error);
                                });
                                setShowCoverPhotoSelector(false);
                              }}
                              className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-300 transition-all duration-200"
                            >
                              <img
                                src={ref.media.url}
                                alt={ref.media.title || 'Chapter media'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <div className="bg-white/90 rounded-full p-2">
                                    <PhotoIcon className="h-4 w-4 text-gray-700" />
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No photos in this chapter</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <PhotoIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Photos Available</h3>
                  <p className="text-gray-500">Add photos to your story first, then you can select a cover photo.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {showPhotoModal && selectedPhoto && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50"
          onClick={handleClosePhotoModal}
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
              onClick={handleClosePhotoModal}
              className="absolute -top-6 -right-6 z-10 p-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-200">
              <img
                src={selectedPhoto}
                alt="Full size photo"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
