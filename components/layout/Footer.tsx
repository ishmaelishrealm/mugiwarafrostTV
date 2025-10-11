export default function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a] text-center text-gray-400 py-8 mt-16">
      <div className="space-y-2">
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="gradient-text font-semibold">
            Ishanime
          </span>{" "}
          — All rights reserved.
        </p>
        <p className="text-xs">
          Made with ❤️ for anime fans.
        </p>
      </div>
    </footer>
  );
}