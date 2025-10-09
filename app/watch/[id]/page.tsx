"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Play, Info, Calendar } from "lucide-react";

interface Episode {
  id: string;
  title: string;
  episodeNumber: number | null;
  playbackUrl: string;
  thumbnail: string | null;
  animeId: string;
  createdAt: string;
  anime: {
    id: string;
    title: string;
    description: string | null;
    bannerImage: string | null;
  };
}

export default function WatchPage() {
  const { id } = useParams();
  const router = useRouter();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchEpisode = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/episodes/${id}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            setError("Episode not found");
          } else {
            setError("Failed to load episode");
          }
          return;
        }
        
        const data = await res.json();
        setEpisode(data);
      } catch (err) {
        console.error("Error fetching episode:", err);
        setError("Failed to load episode");
      } finally {
        setLoading(false);
      }
    };
    
    fetchEpisode();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-foreground-secondary">Loading episode...</p>
        </div>
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-accent">Episode Not Found</h1>
            <p className="text-foreground-secondary mb-8">
              {error || "The episode you're looking for doesn't exist."}
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/"
                className="bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Home
              </Link>
              <Link
                href="/browse"
                className="bg-background-secondary hover:bg-background-tertiary text-foreground font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Browse Anime
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-background-secondary/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-foreground-secondary hover:text-accent transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <div className="h-6 w-px bg-border"></div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">{episode.anime.title}</h1>
                <p className="text-sm text-foreground-secondary">
                  {episode.episodeNumber ? `Episode ${episode.episodeNumber}` : 'Episode'} - {episode.title}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href={`/anime/${episode.anime.id}`}
                className="flex items-center gap-2 bg-background hover:bg-background-tertiary text-foreground font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <Info className="w-4 h-4" />
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Video Container */}
          <div className="aspect-video bg-background-secondary rounded-lg overflow-hidden mb-6">
            {episode.playbackUrl ? (
              <iframe
                src={episode.playbackUrl}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture"
                title={`${episode.anime.title} - ${episode.title}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-foreground-muted mx-auto mb-4" />
                  <p className="text-foreground-secondary">Video not available</p>
                </div>
              </div>
            )}
          </div>

          {/* Episode Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {episode.anime.title}
              </h2>
              
              <div className="flex items-center gap-6 mb-4 text-sm text-foreground-secondary">
                {episode.episodeNumber && (
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Episode {episode.episodeNumber}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(episode.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="bg-background-secondary/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {episode.title}
                </h3>
                {episode.anime.description && (
                  <p className="text-foreground-secondary leading-relaxed">
                    {episode.anime.description}
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Anime Poster */}
              {episode.anime.bannerImage && (
                <div className="bg-background-secondary/50 rounded-lg overflow-hidden">
                  <Image
                    src={episode.anime.bannerImage}
                    alt={episode.anime.title}
                    width={300}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-background-secondary/50 rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <Link
                    href={`/anime/${episode.anime.id}`}
                    className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Info className="w-4 h-4" />
                    View All Episodes
                  </Link>
                  <Link
                    href="/browse"
                    className="w-full bg-background hover:bg-background-tertiary text-foreground font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    Browse More Anime
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}