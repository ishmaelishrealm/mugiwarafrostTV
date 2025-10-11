import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Temporarily disabled API rewrites to prevent delays
    // TODO: Re-enable when backend server is running on localhost:13500
    return [
      // {
      //   source: '/api/video/:path*',
      //   destination: process.env.NODE_ENV === 'production' 
      //     ? 'https://api.mugiwarafrost.com/api/video/:path*'  // Production API
      //     : 'http://localhost:13500/api/video/:path*',        // Development API
      // },
    ];
  },
  
  // Image configuration
  images: {
    // Use remotePatterns (domains is deprecated)
    remotePatterns: [
      { protocol: 'https', hostname: 'vz-a01fffb9-e7a.b-cdn.net' }, // Bunny CDN
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**' },
    ],
    // Avoid Next optimizer hitting remote hosts that block server-side fetch
    unoptimized: true,
  },

  // Enable experimental features
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
