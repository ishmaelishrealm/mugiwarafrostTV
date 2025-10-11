"use client";

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface PlayerProps {
  videoId: string;
  posterUrl?: string;
  title?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}

export default function Player({ 
  videoId, 
  posterUrl, 
  title,
  onTimeUpdate,
  onEnded 
}: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // const [isPlaying, setIsPlaying] = useState(false); // TODO: Implement play state management
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // API endpoint for video data
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.sonoaactv.live';
  const [videoData, setVideoData] = useState<{
    id: string;
    title: string;
    hlsUrl: string;
    streamUrl: string;
    thumbnail: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch video data from backend
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiBaseUrl}/api/video/${videoId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setVideoData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch video data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoData();
    }
  }, [videoId, apiBaseUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoData) return;

    const { hlsUrl, streamUrl } = videoData;

    // Try HLS first, fallback to direct play
    if (Hls.isSupported()) {
      const hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      
      hlsInstance.loadSource(hlsUrl);
      hlsInstance.attachMedia(video);
      
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('Bunny HLS manifest parsed successfully');
      });

      hlsInstance.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          // Fallback to direct play URL
          video.src = streamUrl;
        }
      });

      return () => hlsInstance.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = hlsUrl;
    } else {
      // Fallback to direct play
      video.src = streamUrl;
    }

    // Video event listeners
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
      onTimeUpdate?.(video.currentTime, video.duration);
    };

    const handlePlay = () => {
      // TODO: Implement play state management
    };
    const handlePause = () => {
      // TODO: Implement pause state management
    };
    const handleEnded = () => {
      onEnded?.();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadedmetadata', () => setDuration(video.duration));

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoData, onTimeUpdate, onEnded]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="w-full bg-black rounded-xl overflow-hidden shadow-2xl">
        <div className="relative w-full aspect-video flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading video...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-black rounded-xl overflow-hidden shadow-2xl">
        <div className="relative w-full aspect-video flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-red-400 mb-2">Error loading video</p>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black rounded-xl overflow-hidden shadow-2xl">
      <div className="relative w-full aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full"
          poster={posterUrl || videoData?.thumbnail}
          controls
          preload="metadata"
        />
        
        {/* Custom overlay if needed */}
        {(title || videoData?.title) && (
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
            {title || videoData?.title}
          </div>
        )}
        
        {/* Progress indicator */}
        {duration > 0 && (
          <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        )}
      </div>
    </div>
  );
}