"use client";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-black text-white shadow-md">
      <nav
        className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-[70px]"
        aria-label="Main Navigation"
      >
        {/* Left section — Logo + Search */}
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/IshrealmAnimeNinjaLogoDesign.png"
              alt="IshrealmAnime Logo"
              width={60}
              height={60}
              className="object-contain"
              priority
            />
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <input
              type="text"
              placeholder="Search anime..."
              className="w-[200px] h-[32px] rounded-md px-3 text-black bg-gray-100 
                         placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />
          </div>
        </div>

        {/* Right section — Nav links */}
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="hover:text-pink-400 transition-colors font-medium tracking-wide"
          >
            Home
          </Link>

          {/* Mobile search toggle (optional future enhancement) */}
          <button
            aria-label="Search"
            className="md:hidden hover:text-pink-400 focus:outline-none"
          >
            🔍
          </button>
        </div>
      </nav>
    </header>
  );
}