"use client";
import Image from "next/image";
import Link from "next/link";

export default function HeadNav() {
  return (
    <header 
      className="w-full bg-transparent text-white !important" 
      style={{
        backgroundColor: 'transparent', 
        width: '100%',
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        zIndex: 999
      }}
    >
      <nav 
        className="flex items-center justify-center px-6 py-4 bg-gray-800 mx-[25%] w-[50%] !bg-gray-800" 
        style={{
          marginLeft: '25%', 
          marginRight: '25%', 
          width: '50%', 
          backgroundColor: '#1f2937',
          border: '3px solid transparent',
          background: 'linear-gradient(#1f2937, #1f2937) padding-box, linear-gradient(45deg, #ff4fd8, #00ff00, #ff4fd8, #00ff00) border-box',
          boxShadow: '0 0 20px rgba(255, 79, 216, 0.5), 0 0 40px rgba(0, 255, 0, 0.3), inset 0 1px 0 rgba(255, 79, 216, 0.3), inset 0 -1px 0 rgba(0, 255, 0, 0.3)',
          display: 'flex',
          visibility: 'visible',
          opacity: 1,
          zIndex: 999,
          minHeight: '80px'
        }}
      >
        {/* General Section: Logo + Search + Home */}
        <div className="flex items-center justify-between w-full">
          {/* Left: Logo + Search Bar */}
          <div className="flex items-center space-x-12">
            {/* Logo */}
            <Image
              src="/assets/Ishrealmanime.png"
              alt="Ishrealmanime"
              width={80}
              height={80}
              className="object-contain"
              style={{
                mixBlendMode: 'multiply',
                filter: 'brightness(1.1) contrast(1.2)',
                backgroundColor: 'transparent'
              }}
              priority
            />

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search"
              className="w-[300px] h-[32px] px-3 bg-transparent text-white rounded-full border border-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-300 hover:border-pink-400 hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
            />
          </div>

          {/* Center: Home Link */}
          <div className="flex-1 flex justify-center">
                    <Link 
                      href="/" 
                      className="px-6 py-2 text-white font-bold no-underline transition-all duration-200 hover:text-gray-300"
                      style={{
                        color: 'white !important',
                        fontWeight: 'bold !important'
                      }}
                    >
                      Home
                    </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}