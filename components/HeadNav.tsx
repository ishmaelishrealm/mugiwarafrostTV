"use client";
import Image from "next/image";
import Link from "next/link";

export default function HeadNav() {
  return (
    <header className="w-full bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Image
            src="/assets/Ishrealmanime.png"
            alt="Ishrealmanime"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </div>

        {/* Center: Search */}
        <div className="flex items-center">
          <input
            type="text"
            className="w-[200px] h-[32px] px-3 bg-gray-100 text-black rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Right: Home */}
        <div className="flex items-center">
          <Link href="/" className="text-white hover:text-pink-400 transition-colors">
            Home
          </Link>
        </div>
      </nav>
    </header>
  );
}
