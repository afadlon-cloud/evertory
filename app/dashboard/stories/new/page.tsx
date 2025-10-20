'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { getTierInfo, canUseTemplate } from '@/lib/tiers';

export default function NewStoryPage() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    template: 'timeline'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userTier, setUserTier] = useState('free');
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Story created:', data); // Debug log
        router.push(`/dashboard/stories/${data.story.id}`);
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData); // Debug log
        setError(errorData.error || 'Failed to create story');
      }
    } catch (error) {
      console.error('Catch Error:', error); // Debug log
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-16">
        <Link 
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8 font-medium uppercase tracking-wide"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-3" />
          Back to Dashboard
        </Link>
        <h1 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
          Create New Story
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
          Start documenting your beautiful memories and experiences
        </p>
      </div>

      {/* Form */}
      <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-6 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
              Story Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all duration-200 text-lg"
              placeholder="e.g., Our Family Journey, My Travel Adventures"
              required
            />
          </div>

          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
              Subtitle
            </label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all duration-200 text-lg"
              placeholder="A brief description of your story"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all duration-200 text-lg resize-none"
              placeholder="Tell people what this story is about..."
            />
          </div>

          <div>
            <label htmlFor="template" className="block text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
              Template
            </label>
            <div className="space-y-3">
              {/* Timeline Template */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="timeline"
                    name="template"
                    value="timeline"
                    checked={formData.template === 'timeline'}
                    onChange={handleChange}
                    className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-500"
                  />
                  <label htmlFor="timeline" className="text-lg font-medium text-gray-900">
                    Timeline
                  </label>
                </div>
                <span className="text-sm text-green-600 font-medium">Available</span>
              </div>

              {/* Gallery Template */}
              <div className={`flex items-center justify-between p-4 border rounded-xl ${
                !canUseTemplate(userTier, 'gallery')
                  ? 'border-gray-200 bg-gray-50' 
                  : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="gallery"
                    name="template"
                    value="gallery"
                    checked={formData.template === 'gallery'}
                    onChange={handleChange}
                    disabled={!canUseTemplate(userTier, 'gallery')}
                    className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-500 disabled:opacity-50"
                  />
                  <label htmlFor="gallery" className={`text-lg font-medium ${
                    !canUseTemplate(userTier, 'gallery') ? 'text-gray-500' : 'text-gray-900'
                  }`}>
                    Gallery
                  </label>
                  {!canUseTemplate(userTier, 'gallery') && (
                    <LockClosedIcon className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                {!canUseTemplate(userTier, 'gallery') ? (
                  <span className="text-sm text-gray-500 font-medium">Basic+</span>
                ) : (
                  <span className="text-sm text-green-600 font-medium">Available</span>
                )}
              </div>

              {/* Blog Template */}
              <div className={`flex items-center justify-between p-4 border rounded-xl ${
                !canUseTemplate(userTier, 'blog')
                  ? 'border-gray-200 bg-gray-50' 
                  : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="blog"
                    name="template"
                    value="blog"
                    checked={formData.template === 'blog'}
                    onChange={handleChange}
                    disabled={!canUseTemplate(userTier, 'blog')}
                    className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-500 disabled:opacity-50"
                  />
                  <label htmlFor="blog" className={`text-lg font-medium ${
                    !canUseTemplate(userTier, 'blog') ? 'text-gray-500' : 'text-gray-900'
                  }`}>
                    Blog
                  </label>
                  {!canUseTemplate(userTier, 'blog') && (
                    <LockClosedIcon className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                {!canUseTemplate(userTier, 'blog') ? (
                  <span className="text-sm text-gray-500 font-medium">Basic+</span>
                ) : (
                  <span className="text-sm text-green-600 font-medium">Available</span>
                )}
              </div>
            </div>
            
            {!canUseTemplate(userTier, 'gallery') && !canUseTemplate(userTier, 'blog') && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-700">
                  <strong>Upgrade to Basic</strong> to unlock Gallery and Blog templates, plus 500 photos!
                </p>
                <Link 
                  href="/dashboard/settings"
                  className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Plans →
                </Link>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mt-3 font-medium">
              You can change this later
            </p>
          </div>

          <div className="flex items-center justify-between pt-8">
            <Link
              href="/dashboard"
              className="bg-gray-100 text-gray-700 px-8 py-4 rounded-full font-medium text-sm uppercase tracking-wide hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading || !formData.title.trim()}
              className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-4 rounded-full font-medium text-sm uppercase tracking-wide shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}