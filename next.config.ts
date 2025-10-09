import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/video/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://api.mugiwarafrost.com/api/video/:path*'  // Production API
          : 'http://localhost:13500/api/video/:path*',        // Development API
      },
    ];
  },
  
  // Optimize images
  images: {
    domains: [
      'images.unsplash.com',
      'vz-a01fffb9-e7a.b-cdn.net', // Bunny CDN domain
      'mugiwarafrost.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
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
