"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Play, Calendar, Users, Star } from "lucide-react";
import Image from "next/image";

interface Anime {
  id: string;
  title: string;
  description: string | null;
  bannerImage: string | null;
  featured: boolean;
  createdAt: string;
  episodes: Array<{
    id: string;
    title: string;
    episodeNumber: number | null;
    thumbnail: string | null;
    createdAt: string;
  }>;
}

export default function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchAnime = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/anime/${id}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            setError("Anime not found");
          } else {
            setError("Failed to load anime");
          }
          return;
        }
        
        const data = await res.json();
        setAnime(data);

        // Auto-redirect to first episode if only one episode exists
        if (data.episodes?.length === 1) {
          redirect(`/watch/${data.episodes[0].id}`);
        }
      } catch (err) {
        console.error("Error fetching anime:", err);
        setError("Failed to load anime");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnime();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-foreground-secondary">Loading anime...</p>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-accent">Anime Not Found</h1>
            <p className="text-foreground-secondary mb-8">
              {error || "The anime you're looking for doesn't exist."}
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

  const sortedEpisodes = [...anime.episodes].sort((a, b) => {
    if (a.episodeNumber && b.episodeNumber) {
      return a.episodeNumber - b.episodeNumber;
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const firstEpisode = sortedEpisodes[0];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        {anime.bannerImage ? (
          <Image
            src={anime.bannerImage}
            alt={anime.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent-alt/20"></div>
        )}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/"
            className="flex items-center gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              {anime.title}
            </h1>
            
            <div className="flex items-center gap-6 mb-6 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(anime.createdAt).getFullYear()}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {anime.episodes.length} Episodes
              </div>
              {anime.featured && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="bg-accent text-black px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                </div>
              )}
            </div>

            {anime.description && (
              <p className="text-white/90 text-lg max-w-3xl leading-relaxed mb-6">
                {anime.description}
              </p>
            )}

            {/* Play Button */}
            {firstEpisode && (
              <Link
                href={`/watch/${firstEpisode.id}`}
                className="inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-black font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                <Play className="w-6 h-6 fill-current" />
                Watch Now
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">Episodes</h2>
            {anime.episodes.length > 0 && (
              <p className="text-foreground-secondary">
                {anime.episodes.length} episode{anime.episodes.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          {sortedEpisodes.length === 0 ? (
            <div className="text-center py-12">
              <Play className="w-16 h-16 text-foreground-muted mx-auto mb-4" />
              <p className="text-foreground-secondary text-lg">No episodes available yet</p>
              <p className="text-foreground-muted text-sm mt-2">
                Check back soon for new episodes!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedEpisodes.map((episode, index) => (
                <Link
                  key={episode.id}
                  href={`/watch/${episode.id}`}
                  className="group bg-background-secondary hover:bg-background-tertiary rounded-lg overflow-hidden transition-colors"
                >
                  <div className="aspect-video bg-background-tertiary relative">
                    {episode.thumbnail ? (
                      <Image
                        src={episode.thumbnail}
                        alt={episode.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-12 h-12 text-foreground-muted" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                      {episode.episodeNumber ? `Ep ${episode.episodeNumber}` : `Ep ${index + 1}`}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Play className="w-8 h-8 text-white fill-current" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {episode.title}
                    </h3>
                    <p className="text-sm text-foreground-secondary">
                      {new Date(episode.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

