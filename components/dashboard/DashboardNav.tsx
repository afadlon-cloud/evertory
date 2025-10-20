'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HeartIcon, 
  PlusIcon,
  HomeIcon,
  DocumentTextIcon,
  PhotoIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export function DashboardNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'My Stories', href: '/dashboard/stories', icon: DocumentTextIcon },
    { name: 'Gallery', href: '/dashboard/gallery', icon: PhotoIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between h-20">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-12">
            <Link href="/dashboard" className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-light text-gray-900 tracking-tight">Evertory</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Actions and User Menu */}
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard/stories/new"
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium text-sm uppercase tracking-wide shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-3"
            >
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">New Story</span>
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-50 transition-all duration-200"
              >
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || ''}
                    className="h-8 w-8 rounded-full border-2 border-gray-200"
                  />
                ) : (
                  <div className="h-8 w-8 bg-gray-900 rounded-full flex items-center justify-center">
                    <UserCircleIcon className="h-5 w-5 text-white" />
                  </div>
                )}
                <span className="hidden md:inline text-sm font-medium text-gray-900">
                  {session?.user?.name}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session?.user?.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard/settings"
                    className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <Cog6ToothIcon className="h-4 w-4" />
                      <span>Settings</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setShowUserMenu(false);
                    }}
                    className="block w-full text-left px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      <span>Sign Out</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden border-t border-[#D9D9D9] bg-white">
        <div className="px-4 py-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive(item.href)
                  ? 'bg-[#3C6E71] text-white shadow-md'
                  : 'text-[#3C6E71] hover:bg-[#D9D9D9] hover:text-[#353535]'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
