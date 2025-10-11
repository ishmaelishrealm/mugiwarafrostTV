"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Show {
  id: string;
  title: string;
  coverUrl: string;
  rating: number;
  year: number;
  genres: string[];
}

interface FeaturedCarouselProps {
  title: string;
  shows: Show[];
}

export default function FeaturedCarousel({ title, shows }: FeaturedCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Handle empty state
  if (!shows || shows.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
        <div className="flex items-center justify-center py-12 bg-background-secondary/30 rounded-xl border border-border/50">
          <div className="text-center">
            <p className="text-foreground-secondary text-lg mb-2">No anime available yet</p>
            <p className="text-foreground-muted text-sm">Check back soon for new content!</p>
          </div>
        </div>
      </div>
    );
  }

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`carousel-${title.toLowerCase().replace(/\s+/g, '-')}`);
    if (container) {
      const scrollAmount = 400;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="carousel-row">
      <div className="flex items-center justify-between mb-4">
        <h2 className="carousel-title">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 bg-background-tertiary hover:bg-accent hover:text-background rounded-full transition-colors"
            disabled={scrollPosition === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 bg-background-tertiary hover:bg-accent hover:text-background rounded-full transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div 
        id={`carousel-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="carousel-content"
      >
                {shows.map((show) => (
                  <Link key={show.id} href={`/anime/${show.id}`}>
            <div className="show-card group">
              <div className="aspect-[2/3] bg-background-secondary rounded-lg overflow-hidden">
                {show.coverUrl ? (
                  <Image
                    src={show.coverUrl}
                    alt={show.title}
                    width={300}
                    height={450}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent/20 to-green/20 flex items-center justify-center">
                    <span className="text-foreground-muted text-sm">{show.title}</span>
                  </div>
                )}
              </div>
              
              <div className="show-card-overlay">
                <h3 className="show-card-title">{show.title}</h3>
                <div className="flex items-center justify-between text-xs text-foreground-secondary mt-1">
                  <span>{show.year}</span>
                  <span className="text-green">★ {show.rating}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
