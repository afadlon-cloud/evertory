'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NewStoryPage() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    template: 'timeline'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
        router.push(`/dashboard/stories/${data.story.id}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create story');
      }
    } catch (error) {
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard"
          className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-800 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-neutral-800 font-serif">
          Create New Story
        </h1>
        <p className="text-neutral-600 mt-2">
          Start documenting your memories and experiences
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
              Story Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Our Family Journey, My Travel Adventures"
              required
            />
          </div>

          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium text-neutral-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="input"
              placeholder="A brief description of your story"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input"
              placeholder="Tell people what this story is about..."
            />
          </div>

          <div>
            <label htmlFor="template" className="block text-sm font-medium text-neutral-700 mb-2">
              Template
            </label>
            <select
              id="template"
              name="template"
              value={formData.template}
              onChange={handleChange}
              className="input"
            >
              <option value="timeline">Timeline</option>
              <option value="gallery">Gallery</option>
              <option value="blog">Blog</option>
            </select>
            <p className="text-xs text-neutral-500 mt-1">
              You can change this later
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Link
              href="/dashboard"
              className="btn-secondary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading || !formData.title.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}