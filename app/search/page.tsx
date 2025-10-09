import { Search, X } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Search Results</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Search for anime, characters, or genres..."
              className="w-full pl-10 pr-12 py-4 bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-lg"
              defaultValue="one piece"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground-muted hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-sm text-foreground-secondary">Filters:</span>
          <button className="px-3 py-1 bg-accent text-white rounded-full text-sm">
            All
          </button>
          <button className="px-3 py-1 bg-background-tertiary text-foreground-secondary rounded-full text-sm hover:bg-border">
            Anime
          </button>
          <button className="px-3 py-1 bg-background-tertiary text-foreground-secondary rounded-full text-sm hover:bg-border">
            Movies
          </button>
          <button className="px-3 py-1 bg-background-tertiary text-foreground-secondary rounded-full text-sm hover:bg-border">
            OVA
          </button>
        </div>

        {/* Search Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-foreground-secondary">
              Found <span className="text-accent font-semibold">12</span> results for &quot;one piece&quot;
            </p>
            <select className="px-3 py-2 bg-background-secondary border border-border rounded-lg text-sm">
              <option>Most Relevant</option>
              <option>Most Popular</option>
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>

          {/* Result Items */}
          <div className="space-y-4">
            {[
              { title: "One Piece", type: "TV", year: "1999", episodes: "1000+", status: "Ongoing" },
              { title: "One Piece Film: Red", type: "Movie", year: "2022", episodes: "1", status: "Completed" },
              { title: "One Piece: Stampede", type: "Movie", year: "2019", episodes: "1", status: "Completed" },
              { title: "One Piece: Strong World", type: "Movie", year: "2009", episodes: "1", status: "Completed" },
            ].map((anime, index) => (
              <div key={index} className="flex gap-4 p-4 bg-background-secondary rounded-lg hover:bg-background-tertiary transition-colors cursor-pointer">
                <div className="w-16 h-24 bg-gradient-to-br from-accent/20 to-accent-light/20 rounded flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 hover:text-accent transition-colors">
                    {anime.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-sm text-foreground-muted mb-2">
                    <span>{anime.type}</span>
                    <span>•</span>
                    <span>{anime.year}</span>
                    <span>•</span>
                    <span>{anime.episodes} episodes</span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      anime.status === 'Ongoing' ? 'bg-accent/20 text-accent' : 'bg-success/20 text-success'
                    }`}>
                      {anime.status}
                    </span>
                  </div>
                  <p className="text-sm text-foreground-secondary line-clamp-2">
                    Follow the adventures of Monkey D. Luffy and his pirate crew as they search for the ultimate treasure, the One Piece.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* No Results State */}
          {/* <div className="text-center py-12">
            <Search className="w-16 h-16 text-foreground-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-foreground-secondary">
              Try adjusting your search terms or browse our categories instead.
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
