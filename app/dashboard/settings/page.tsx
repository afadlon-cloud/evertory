'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  UserIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  PhotoIcon,
  ArrowRightIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { getTierInfo, getPhotoUsagePercentage, shouldShowUpgradePrompt, getNextTier, TIERS } from '@/lib/tiers';

interface User {
  id: string;
  name: string;
  email: string;
  domain?: string;
  tier: string;
  photoCount: number;
  photoLimit: number;
  createdAt: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // First, update the photo count
        await fetch('/api/user/photo-count');
        
        // Then fetch the user data
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
          Settings
        </h1>
        <p className="text-lg text-gray-600">
          Manage your account, subscription, and preferences
        </p>
      </div>

      <div className="space-y-8">
        {/* Account Information */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-gray-600" />
            </div>
            <h2 className="text-2xl font-light text-gray-900">Account Information</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={user?.name || ''}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
              <input
                type="text"
                value={user?.domain || 'Not set'}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
              <input
                type="text"
                value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Subscription & Billing */}
        {user && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <CreditCardIcon className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-light text-gray-900">Subscription & Billing</h2>
            </div>

            {/* Current Plan */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900">Current Plan</h3>
                  <p className="text-gray-600">Your current subscription details</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-light text-gray-900">
                    ${getTierInfo(user.tier).price}
                    <span className="text-lg text-gray-500">/month</span>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {getTierInfo(user.tier).name} Plan
                  </span>
                </div>
              </div>

              {/* Photo Usage */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                  <span>Photo Storage</span>
                  <div className="flex items-center space-x-2">
                    <span>{user.photoCount} of {user.photoLimit} photos used</span>
                    <button
                      onClick={async () => {
                        try {
                          await fetch('/api/user/photo-count');
                          const response = await fetch('/api/user');
                          if (response.ok) {
                            const userData = await response.json();
                            setUser(userData);
                          }
                        } catch (error) {
                          console.error('Error refreshing photo count:', error);
                        }
                      }}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      getPhotoUsagePercentage(user.tier, user.photoCount) >= 90 
                        ? 'bg-red-500' 
                        : getPhotoUsagePercentage(user.tier, user.photoCount) >= 80 
                        ? 'bg-yellow-500' 
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, getPhotoUsagePercentage(user.tier, user.photoCount))}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {Math.round(getPhotoUsagePercentage(user.tier, user.photoCount))}% of your storage used
                </p>
              </div>

              {/* Upgrade Prompt */}
              {shouldShowUpgradePrompt(user.tier, user.photoCount) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">!</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                        Running low on photo storage
                      </h4>
                      <p className="text-yellow-700 mb-4">
                        You've used {Math.round(getPhotoUsagePercentage(user.tier, user.photoCount))}% of your photo limit. 
                        Consider upgrading to continue adding photos to your stories.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Plan Features */}
              <div className="grid md:grid-cols-2 gap-4">
                {getTierInfo(user.tier).features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Plans */}
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-6">Available Plans</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(TIERS).map(([tierKey, tierInfo]) => (
                  <div 
                    key={tierKey}
                    className={`relative rounded-2xl border-2 p-8 flex flex-col h-full ${
                      user.tier === tierKey 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Badges */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      {user.tier === tierKey ? (
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg whitespace-nowrap">
                          Current Plan
                        </span>
                      ) : tierInfo.popular ? (
                        <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg whitespace-nowrap">
                          Most Popular
                        </span>
                      ) : null}
                    </div>
                    
                    <div className="text-center pt-2 flex flex-col h-full">
                      <h4 className="text-xl font-semibold text-gray-900 mb-3">{tierInfo.name}</h4>
                      <div className="text-4xl font-light text-gray-900 mb-6">
                        ${tierInfo.price}
                        <span className="text-lg text-gray-500">/month</span>
                      </div>
                      <ul className="space-y-3 text-sm text-gray-600 mb-8 text-left flex-grow">
                        {tierInfo.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto">
                        {user.tier === tierKey ? (
                          <button 
                            disabled
                            className="w-full bg-gray-100 text-gray-500 px-6 py-3 rounded-xl font-medium cursor-not-allowed"
                          >
                            Current Plan
                          </button>
                        ) : (
                          <button className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                            {tierInfo.price === 0 ? 'Downgrade' : 'Upgrade'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Privacy & Security */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <ShieldCheckIcon className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-light text-gray-900">Privacy & Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-medium text-gray-900">Public Website</h3>
                <p className="text-sm text-gray-600">Your website is publicly accessible</p>
              </div>
              <div className="flex items-center space-x-2">
                <GlobeAltIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-700">Public</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-medium text-gray-900">HTTPS Encryption</h3>
                <p className="text-sm text-gray-600">All data transmission is encrypted via HTTPS/TLS</p>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-700">Enabled</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-medium text-gray-900">Database Security</h3>
                <p className="text-sm text-gray-600">Data stored in secure PostgreSQL database</p>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-700">Secure</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-medium text-gray-900">Cloud Storage</h3>
                <p className="text-sm text-gray-600">Images stored securely with Cloudinary</p>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-700">Protected</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Security Details</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• All connections use HTTPS/TLS encryption</li>
              <li>• Database connections are encrypted</li>
              <li>• Images are stored with Cloudinary's security measures</li>
              <li>• Passwords are hashed using NextAuth.js security</li>
              <li>• No sensitive data is stored in plain text</li>
            </ul>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <BellIcon className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-light text-gray-900">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-600">Receive updates about your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Storage Alerts</h3>
                <p className="text-sm text-gray-600">Get notified when approaching storage limits</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
