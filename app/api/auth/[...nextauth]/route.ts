import NextAuth from 'next-auth';

// Simple build-safe configuration
let authOptions;

try {
  // Only import runtime config if we're actually running (not building)
  if (process.env.NODE_ENV !== 'production' || process.env.DATABASE_URL) {
    const { runtimeAuthOptions } = require('@/lib/auth-runtime');
    authOptions = runtimeAuthOptions;
  } else {
    throw new Error('Use fallback config');
  }
} catch (error) {
  // Fallback configuration for build time
  authOptions = {
    secret: process.env.NEXTAUTH_SECRET || 'build-fallback-secret',
    providers: [],
    session: {
      strategy: 'jwt' as const
    },
    pages: {
      signIn: '/auth/signin',
    },
  };
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };