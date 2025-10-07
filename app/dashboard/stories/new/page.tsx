'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  PhotoIcon,
  CalendarDaysIcon,
  ViewColumnsIcon
} from '@heroicons/react/24/outline';

export default function NewStoryPage() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    template: 'timeline',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const templates = [
    {
      id: 'timeline',
      name: 'Timeline',
      description: 'Perfect for chronological stories, life events, and family history',
      icon: CalendarDaysIcon,
      preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
    },
    {
      id: 'gallery',
      name: 'Gallery',
      description: 'Beautiful photo-focused layout for visual storytelling',
      icon: PhotoIcon,
      preview: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400&h=250&fit=crop',
    },
    {
      id: 'chapters',
      name: 'Chapters',
      description: 'Organized sections for complex stories and memoirs',
      icon: DocumentTextIcon,
      preview: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop',
    },
    {
      id: 'masonry',
      name: 'Masonry',
      description: 'Dynamic grid layout that adapts to your content',
      icon: ViewColumnsIcon,
      preview: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop',
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTemplateSelect = (templateId: string) => {
    setFormData(prev => ({
      ...prev,
      template: templateId
    }));
  };

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
        const story = await response.json();
        router.push(`/dashboard/stories/${story.id}`);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create story');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link 
            href="/dashboard" 
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-neutral-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 font-serif">
              Create Your Story
            </h1>
            <p className="text-neutral-600 mt-1">
              Start documenting your memories and sharing your journey
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-neutral-800 mb-6 font-serif">
            Basic Information
          </h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
                Story Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="e.g., The Johnson Family Story, Our Wedding Journey, Emma's First Year"
                required
              />
              <p className="text-xs text-neutral-500 mt-1">
                This will be the main title of your story website
              </p>
            </div>

            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium text-neutral-700 mb-2">
                Subtitle (optional)
              </label>
              <input
                id="subtitle"
                name="subtitle"
                type="text"
                value={formData.subtitle}
                onChange={handleChange}
                className="input"
                placeholder="A brief description or tagline"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                Description (optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="textarea"
                placeholder="Describe what this story is about and what visitors can expect to find..."
              />
            </div>
          </div>
        </div>

        {/* Template Selection */}
        <div className="card">
          <h2 className="text-xl font-semibold text-neutral-800 mb-6 font-serif">
            Choose a Template
          </h2>
          <p className="text-neutral-600 mb-6">
            Select a layout that best fits your story. You can change this later.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {templates.map((template) => (
              <motion.div
                key={template.id}
                className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                  formData.template === template.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
                onClick={() => handleTemplateSelect(template.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-1">
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                </div>
                <div className="p-4 pt-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <template.icon className="h-5 w-5 text-primary-500" />
                    <h3 className="font-semibold text-neutral-800">{template.name}</h3>
                  </div>
                  <p className="text-sm text-neutral-600">{template.description}</p>
                </div>
                
                {formData.template === template.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
          <Link 
            href="/dashboard" 
            className="btn-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading || !formData.title}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Story...' : 'Create Story'}
          </button>
        </div>
      </form>
    </div>
  );
}
