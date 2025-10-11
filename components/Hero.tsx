"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Info } from "lucide-react";

interface HeroAnime {
  title: string;
  description?: string;
  playbackUrl: string;
  thumbnail?: string;
  animeId: string;
  episodeId: string;
}

export default function Hero() {
  const [anime, setAnime] = useState<HeroAnime | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch("/api/featured");
        if (response.ok) {
          const data = await response.json();
          setAnime(data);
        }
      } catch (error) {
        console.error("Failed to fetch featured anime:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="relative h-[80vh] bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-foreground-secondary">Loading featured anime...</p>
        </div>
      </section>
    );
  }

  if (!anime) {
    return (
      <section className="relative h-[80vh] bg-gradient-to-br from-background-secondary to-background text-white flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">
            MugiwaraFrostTV
          </h1>
          <p className="text-xl text-foreground-secondary mb-8">
            Your premium anime streaming platform is ready. Upload your first anime to get started!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Play size={20} />
              Upload Anime
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 bg-background-secondary hover:bg-background-tertiary text-foreground border border-border font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Info size={20} />
              Browse
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[80vh] bg-black text-white overflow-hidden">
      {/* Background Video/Thumbnail */}
      <div className="absolute inset-0">
        {anime.thumbnail ? (
          <Image
            src={anime.thumbnail}
            alt={anime.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent-alt/20"></div>
        )}
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end">
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              {anime.title}
            </h1>
            
            {anime.description && (
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {anime.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="hero-buttons">
              <Link
                href={`/watch/${anime.episodeId}`}
                className="btn btn-primary"
              >
                <Play size={20} fill="currentColor" />
                Play
              </Link>
              
              <Link
                href={`/anime/${anime.animeId}`}
                className="btn btn-secondary"
              >
                <Info size={20} />
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
}


