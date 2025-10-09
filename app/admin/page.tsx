"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Upload, Plus, Eye, TrendingUp, Clock, RefreshCw, Cloud } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";

interface DashboardStats {
  totalAnime: number;
  totalEpisodes: number;
  featuredAnime: string | null;
  recentUploads: Array<{
    id: string;
    title: string;
    animeTitle: string;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAnime: 0,
    totalEpisodes: 0,
    featuredAnime: null,
    recentUploads: []
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch anime data
        const animeResponse = await fetch('/api/anime');
        const animeData = await animeResponse.json();
        
        if (animeData.anime) {
          const totalAnime = animeData.anime.length;
          const totalEpisodes = animeData.anime.reduce((sum: number, anime: { episodeCount: number }) => sum + anime.episodeCount, 0);
          const featuredAnime = animeData.anime.find((a: { featured: boolean }) => a.featured)?.title || null;
          
          setStats({
            totalAnime,
            totalEpisodes,
            featuredAnime,
            recentUploads: [] // TODO: Add recent uploads endpoint
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSyncFromBunny = async () => {
    setSyncing(true);
    setSyncMessage(null);
    
    try {
      const response = await fetch('/api/sync-bunny');
      const data = await response.json();
      
      if (data.success) {
        setSyncMessage(data.message);
        // Refresh stats after sync
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setSyncMessage(`Sync failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setSyncMessage(`Sync error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSyncing(false);
    }
  };

  const quickActions = [
    {
      href: "/admin/anime/new",
      icon: Plus,
      title: "Create New Anime",
      description: "Add a new anime collection to your library",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      href: "/admin/upload",
      icon: Upload,
      title: "Upload Episodes",
      description: "Upload video episodes to existing anime",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      href: "/browse",
      icon: Eye,
      title: "View Site",
      description: "Preview your anime streaming site",
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  const statCards = [
    {
      icon: TrendingUp,
      label: "Total Anime",
      value: stats.totalAnime,
      color: "text-blue-500"
    },
    {
      icon: Upload,
      label: "Total Episodes",
      value: stats.totalEpisodes,
      color: "text-green-500"
    },
    {
      icon: Clock,
      label: "Featured Anime",
      value: stats.featuredAnime || "None",
      color: "text-purple-500"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <AdminNav />
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminNav />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-foreground-secondary text-lg">
            Manage your MugiwaraFrostTV anime streaming platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-background-secondary/50 backdrop-blur-md rounded-xl border border-border/50 p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-background ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-foreground-secondary">{stat.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  href={action.href}
                  className={`${action.color} p-6 rounded-xl text-white transition-colors group`}
                >
                  <div className="flex items-start gap-4">
                    <Icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                      <p className="text-white/80 text-sm">{action.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bunny.net Sync Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Bunny.net Sync</h2>
          <div className="bg-background-secondary/50 backdrop-blur-md rounded-xl border border-border/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Auto-Sync from Bunny.net</h3>
                <p className="text-foreground-secondary text-sm">
                  Upload videos directly to Bunny.net and sync them to your database automatically
                </p>
              </div>
              <button
                onClick={handleSyncFromBunny}
                disabled={syncing}
                className="flex items-center gap-2 bg-accent hover:bg-accent-hover disabled:bg-background-tertiary disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                {syncing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Cloud className="w-5 h-5" />
                    Sync from Bunny
                  </>
                )}
              </button>
            </div>
            
            {syncMessage && (
              <div className={`p-4 rounded-lg border ${
                syncMessage.includes('Sync complete') || syncMessage.includes('Added')
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                <p className="text-sm">{syncMessage}</p>
              </div>
            )}
            
            <div className="mt-4 text-xs text-foreground-muted">
              <p>💡 <strong>Tip:</strong> Upload videos directly to your Bunny.net library (ID: 506159) and click sync to automatically add them to your database.</p>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-background-secondary/30 rounded-xl border border-border/50 p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Getting Started</h2>
          <div className="space-y-4 text-foreground-secondary">
            <div className="flex items-start gap-3">
              <span className="text-accent font-bold">1.</span>
              <div>
                <span className="font-medium text-foreground">Create your first anime collection</span>
                <p className="text-sm mt-1">Use the &quot;Create New Anime&quot; button to add a new anime series to your library.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-bold">2.</span>
              <div>
                <span className="font-medium text-foreground">Upload episodes</span>
                <p className="text-sm mt-1">Upload video episodes to your anime collections using the upload page.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-bold">3.</span>
              <div>
                <span className="font-medium text-foreground">Watch your site come alive</span>
                <p className="text-sm mt-1">Your anime will automatically appear on your streaming site&apos;s homepage and browse pages.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
