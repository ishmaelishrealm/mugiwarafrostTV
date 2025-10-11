"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

type Props = {
  iframeUrl?: string | null;
  hlsUrl?: string | null;
  poster?: string | null;
};

export default function StreamPlayer({ iframeUrl, hlsUrl, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (iframeUrl) return;
    if (hlsUrl && videoRef.current) {
      const video = videoRef.current;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl;
      } else if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        return () => hls.destroy();
      } else {
        video.src = hlsUrl;
      }
    }
  }, [iframeUrl, hlsUrl]);

  if (iframeUrl) {
    return (
      <div className="w-full aspect-video bg-black">
        <iframe
          src={iframeUrl}
          allow="autoplay; fullscreen; picture-in-picture"
          className="w-full h-full rounded-lg"
          title="Episode player"
        />
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video ref={videoRef} controls poster={poster ?? undefined} className="w-full h-full bg-black" />
    </div>
  );
}
