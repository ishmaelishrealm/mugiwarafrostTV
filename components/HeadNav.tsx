"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";

export default function HeadNav() {
  const [search, setSearch] = useState("");

  return (
    <header className="w-full bg-black/70 backdrop-blur-md border-b border-pink-600/10 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/assets/IshrealmAnime Ninja Logo Design.png"
            alt="IshrealmAnime Logo"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
          <span className="text-2xl font-bold text-white tracking-wide">
            <span className="text-pink-500">Ishrealm</span>Anime
          </span>
        </div>

        {/* Center: Search */}
        <div className="hidden sm:flex items-center justify-center flex-1 mx-6">
          <div className="flex items-center bg-gray-100 text-gray-800 rounded-md px-2 py-[4px] w-[190px] h-[30px]">
            <Search className="w-4 h-4 text-gray-500 mr-1" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-full placeholder-gray-500"
            />
          </div>
        </div>

        {/* Right: Nav Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-300 hover:text-pink-500 transition text-sm font-medium"
          >
            Home
          </Link>
        </div>
      </nav>

      {/* Mobile search (visible only below sm breakpoint) */}
      <div className="sm:hidden flex justify-center py-2 px-4">
        <div className="flex items-center bg-gray-100 text-gray-800 rounded-md px-2 py-[4px] w-full max-w-[200px] h-[30px]">
          <Search className="w-4 h-4 text-gray-500 mr-1" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-full placeholder-gray-500"
          />
        </div>
      </div>
    </header>
  );
}