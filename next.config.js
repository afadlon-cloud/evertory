/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
  },
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'build-time-secret',
  },
  async rewrites() {
    return [
      {
        source: '/api/sites/:domain*',
        destination: '/api/sites/:domain*',
      },
    ];
  },
};

module.exports = nextConfig;