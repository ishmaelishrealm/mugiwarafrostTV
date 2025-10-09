"use client";

import { useState } from "react";
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle, Loader, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";

interface CreateStatus {
  type: 'idle' | 'uploading' | 'success' | 'error';
  message: string;
  details?: {
    anime?: {
      id: string;
      title: string;
      createdAt: string;
    };
  };
}

export default function NewAnimePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [status, setStatus] = useState<CreateStatus>({ type: 'idle', message: '' });

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setCover(selectedFile);
      // Auto-fill title from filename if empty
      if (!title) {
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTitle(fileName);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      setStatus({ type: 'error', message: 'Please fill in title and description fields' });
      return;
    }

    setStatus({ type: 'uploading', message: 'Creating new anime collection...' });

    try {
      let coverUrl = null;

      // Step 1: Upload cover image if provided
      if (cover) {
        setStatus({ type: 'uploading', message: 'Uploading cover image...' });
        
        const formData = new FormData();
        formData.append("file", cover);
        formData.append("title", `${title} - Cover Image`);

        const uploadRes = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.message || "Cover image upload failed");
        }
        coverUrl = uploadData.url;
      }

      setStatus({ type: 'uploading', message: 'Creating anime in database...' });

      // Step 2: Create anime in database
      const res = await fetch("/api/anime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description, 
          bannerImage: coverUrl 
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create anime");
      }

      setStatus({
        type: 'success',
        message: `Anime "${title}" created successfully!`,
        details: data
      });

      // Reset form
      setTitle("");
      setDescription("");
      setCover(null);
      
      // Reset file input
      const fileInput = document.getElementById('cover-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (err: unknown) {
      setStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to create anime'
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
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/admin"
            className="flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">
            Create New Anime Collection
          </h1>
          <p className="text-foreground-secondary">
            Add a new anime series to your MugiwaraFrostTV library
          </p>
        </div>

        {/* Create Form */}
        <div className="bg-background-secondary/50 backdrop-blur-md rounded-2xl border border-border/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Anime Title */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Anime Title *
              </label>
              <input
                type="text"
                placeholder="e.g., My Status as an Assassin Obviously Exceeds the Hero's"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-lg bg-background border border-border text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Description *
              </label>
              <textarea
                placeholder="Enter a brief description of the anime series..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-lg bg-background border border-border text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                required
              />
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Cover Image
              </label>
              <div className="relative">
                <input
                  id="cover-input"
                  type="file"
                  accept="image/*,.jpg,.jpeg,.png,.webp"
                  onChange={handleCoverChange}
                  className="w-full p-3 rounded-lg bg-background border border-border text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              {cover && (
                <div className="mt-2 flex items-center gap-2 text-sm text-foreground-secondary">
                  <ImageIcon className="w-4 h-4" />
                  <span>{cover.name}</span>
                  <span className="text-accent">({(cover.size / (1024 * 1024)).toFixed(1)} MB)</span>
                </div>
              )}
              <p className="text-xs text-foreground-muted mt-1">
                Optional: Upload a cover image for the anime series (JPG, PNG, WebP)
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
                  Creating Anime...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Create Anime Collection
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
                    <p>• Anime ID: {status.details.anime?.id}</p>
                    <p>• Created: {status.details.anime?.createdAt ? new Date(status.details.anime.createdAt).toLocaleDateString() : 'Unknown'}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-background-secondary/30 rounded-lg p-6 border border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-3">What happens next:</h3>
          <ul className="space-y-2 text-sm text-foreground-secondary">
            <li className="flex items-start gap-2">
              <span className="text-accent">1.</span>
              <span>Your anime collection is created in the database</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">2.</span>
              <span>Cover image is uploaded to Bunny.net CDN</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">3.</span>
              <span>You can now upload episodes to this anime via the Upload page</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">4.</span>
              <span>The anime will appear in your site&apos;s anime listings</span>
            </li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4 justify-center">
          <Link
            href="/admin/upload"
            className="px-6 py-3 bg-background-secondary hover:bg-background-tertiary text-foreground rounded-lg transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Episodes
          </Link>
          {status.type === 'success' && (
            <Link
              href={`/show/${status.details?.anime?.id}`}
              className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors flex items-center gap-2"
            >
              View Anime
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
