import Image from 'next/image';
import Link from 'next/link';
import { Play, Heart, Star, Crown } from 'lucide-react';

interface ShowCardProps {
  id: string;
  title: string;
  coverUrl?: string;
  genres?: string[];
  year?: number;
  rating?: number;
  episodeCount?: number;
  status?: 'Ongoing' | 'Completed' | 'Upcoming';
  isPremium?: boolean;
  isInWatchlist?: boolean;
  onToggleWatchlist?: (id: string) => void;
}

export default function ShowCard({
  id,
  title,
  coverUrl,
  genres = [],
  year,
  rating,
  episodeCount,
  status = 'Completed',
  isPremium = false,
  isInWatchlist = false,
  onToggleWatchlist,
}: ShowCardProps) {
  const statusColors = {
    Ongoing: 'bg-accent/20 text-accent',
    Completed: 'bg-success/20 text-success',
    Upcoming: 'bg-warning/20 text-warning',
  };

  return (
    <div className="group cursor-pointer">
      <Link href={`/show/${id}`}>
        <div className="relative aspect-[3/4] bg-background-secondary rounded-lg mb-3 overflow-hidden">
          {/* Cover Image */}
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent-light/20 flex items-center justify-center">
              <Play className="w-12 h-12 text-accent/50" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

          {/* Premium Badge */}
          {isPremium && (
            <div className="absolute top-2 right-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-premium text-black rounded-full text-xs font-semibold">
                <Crown className="w-3 h-3" />
                Premium
              </div>
            </div>
          )}

          {/* Watchlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWatchlist?.(id);
            }}
            className="absolute top-2 left-2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
          >
            <Heart 
              className={`w-4 h-4 ${
                isInWatchlist ? 'text-accent fill-accent' : 'text-white'
              }`} 
            />
          </button>

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="p-4 bg-accent rounded-full hover:bg-accent-hover transition-colors">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </div>

          {/* Status Badge */}
          <div className="absolute bottom-2 left-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status]}`}>
              {status}
            </span>
          </div>
        </div>
      </Link>

      {/* Show Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-foreground-muted">
          <div className="flex items-center gap-1">
            {rating && (
              <>
                <Star className="w-3 h-3 fill-accent text-accent" />
                <span>{rating.toFixed(1)}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {year && <span>{year}</span>}
            {episodeCount && (
              <>
                <span>•</span>
                <span>{episodeCount} eps</span>
              </>
            )}
          </div>
        </div>

        {/* Genres */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {genres.slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-background-tertiary text-foreground-secondary rounded text-xs"
              >
                {genre}
              </span>
            ))}
            {genres.length > 2 && (
              <span className="px-2 py-1 bg-background-tertiary text-foreground-secondary rounded text-xs">
                +{genres.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
