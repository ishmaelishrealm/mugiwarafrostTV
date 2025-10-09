"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#1a1a1a] px-6 md:px-12 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-[#ff4fd8] to-[#ff84f5] rounded-full flex items-center justify-center">
          <span className="text-black font-bold text-lg">I</span>
        </div>
        <h1 className="font-bold text-xl md:text-3xl gradient-text">
          Ishrealmanime
        </h1>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        <Link
          href="/"
          className={`hover:text-[#ff84f5] transition-colors ${
            pathname === "/" ? "text-[#ff84f5]" : "text-gray-300"
          }`}
        >
          Home
        </Link>
        <Link
          href="/browse"
          className={`hover:text-[#ff84f5] transition-colors ${
            pathname === "/browse" ? "text-[#ff84f5]" : "text-gray-300"
          }`}
        >
          Anime
        </Link>
        <Link
          href="/trending"
          className={`hover:text-[#ff84f5] transition-colors ${
            pathname === "/trending" ? "text-[#ff84f5]" : "text-gray-300"
          }`}
        >
          Trending
        </Link>
      </div>
    </nav>
  );
}