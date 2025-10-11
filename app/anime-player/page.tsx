"use client";

import { useState } from "react";
import StreamPlayer from "@/components/player/StreamPlayer";
import EpisodeBottom from "@/components/EpisodeBottom";

export default function AnimePlayerDemoPage() {
  const episode = {
    title: "Hero Without a Class — Episode 1",
    showTitle: "Hero Without a Class",
    number: 1,
    thumbnail: "/placeholder-hero.jpg",
  };

  const servers = [
    {
      name: "Bunny (iframe)",
      iframe: "https://iframe.mediadelivery.net/play/506159/1f9a121e-c681-410e-b309-967ef313d1e8",
    },
  ];

  const [serverIndex, setServerIndex] = useState(0);

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center font-sans">
      {/* Top Info Bar - AnimeHeaven Style */}
      <div className="w-full bg-gray-900 border-b border-gray-800 py-3 px-4 flex justify-center">
        <div className="w-full max-w-6xl flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              {episode.title}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {episode.showTitle} • Episode {episode.number}
            </p>
          </div>
          <div className="mt-3 md:mt-0 text-sm text-gray-400">
            <span className="mr-4">📺 HD</span>
            <span>💾 Sub | Dub</span>
          </div>
        </div>
      </div>

      {/* Main Player Section - Large 16:9 */}
      <div className="w-full flex justify-center bg-black py-6">
        <div className="w-full max-w-6xl aspect-video bg-black relative player-container">
          <StreamPlayer
            iframeUrl={servers[serverIndex]?.iframe}
            poster={episode.thumbnail}
          />
        </div>
      </div>

      {/* Server Selector - AnimeHeaven Style */}
      <div className="w-full flex justify-center mb-6">
        <div className="max-w-6xl w-full flex flex-wrap gap-3 px-4">
          {servers.map((srv, i) => (
            <button
              key={srv.name}
              onClick={() => setServerIndex(i)}
              className={`px-5 py-2 rounded-md font-semibold transition-all duration-200 ${
                i === serverIndex
                  ? "bg-pink-600 text-white shadow-[0_0_15px_rgba(255,105,180,0.5)]"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
              }`}
            >
              {srv.name}
            </button>
          ))}
        </div>
      </div>

      {/* Episode Navigation - AnimeHeaven Style */}
      <div className="w-full flex justify-center mb-8">
        <div className="max-w-6xl w-full flex justify-between px-4">
          <button className="px-6 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-all duration-200">
            ⬅ Previous Episode
          </button>
          <button className="px-6 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-all duration-200">
            Next Episode ➡
          </button>
        </div>
      </div>

      {/* Episode Info Panel */}
      <div className="w-full max-w-6xl px-4 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">{episode.title}</h3>
          <p className="text-gray-400 mb-4">
            The hero begins his journey without any class abilities, proving that true strength comes from determination and skill rather than magical powers.
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="px-3 py-1 bg-gray-800 rounded">{episode.showTitle}</span>
            <span className="px-3 py-1 bg-gray-800 rounded">Episode {episode.number}</span>
            <span className="px-3 py-1 bg-gray-800 rounded">Action</span>
            <span className="px-3 py-1 bg-gray-800 rounded">Adventure</span>
            <span className="px-3 py-1 bg-gray-800 rounded">Fantasy</span>
          </div>
        </div>
      </div>

      {/* Comments Section Placeholder */}
      <div className="w-full max-w-6xl px-4 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4">Comments</h4>
          <div className="text-gray-400">
            Comments section - integrate with your preferred commenting system (Disqus, etc.)
          </div>
        </div>
      </div>

      {/* Bottom Sections - More Episodes & Recommendations */}
      <EpisodeBottom />

      {/* Back to Home */}
      <div className="w-full flex justify-center mt-8 mb-8">
        <a 
          href="/" 
          className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}