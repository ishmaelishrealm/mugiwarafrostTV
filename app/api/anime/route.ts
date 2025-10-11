import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

type Episode = {
  id: string;
  title: string;
  src: string;
  file: string;
  duration?: string;
  description?: string;
  episodeNumber: number;
};

type AnimeMetadata = {
  title?: string;
  description?: string;
  year?: number;
  genre?: string[];
  episodes?: {
    [key: string]: {
      title?: string;
      description?: string;
      duration?: string;
    };
  };
  bunnycdn?: {
    videoId?: string;
    directPlayUrl?: string;
    hlsPlaylistUrl?: string;
    thumbnailUrl?: string;
    previewAnimationUrl?: string;
  };
};

type Anime = {
  folder: string;
  title: string;
  description: string;
  year: number;
  genre: string[];
  thumbnail: string | undefined;
  episodes: Episode[];
};

const PUBLIC_ASSETS = path.join(process.cwd(), 'public', 'anime-assets');

function isImage(filename: string) {
  return /\.(png|jpe?g|webp|gif)$/i.test(filename);
}

function isVideo(filename: string) {
  return /\.(mp4|webm|ogg)$/i.test(filename);
}

async function scanAnime(): Promise<Anime[]> {
  try {
    // Check if the anime-assets directory exists
    const dirents = await readdir(PUBLIC_ASSETS, { withFileTypes: true }).catch(() => {
      console.warn(`Anime assets directory not found: ${PUBLIC_ASSETS}`);
      return [];
    });
    
    const results: Anime[] = [];

    for (const d of dirents) {
      if (!d.isDirectory()) continue;
      const folderName = d.name;
      const folderPath = path.join(PUBLIC_ASSETS, folderName);
      let files: string[] = [];
      
      try {
        files = await readdir(folderPath);
      } catch (err) {
        console.warn(`Could not read directory ${folderPath}:`, err);
        continue;
      }

      // Load metadata.json if it exists
      let metadata: AnimeMetadata = {};
      const metadataFile = files.find(f => f === 'metadata.json');
      if (metadataFile) {
        try {
          const metadataPath = path.join(folderPath, metadataFile);
          const metadataContent = await readFile(metadataPath, 'utf-8');
          metadata = JSON.parse(metadataContent);
        } catch (err) {
          console.warn(`Could not load metadata for ${folderName}:`, err);
        }
      }

      // Pick thumbnail: preferentially thumbnail.* then first image
      let thumbnail = files.find((f) => /^thumbnail\.(png|jpe?g|webp)$/i.test(f));
      if (!thumbnail) thumbnail = files.find(isImage) ?? undefined;

      // Video files with better sorting - handle various naming patterns
      const videoFiles = files.filter(isVideo).sort((a, b) => {
        // Extract episode numbers from filenames
        const getEpisodeNumber = (filename: string) => {
          // Try different patterns: ep1, episode1, s01e01, 01, etc.
          const patterns = [
            /ep(\d+)/i,
            /episode\s*(\d+)/i,
            /s\d+e(\d+)/i,
            /(\d+)/i
          ];
          
          for (const pattern of patterns) {
            const match = filename.match(pattern);
            if (match) return parseInt(match[1], 10);
          }
          return 999; // Fallback for files without clear episode numbers
        };

        return getEpisodeNumber(a) - getEpisodeNumber(b);
      });

          const episodes: Episode[] = videoFiles.map((f, idx) => {
            const episodeKey = f.replace(/\.[^/.]+$/, ""); // Remove extension
            const episodeMetadata = metadata.episodes?.[episodeKey] || metadata.episodes?.[f] || {};

            // Use BunnyCDN URL if available, otherwise use local file
            let videoSrc = `/anime-assets/${encodeURI(folderName)}/${encodeURI(f)}`;
            if (metadata.bunnycdn?.hlsPlaylistUrl && idx === 0) {
              // Use HLS playlist for the first episode (main video)
              videoSrc = metadata.bunnycdn.hlsPlaylistUrl;
            }

            return {
              id: `${folderName}-ep-${idx + 1}`,
              title: episodeMetadata.title || `Episode ${idx + 1}`,
              src: videoSrc,
              file: f,
              duration: episodeMetadata.duration,
              description: episodeMetadata.description,
              episodeNumber: idx + 1,
            };
          });

      results.push({
        folder: folderName,
        title: metadata.title || folderName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: metadata.description || `Watch ${folderName.replace(/[-_]/g, ' ')} episodes online.`,
        year: metadata.year || new Date().getFullYear(),
        genre: metadata.genre || ['Anime'],
        thumbnail: metadata.bunnycdn?.thumbnailUrl || (thumbnail ? `/anime-assets/${encodeURI(folderName)}/${encodeURI(thumbnail)}` : undefined),
        episodes,
      });
    }

    // Sort by title
    results.sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));
    return results;
  } catch (error) {
    console.error('Error scanning anime assets:', error);
    return [];
  }
}

export async function GET() {
  try {
    const data = await scanAnime();

    // If no local assets found, return mock dataset so frontend always works
    if (!data || data.length === 0) {
      const mock = [
        {
          folder: 'HeroWithoutClass',
          title: 'Hero Without a Class',
          description: 'A classless hero finds power where none expected.',
          year: new Date().getFullYear(),
          genre: ['Action', 'Adventure', 'Fantasy'],
          thumbnail:
            'https://vz-a01fffb9-e7a.b-cdn.net/1f9a121e-c681-410e-b309-967ef313d1e8/thumbnail_d1259536.jpg',
          episodes: [
            {
              id: 'hero-without-class-ep-1',
              title: 'Episode 1 — Awakening',
              src:
                'https://vz-a01fffb9-e7a.b-cdn.net/1f9a121e-c681-410e-b309-967ef313d1e8/playlist.m3u8',
              file: 'playlist.m3u8',
              duration: '24:30',
              description: 'The journey begins.',
              episodeNumber: 1,
            },
          ],
        },
        // lightweight placeholders to fill the grid
        ...Array.from({ length: 12 }).map((_, i) => ({
          folder: `Placeholder-${i + 1}`,
          title: `Anime ${String(i + 2).padStart(2, '0')}`,
          description: `Placeholder series #${i + 2}`,
          year: new Date().getFullYear(),
          genre: ['Anime'],
          thumbnail: undefined,
          episodes: [
            {
              id: `placeholder-${i + 1}-ep-1`,
              title: 'Episode 1',
              src: '',
              file: 'n/a',
              duration: '24:00',
              description: '',
              episodeNumber: 1,
            },
          ],
        })),
      ];
      return NextResponse.json({ ok: true, data: mock }, { status: 200 });
    }

    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (err: unknown) {
    console.error('scanAnime error', err);
    return NextResponse.json({ 
      ok: false, 
      error: err instanceof Error ? err.message : String(err),
      data: []
    }, { status: 500 });
  }
}