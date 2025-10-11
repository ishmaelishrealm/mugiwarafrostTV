"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Upload, Plus, Settings, Home, BarChart3 } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navItems: NavItem[] = [
  {
    href: "/admin/upload",
    label: "Upload Episodes",
    icon: Upload,
    description: "Upload video episodes to existing anime"
  },
  {
    href: "/admin/anime/new",
    label: "Create Anime",
    icon: Plus,
    description: "Create new anime collections"
  },
  {
    href: "/admin",
    label: "Dashboard",
    icon: Home,
    description: "Admin dashboard overview"
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "View site analytics and stats"
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    description: "Manage site settings"
  }
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-background-secondary/50 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-accent to-accent-alt rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MF</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">
              MugiwaraFrostTV Admin
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-foreground-secondary hover:text-foreground hover:bg-background-secondary'
                  }`}
                  title={item.description}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-foreground-secondary hover:text-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-foreground-secondary hover:text-foreground hover:bg-background-secondary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
