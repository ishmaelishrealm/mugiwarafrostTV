"use client";

import { useState, useEffect } from "react";
import { Upload, FileVideo, CheckCircle, AlertCircle, Loader, Search, Plus } from "lucide-react";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";

interface UploadStatus {
  type: 'idle' | 'uploading' | 'success' | 'error';
  message: string;
  details?: {
    anime?: string;
    episode?: string;
    episodeNumber?: number;
    videoId?: string;
  };
}

interface Anime {
  id: string;
  title: string;
  description: string | null;
  episodeCount: number;
  featured: boolean;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collection, setCollection] = useState("");
  const [status, setStatus] = useState<UploadStatus>({ type: 'idle', message: '' });
  
  // Anime selection states
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [animeSearch, setAnimeSearch] = useState("");
  const [showAnimeDropdown, setShowAnimeDropdown] = useState(false);
  const [isNewAnime, setIsNewAnime] = useState(false);

  // Fetch existing anime on component mount
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch('/api/anime');
        const data = await response.json();
        if (data.anime) {
          setAnimeList(data.anime);
        }
      } catch (error) {
        console.error('Failed to fetch anime:', error);
      }
    };
    fetchAnime();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.anime-dropdown-container')) {
        setShowAnimeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter anime based on search
  const filteredAnime = animeList.filter(anime =>
    anime.title.toLowerCase().includes(animeSearch.toLowerCase())
  );

  const handleAnimeSelect = (anime: Anime) => {
    setCollection(anime.title);
    setAnimeSearch(anime.title);
    setShowAnimeDropdown(false);
    setIsNewAnime(false);
  };

  const handleNewAnime = () => {
    setCollection("");
    setAnimeSearch("");
    setShowAnimeDropdown(false);
    setIsNewAnime(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-fill title from filename if empty
      if (!title) {
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
        setTitle(fileName);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !collection) {
      setStatus({ type: 'error', message: 'Please select a file, enter a title, and choose/enter an anime name' });
      return;
    }

    setStatus({ type: 'uploading', message: 'Uploading to Bunny.net...' });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("collection", collection);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          type: 'success',
          message: data.message || `Successfully uploaded "${data.episode}"`,
          details: data
        });
        
        // Reset form
        setFile(null);
        setTitle("");
        setDescription("");
        setCollection("");
        setAnimeSearch("");
        setIsNewAnime(false);
        
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // Refresh anime list to show new anime
        const refreshResponse = await fetch('/api/anime');
        const refreshData = await refreshResponse.json();
        if (refreshData.anime) {
          setAnimeList(refreshData.anime);
        }
        
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Upload failed'
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Network error during upload'
      });
    }
  };

  const getStatusIcon = () => {
    switch (status.type) {
      case 'uploading':
        return <Loader className="w-5 h-5 animate-spin text-accent" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status.type) {
      case 'uploading':
        return 'text-accent';
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-foreground-secondary';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminNav />
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">
            Upload New Anime Episode
          </h1>
          <p className="text-foreground-secondary mb-4">
            Upload videos directly to Bunny.net and automatically feature them on MugiwaraFrostTV
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/admin/anime/new"
              className="px-4 py-2 bg-background-secondary hover:bg-background-tertiary text-foreground rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Anime
            </Link>
          </div>
        </div>

        {/* Upload Form */}
        <div className="bg-background-secondary/50 backdrop-blur-md rounded-2xl border border-border/50 p-8">
          <form onSubmit={handleUpload} className="space-y-6">
            {/* Anime Selection */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Select or Create Anime *
              </label>
              <div className="relative anime-dropdown-container">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search existing anime or type new name..."
                      value={animeSearch}
                      onChange={(e) => {
                        setAnimeSearch(e.target.value);
                        setCollection(e.target.value);
                        setShowAnimeDropdown(true);
                        setIsNewAnime(true);
                      }}
                      onFocus={() => setShowAnimeDropdown(true)}
                      className="w-full p-3 rounded-lg bg-background border border-border text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                  </div>
                  <button
                    type="button"
                    onClick={handleNewAnime}
                    className="px-4 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New
                  </button>
                </div>
                
                {/* Anime Dropdown */}
                {showAnimeDropdown && filteredAnime.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredAnime.map((anime) => (
                      <button
                        key={anime.id}
                        type="button"
                        onClick={() => handleAnimeSelect(anime)}
                        className="w-full px-4 py-3 text-left hover:bg-background-secondary border-b border-border last:border-b-0 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-foreground">{anime.title}</div>
                          <div className="text-sm text-foreground-muted">
                            {anime.episodeCount} episodes
                            {anime.featured && <span className="ml-2 text-accent">• Featured</span>}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-foreground-muted mt-1">
                {isNewAnime ? "Creating new anime collection" : "Adding to existing anime"}
              </p>
            </div>

            {/* Episode Title */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Episode Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Episode 1 - The Beginning"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-lg bg-background border border-border text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Description
              </label>
              <textarea
                placeholder="Optional description for the episode..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-lg bg-background border border-border text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Video File *
              </label>
              <div className="relative">
                <input
                  id="file-input"
                  type="file"
                  accept="video/*,.mp4,.mkv,.avi,.mov,.webm"
                  onChange={handleFileChange}
                  className="w-full p-3 rounded-lg bg-background border border-border text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
              {file && (
                <div className="mt-2 flex items-center gap-2 text-sm text-foreground-secondary">
                  <FileVideo className="w-4 h-4" />
                  <span>{file.name}</span>
                  <span className="text-accent">({(file.size / (1024 * 1024)).toFixed(1)} MB)</span>
                </div>
              )}
              <p className="text-xs text-foreground-muted mt-1">
                Supported formats: MP4, MKV, AVI, MOV, WebM (Max: 2GB)
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status.type === 'uploading'}
              className="w-full bg-accent hover:bg-accent-hover disabled:bg-background-tertiary disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {status.type === 'uploading' ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Episode
                </>
              )}
            </button>
          </form>

          {/* Status Message */}
          {status.message && (
            <div className={`mt-6 p-4 rounded-lg border flex items-start gap-3 ${getStatusColor()}`}>
              {getStatusIcon()}
              <div>
                <p className="font-medium">{status.message}</p>
                {status.details && status.type === 'success' && (
                  <div className="mt-2 text-sm opacity-80">
                    <p>• Anime: {status.details.anime}</p>
                    <p>• Episode: {status.details.episodeNumber}</p>
                    <p>• Video ID: {status.details.videoId}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-background-secondary/30 rounded-lg p-6 border border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-3">How it works:</h3>
          <ul className="space-y-2 text-sm text-foreground-secondary">
            <li className="flex items-start gap-2">
              <span className="text-accent">1.</span>
              <span>Upload your video file to Bunny.net CDN</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">2.</span>
              <span>Create or update the anime collection in your database</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">3.</span>
              <span>Add the new episode with automatic numbering</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">4.</span>
              <span>Automatically feature the anime on your homepage hero section</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}


