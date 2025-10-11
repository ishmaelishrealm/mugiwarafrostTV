"use client";

import Image from "next/image";
import Link from "next/link";

export default function EpisodeBottom() {
  const moreEpisodes = [
    { id: "2", title: "Episode 2", thumb: "/placeholder-thumb.png" },
    { id: "3", title: "Episode 3", thumb: "/placeholder-thumb.png" },
    { id: "4", title: "Episode 4", thumb: "/placeholder-thumb.png" },
    { id: "5", title: "Episode 5", thumb: "/placeholder-thumb.png" },
    { id: "6", title: "Episode 6", thumb: "/placeholder-thumb.png" },
    { id: "7", title: "Episode 7", thumb: "/placeholder-thumb.png" },
  ];

  const recommendations = [
    { id: "1", title: "Solo Leveling", thumb: "/placeholder-thumb.png" },
    { id: "2", title: "Jujutsu Kaisen", thumb: "/placeholder-thumb.png" },
    { id: "3", title: "Chainsaw Man", thumb: "/placeholder-thumb.png" },
    { id: "4", title: "Attack on Titan", thumb: "/placeholder-thumb.png" },
    { id: "5", title: "One Piece", thumb: "/placeholder-thumb.png" },
    { id: "6", title: "Demon Slayer", thumb: "/placeholder-thumb.png" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto mt-10 px-4">
      {/* More Episodes Section */}
      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white border-b border-pink-600 pb-2">
          More Episodes
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {moreEpisodes.map((ep) => (
            <Link
              key={ep.id}
              href={`/watch/${ep.id}`}
              className="group relative overflow-hidden rounded-lg bg-gray-900 hover:shadow-lg hover:shadow-pink-600/30 transition-all"
            >
              <div className="w-full h-40 bg-gray-800 flex items-center justify-center">
                <span className="text-gray-500 text-sm">{ep.title}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-sm sm:text-base font-semibold text-white">
                  {ep.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* You May Also Like Section */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white border-b border-pink-600 pb-2">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {recommendations.map((anime) => (
            <Link
              key={anime.id}
              href={`/anime/${anime.id}`}
              className="group relative overflow-hidden rounded-lg bg-gray-900 hover:shadow-lg hover:shadow-pink-600/30 transition-all"
            >
              <div className="w-full h-40 bg-gray-800 flex items-center justify-center">
                <span className="text-gray-500 text-sm">{anime.title}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                <p className="text-xs sm:text-sm md:text-base font-semibold text-white">
                  {anime.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
