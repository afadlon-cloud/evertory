'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  PhotoIcon, 
  DocumentTextIcon, 
  GlobeAltIcon,
  ShareIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: PhotoIcon,
      title: 'Upload & Organize',
      description: 'Easily upload photos and videos, organize them into meaningful chapters of your life story.'
    },
    {
      icon: DocumentTextIcon,
      title: 'Write Your Story',
      description: 'Add rich text, dates, and context to create a narrative that brings your memories to life.'
    },
    {
      icon: SparklesIcon,
      title: 'Beautiful Templates',
      description: 'Choose from elegant, timeless templates designed to showcase your story beautifully.'
    },
    {
      icon: GlobeAltIcon,
      title: 'Personal Domain',
      description: 'Get a unique, memorable domain like www.the-johnsons-story.com for your family website.'
    },
    {
      icon: ShareIcon,
      title: 'Easy Sharing',
      description: 'Share your story with family and friends, with privacy controls and guest messaging.'
    },
    {
      icon: HeartIcon,
      title: 'Built to Last',
      description: 'Create something timeless that your family will treasure and share for generations.'
    }
  ];

  const useCases = [
    {
      title: 'Family History',
      description: 'Document your family\'s journey, traditions, and milestones in one beautiful place.',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop'
    },
    {
      title: 'Wedding Memories',
      description: 'Create a stunning digital wedding album to share your special day with loved ones.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop'
    },
    {
      title: 'Child\'s Growth',
      description: 'Chronicle your child\'s milestones, first steps, and precious moments as they grow.',
      image: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=300&fit=crop'
    },
    {
      title: 'Memorial Tribute',
      description: 'Honor a loved one\'s memory with a beautiful tribute site celebrating their life.',
      image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HeartIcon className="h-8 w-8 text-primary-500" />
            <span className="text-2xl font-bold text-neutral-800">Evertory</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin" className="text-neutral-600 hover:text-neutral-800">
              Sign In
            </Link>
            <Link href="/auth/signup" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-neutral-800 mb-6 font-serif"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Tell Your Story,
            <span className="text-primary-500 block">Share Your Legacy</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Create beautiful personal websites to document your family history, share precious memories, 
            and build something timeless that will be treasured for generations.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/auth/signup" className="btn-primary text-lg px-8 py-3">
              Start Your Story
            </Link>
            <Link href="#examples" className="btn-secondary text-lg px-8 py-3">
              See Examples
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4 font-serif">
              Everything You Need to Tell Your Story
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Simple tools designed for everyone, regardless of technical background.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card hover:shadow-md transition-shadow duration-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <feature.icon className="h-12 w-12 text-primary-500 mb-4" />
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="examples" className="px-6 py-20 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4 font-serif">
              Perfect for Every Story
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Whether it's documenting family history or celebrating special moments, 
              Evertory helps you create something meaningful.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                className="card hover:shadow-md transition-shadow duration-200 overflow-hidden p-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img 
                  src={useCase.image} 
                  alt={useCase.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-primary-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">
            Ready to Start Your Story?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of families who are already preserving their memories 
            and sharing their stories with Evertory.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center bg-white rounded-lg p-1 max-w-md w-full">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 outline-none"
              />
              <Link 
                href={`/auth/signup${email ? `?email=${email}` : ''}`}
                className="bg-primary-500 text-white px-6 py-2 rounded-md hover:bg-primary-600 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
          <p className="text-primary-200 text-sm mt-4">
            No credit card required. Start building your story today.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-neutral-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <HeartIcon className="h-6 w-6 text-primary-400" />
              <span className="text-xl font-bold text-white">Evertory</span>
            </div>
            <div className="flex items-center space-x-6 text-neutral-400">
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/support" className="hover:text-white">Support</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-neutral-700 text-center text-neutral-400">
            <p>&copy; 2024 Evertory. Made with ❤️ for preserving precious memories.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
