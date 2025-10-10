"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Sample anime data with PNG previews
  const animeSlides = [
    { id: 1, title: "Attack on Titan", image: "/assets/Ishrealmanime.png" },
    { id: 2, title: "Demon Slayer", image: "/assets/Ishrealmanime.png" },
    { id: 3, title: "One Piece", image: "/assets/Ishrealmanime.png" },
    { id: 4, title: "Naruto", image: "/assets/Ishrealmanime.png" },
    { id: 5, title: "Dragon Ball Z", image: "/assets/Ishrealmanime.png" },
    { id: 6, title: "My Hero Academia", image: "/assets/Ishrealmanime.png" },
    { id: 7, title: "Jujutsu Kaisen", image: "/assets/Ishrealmanime.png" },
    { id: 8, title: "Tokyo Ghoul", image: "/assets/Ishrealmanime.png" },
    { id: 9, title: "Death Note", image: "/assets/Ishrealmanime.png" },
    { id: 10, title: "Fullmetal Alchemist", image: "/assets/Ishrealmanime.png" }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % animeSlides.length);
    }, 100000); // Change slide every 100,000 seconds

    return () => clearInterval(timer);
  }, [animeSlides.length]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Slideshow Section */}
      <section 
        className="relative h-[60vh] w-full overflow-hidden mt-2.5"
        style={{ 
          backgroundColor: '#d1d5db !important',
          background: '#d1d5db !important'
        }}
      >
        <div className="relative h-full w-full">
          {/* Slideshow Container */}
          <div 
            className="flex h-full transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {animeSlides.map((anime, index) => (
              <div key={anime.id} className="w-full h-full flex-shrink-0 relative">
                {/* Anime Preview Image */}
                <div className="w-full h-full flex items-center justify-center">
                  <Image
                    src={anime.image}
                    alt={anime.title}
                    width={400}
                    height={300}
                    className="object-contain rounded-lg shadow-2xl"
                    style={{
                      mixBlendMode: 'multiply',
                      filter: 'brightness(1.1) contrast(1.2)',
                      backgroundColor: 'transparent'
                    }}
                    priority={index === 0}
                  />
                </div>
                
                {/* Anime Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-2">
                    {anime.title}
                  </h2>
                  <p className="text-xl text-gray-300">
                    Stream the latest episodes now
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {animeSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-pink-500 scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}