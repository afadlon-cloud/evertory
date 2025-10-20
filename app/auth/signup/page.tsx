'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { HeartIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

function SignUpForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferredDomain: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [domainStatus, setDomainStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({ checking: false, available: null, message: '' });
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledEmail = searchParams.get('email') || '';

  // Set prefilled email on component mount
  useState(() => {
    if (prefilledEmail) {
      setFormData(prev => ({ ...prev, email: prefilledEmail }));
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check domain availability when user types in domain field
    if (name === 'preferredDomain') {
      checkDomainAvailability(value);
    }
  };

  const checkDomainAvailability = async (domainName: string) => {
    if (!domainName.trim()) {
      setDomainStatus({ checking: false, available: null, message: '' });
      return;
    }

    setDomainStatus({ checking: true, available: null, message: 'Checking availability...' });

    try {
      const response = await fetch('/api/check-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainName: domainName.trim() }),
      });

      const data = await response.json();

      if (data.available) {
        setDomainStatus({
          checking: false,
          available: true,
          message: `✅ ${data.domain} is available!`,
        });
      } else {
        setDomainStatus({
          checking: false,
          available: false,
          message: `❌ ${data.domain} is already taken`,
        });
      }
    } catch (error) {
      setDomainStatus({
        checking: false,
        available: null,
        message: 'Error checking availability',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          preferredDomain: formData.preferredDomain,
        }),
      });

      if (response.ok) {
        router.push('/auth/signin?message=Account created successfully');
      } else {
        const data = await response.json();
        setError(data.error || 'An error occurred during registration');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
              <HeartIcon className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-light text-gray-900 tracking-tight">Evertory</span>
          </Link>
          <h1 className="mt-8 text-4xl font-light text-gray-900 tracking-tight">
            Start Your Story
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Create an account to begin building your personal website
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all duration-200 text-lg"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all duration-200 text-lg"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="preferredDomain" className="block text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                Choose Your Website Domain
              </label>
              <div className="relative">
                <input
                  id="preferredDomain"
                  name="preferredDomain"
                  type="text"
                  value={formData.preferredDomain}
                  onChange={handleChange}
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all duration-200 text-lg pr-32"
                  placeholder="my-family-story"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                  <span className="text-sm text-gray-500 font-medium">.evertory.com</span>
                </div>
              </div>
              {domainStatus.message && (
                <p className={`text-sm mt-2 font-medium ${
                  domainStatus.available === true 
                    ? 'text-green-600' 
                    : domainStatus.available === false 
                    ? 'text-red-600' 
                    : 'text-gray-500'
                }`}>
                  {domainStatus.message}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-3 font-medium">
                This will be your personal website URL where all your stories will live
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all duration-200 text-lg pr-12"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-6 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500 font-medium">
                Must be at least 6 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all duration-200 text-lg pr-12"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-6 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500"
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                  <strong className="text-blue-800">I understand that Evertory creates public websites and agree that:</strong>
                  <ul className="mt-2 space-y-1 text-xs text-gray-600">
                    <li>• My website will be publicly accessible to share with family and friends</li>
                    <li>• I will only upload content I'm comfortable sharing publicly</li>
                    <li>• I have read and agree to the <Link href="/terms" className="text-gray-900 underline hover:text-gray-700">Terms of Service</Link> and <Link href="/privacy" className="text-gray-900 underline hover:text-gray-700">Privacy Policy</Link></li>
                  </ul>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium text-sm uppercase tracking-wide shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-gray-900 hover:text-gray-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 font-medium">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-gray-900 hover:text-gray-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-gray-900 hover:text-gray-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div></div>}>
      <SignUpForm />
    </Suspense>
  );
}
