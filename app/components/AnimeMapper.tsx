'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type Episode = {
  id: string;
  title: string;
  src: string;
  file: string;
  duration?: string;
  description?: string;
  episodeNumber: number;
};

type Anime = {
  folder: string;
  title: string;
  description: string;
  year: number;
  genre: string[];
  thumbnail: string | undefined;
  episodes: Episode[];
};

export default function AnimeMapper() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [heroTitle, setHeroTitle] = useState('Welcome to Ishanime');
  const [heroDesc, setHeroDesc] = useState('Select an anime episode to start watching');
  const [activeEpId, setActiveEpId] = useState<string | null>(null);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Mock data - no backend dependency
    const mockAnimes = [
      {
        folder: "HeroWithoutClass",
        title: "Hero Without a Class Who Even Needs Skills",
        description: "A hero without class abilities must prove his worth through pure skill and determination in this epic fantasy adventure.",
        year: 2024,
        genre: ["Action", "Adventure", "Fantasy", "Isekai"],
        thumbnail: "/anime-assets/HeroWithoutaClassWhoEvenNeedsSkills.jpg",
        episodes: [
          {
            id: "ep1",
            title: "Episode 1: The Beginning",
            src: "/anime-assets/HeroWithoutClass/ep1.mp4",
            file: "ep1.mp4",
            duration: "24:30",
            description: "The hero begins his journey without any class abilities.",
            episodeNumber: 1
          },
          {
            id: "ep2", 
            title: "Episode 2: First Challenge",
            src: "/anime-assets/HeroWithoutClass/ep2.mp4",
            file: "ep2.mp4",
            duration: "23:45",
            description: "Facing the first real test of his abilities.",
            episodeNumber: 2
          }
        ]
      }
    ];
    
    setAnimes(mockAnimes);
    setLoading(false);
  }, []);

  function playEpisode(anime: Anime, ep: Episode) {
    const vid = heroVideoRef.current;
    if (!vid) return;
    
    // Only change src when different
    const fullUrl = window.location.origin + ep.src;
    if (vid.src !== fullUrl) {
      vid.src = ep.src;
      vid.load();
    }
    
    vid.play().catch(() => {});
    setHeroTitle(`${anime.title} — ${ep.title}`);
    setHeroDesc(ep.description || anime.description);
    setActiveEpId(ep.id);
    setSelectedAnime(anime);
    setSelectedEpisode(ep);
    
    // Scroll hero into view on small screens
    if (window.innerWidth < 800) {
      setTimeout(() => {
        vid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }

  // Video event handlers
  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };
  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setDuration(e.currentTarget.duration);
  };

  // Format time helper
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-sm text-gray-300">
        <div className="animate-pulse">Loading anime library…</div>
      </div>
    );
  }

  if (animes.length === 0) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-400 mb-2">No Anime Found</h3>
        <p className="text-sm text-gray-500">
          Make sure your anime folders are organized in /public/anime-assets/
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Interactive Hero Video Player */}
      <div className="bg-gradient-to-r from-black/50 to-transparent rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="relative w-full lg:w-[640px]">
            <video
              ref={heroVideoRef}
              id="heroVideo"
              controls
              playsInline
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full rounded-xl shadow-2xl bg-black aspect-video"
              poster="/placeholder-video.png"
            />
            
            {/* Custom video overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  <span className="text-gray-300">{isPlaying ? 'Playing' : 'Paused'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-bold gradient-text mb-2">{heroTitle}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                {selectedAnime && (
                  <>
                    <span>{selectedAnime.year}</span>
                    <span>•</span>
                    <span>{selectedAnime.genre.join(', ')}</span>
                    {selectedEpisode?.duration && (
                      <>
                        <span>•</span>
                        <span>{selectedEpisode.duration}</span>
                      </>
                    )}
                  </>
                )}
              </div>
              <p className="text-gray-300 leading-relaxed">{heroDesc}</p>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-3">
              <button className="bg-[#ff4fd8] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#ff4fd8]/80 transition-colors">
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button className="border border-gray-600 text-gray-300 px-6 py-2 rounded-lg font-semibold hover:bg-black/50 transition-colors">
                + Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Anime Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {animes.map((anime) => (
          <AnimeCard 
            key={anime.folder} 
            anime={anime} 
            onPlay={playEpisode} 
            activeEpId={activeEpId} 
          />
        ))}
      </div>
    </div>
  );
}

function AnimeCard({
  anime,
  onPlay,
  activeEpId,
}: {
  anime: Anime;
  onPlay: (a: Anime, e: Episode) => void;
  activeEpId: string | null;
}) {
  const [open, setOpen] = useState(false);
  const epsRef = useRef<HTMLDivElement | null>(null);
  const [, setPreviewPlaying] = useState(false);
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!epsRef.current) return;
    if (open) {
      const el = epsRef.current;
      el.style.maxHeight = el.scrollHeight + 'px';
    } else {
      epsRef.current.style.maxHeight = '0px';
    }
  }, [open]);

  // Hover handlers for desktop (not used on touch devices)
  async function handleMouseEnter() {
    if (!previewRef.current || !anime.episodes[0]) return;
    const v = previewRef.current;
    if (!v.src) {
      v.src = anime.episodes[0].src;
    }
    
    try {
      // Fade out image
      if (imgRef.current) imgRef.current.style.opacity = '0';
      v.style.display = 'block';
      await v.play();
      setPreviewPlaying(true);
    } catch {
      // Ignore autoplay errors
    }
  }

  function handleMouseLeave() {
    if (previewRef.current) {
      previewRef.current.pause();
      previewRef.current.style.display = 'none';
    }
    if (imgRef.current) imgRef.current.style.opacity = '1';
    setPreviewPlaying(false);
  }

  return (
    <div className="bg-[#0b0b0b] rounded-lg p-4 shadow-lg border border-gray-800 hover:border-[#ff4fd8]/30 transition-colors">
      <div
        className="relative h-48 rounded-md overflow-hidden cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setOpen(!open)}
      >
        <Image
          ref={imgRef}
          src={anime.thumbnail ?? '/placeholder-thumb.png'}
          alt={anime.title}
          width={300}
          height={200}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        
        {/* Preview video (muted loop) */}
        <video
          ref={previewRef}
          muted
          playsInline
          loop
          className="absolute inset-0 w-full h-full object-cover rounded-md hidden"
        />
        
        {/* Episode counter badge */}
        <div className="absolute left-3 top-3 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          {anime.episodes.length} episodes
        </div>
        
        {/* Year and genre badges */}
        <div className="absolute right-3 top-3 flex flex-col gap-1">
          <div className="bg-[#ff4fd8]/90 text-black text-xs px-2 py-1 rounded font-semibold">
            {anime.year}
          </div>
          <div className="bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            {anime.genre[0]}
          </div>
        </div>
        
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
          <div className="bg-[#ff4fd8] text-black p-3 rounded-full">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-base font-semibold text-white mb-2 truncate">{anime.title}</h4>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
          className="w-full text-xs px-3 py-2 rounded-md border border-gray-700 text-[#ff4fd8] hover:bg-[#ff4fd8]/10 transition-colors"
        >
          {open ? 'Hide Episodes' : `Show Episodes (${anime.episodes.length})`}
        </button>
      </div>

      {/* Episodes list (collapsible) */}
      <div
        ref={epsRef}
        className="mt-3 overflow-hidden transition-all duration-300"
        style={{ maxHeight: 0 }}
      >
        <div className="space-y-2">
          {anime.episodes.map((ep) => {
            const active = activeEpId === ep.id;
            return (
              <button
                key={ep.id}
                onClick={() => onPlay(anime, ep)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  active
                    ? 'bg-gradient-to-r from-[#ff4fd8] to-[#ff84f5] text-white'
                    : 'hover:bg-black/20 text-gray-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{`${ep.episodeNumber}. ${ep.title}`}</div>
                    <div className="text-xs text-gray-400">{ep.duration || ep.file}</div>
                  </div>
                  {ep.description && (
                    <div className="text-xs text-gray-500 line-clamp-2">{ep.description}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
