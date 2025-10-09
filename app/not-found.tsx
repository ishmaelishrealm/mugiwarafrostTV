"use client";

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-accent mb-4 animate-pulse">
            404
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-accent to-accent-alt mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-foreground-secondary mb-8 leading-relaxed">
          The page you&apos;re looking for seems to have sailed away with the Straw Hat Pirates. 
          Don&apos;t worry, even Luffy gets lost sometimes!
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <Home size={20} />
            Go Home
          </Link>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 bg-background-secondary hover:bg-background-tertiary text-foreground border border-border font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Search size={18} />
              Browse Anime
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 bg-transparent hover:bg-background-secondary text-foreground-secondary hover:text-foreground border border-border font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-12 p-4 bg-background-secondary/50 rounded-lg border border-accent/20">
          <p className="text-sm text-foreground-muted">
            <span className="text-accent font-semibold">Fun Fact:</span> The Straw Hat Pirates 
            have been sailing for over 20 years and still haven&apos;t found the One Piece!
          </p>
        </div>
      </div>
    </div>
  );
}
