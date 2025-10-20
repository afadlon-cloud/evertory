'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center">
              <HeartIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-light text-gray-900 tracking-tight">Evertory</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 font-medium">
              Sign In
            </Link>
            <Link href="/auth/signup" className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium text-sm uppercase tracking-wide shadow-sm hover:shadow-md transition-all duration-200">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            ✨ Join 10,000+ families sharing their stories
          </motion.div>
          <motion.h1 
            className="text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Turn Your Memories Into
            <span className="block text-blue-600">Beautiful Stories</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Create a stunning personal website in minutes. Upload photos, write your story, and get your own domain like <span className="font-medium text-gray-900">yourname.evertory.com</span>. Perfect for families, couples, and anyone who wants to preserve precious memories.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/auth/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-medium text-sm uppercase tracking-wide shadow-lg hover:shadow-xl transition-all duration-200">
              Create My Story - It's Free
            </Link>
            <Link href="#examples" className="bg-white text-gray-700 px-10 py-4 rounded-full font-medium text-sm uppercase tracking-wide hover:bg-gray-50 border border-gray-200 transition-all duration-200">
              See Examples
            </Link>
          </motion.div>
        </div>
      </section>


      {/* Features Section */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Everything You Need to Tell Your Story
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Simple tools designed for everyone, regardless of technical background.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="p-4 bg-gray-100 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto leading-relaxed">
            Start free, upgrade when you need more. No hidden fees, no surprises.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
              <h3 className="text-xl font-light text-gray-900 mb-3">Free</h3>
              <div className="text-3xl font-light text-gray-900 mb-4">$0<span className="text-sm text-gray-500">/month</span></div>
              <ul className="space-y-2 text-left mb-6">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">20 photos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Timeline template</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Personal domain</span>
                </li>
              </ul>
              <Link href="/auth/signup" className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg font-medium text-xs uppercase tracking-wide hover:bg-gray-800 transition-all duration-200 block text-center">
                Start Free
              </Link>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">Popular</span>
              </div>
              <h3 className="text-xl font-light text-gray-900 mb-3">Basic</h3>
              <div className="text-3xl font-light text-gray-900 mb-4">$5<span className="text-sm text-gray-500">/month</span></div>
              <ul className="space-y-2 text-left mb-6">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">500 photos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">All templates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Cover photos</span>
                </li>
              </ul>
              <Link href="/auth/signup" className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-xs uppercase tracking-wide hover:bg-blue-700 transition-all duration-200 block text-center">
                Get Started
              </Link>
            </div>
            <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
              <h3 className="text-xl font-light text-gray-900 mb-3">Pro</h3>
              <div className="text-3xl font-light text-gray-900 mb-4">$10<span className="text-sm text-gray-500">/month</span></div>
              <ul className="space-y-2 text-left mb-6">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">1,500 photos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">All templates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Cover photos</span>
                </li>
              </ul>
              <Link href="/auth/signup" className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium text-xs uppercase tracking-wide hover:bg-purple-700 transition-all duration-200 block text-center">
                Get Started
              </Link>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200">
              <h3 className="text-xl font-light text-gray-900 mb-3">Premium</h3>
              <div className="text-3xl font-light text-gray-900 mb-4">$20<span className="text-sm text-gray-500">/month</span></div>
              <ul className="space-y-2 text-left mb-6">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">5,000 photos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">All templates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Cover photos</span>
                </li>
              </ul>
              <Link href="/auth/signup" className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium text-xs uppercase tracking-wide hover:bg-yellow-700 transition-all duration-200 block text-center">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="examples" className="px-6 py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Perfect for Every Story
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Whether it's documenting family history or celebrating special moments, 
              Evertory helps you create something meaningful.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img 
                  src={useCase.image} 
                  alt={useCase.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-8">
                  <h3 className="text-xl font-light text-gray-900 mb-4">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
            Your Story Deserves to Be Told
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Don't let precious memories fade away. Create a beautiful website that will last forever and bring your family together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center bg-white rounded-2xl p-2 max-w-md w-full shadow-xl">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 outline-none text-gray-900"
              />
              <Link 
                href={`/auth/signup${email ? `?email=${email}` : ''}`}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium text-sm uppercase tracking-wide"
              >
                Start Free
              </Link>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center space-x-8 text-blue-100">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium">Free to start</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium">No credit card</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium">Ready in 5 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                <HeartIcon className="h-5 w-5 text-gray-900" />
              </div>
              <span className="text-xl font-light text-white tracking-tight">Evertory</span>
            </div>
            <div className="flex items-center space-x-8 text-gray-400">
              <Link href="/privacy" className="hover:text-white font-medium">Privacy</Link>
              <Link href="/terms" className="hover:text-white font-medium">Terms</Link>
              <Link href="/support" className="hover:text-white font-medium">Support</Link>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p className="font-medium">&copy; 2024 Evertory. Made with ❤️ for preserving precious memories.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
