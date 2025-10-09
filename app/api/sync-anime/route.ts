import { NextRequest, NextResponse } from "next/server";

const BUNNY_API_KEY = "7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896";
const LIBRARY_ID = "506159";
const CDN_HOSTNAME = "vz-a01fffb9-e7a.b-cdn.net";

interface BunnyVideo {
  guid: string;
  title: string;
  description?: string;
  thumbnailFileName?: string;
  videoLibraryId: number;
  dateUploaded: string;
  dateCreated: string;
  length: number;
  status: number;
  framerate: number;
  rotation: number;
  width: number;
  height: number;
  availableResolutions: string;
  thumbnailCount: number;
  encodeProgress: number;
  storageSize: number;
  captions: unknown[];
  chapters: unknown[];
  moments: unknown[];
  metaTags: unknown[];
  transcodingMessages: unknown[];
}

interface Episode {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  description?: string;
}

interface Anime {
  id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  episodes: Episode[];
  year: number;
  genre: string[];
}

async function fetchBunnyLibrary(): Promise<BunnyVideo[]> {
  try {
    const response = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
      headers: {
        'AccessKey': BUNNY_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Bunny API error: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching Bunny library:', error);
    return [];
  }
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function extractAnimeTitle(videoTitle: string): string {
  // Extract anime title from video filename
  // Examples: "Naruto Episode 1" -> "Naruto", "One Piece S01E01" -> "One Piece"
  const patterns = [
    /^([^\-_]+?)(?:\s*Episode|\s*Ep|\s*S\d+E\d+)/i,
    /^([^\-_]+?)(?:\s*-\s*)/i,
    /^([^\-_]+?)(?:\s*_)/i
  ];

  for (const pattern of patterns) {
    const match = videoTitle.match(pattern);
    if (match) {
      return match[1].trim().replace(/[-_]/g, ' ');
    }
  }

  // Fallback: use the full title
  return videoTitle.split(/[-_\s]/)[0] || videoTitle;
}

function organizeAnime(videos: BunnyVideo[]): Anime[] {
  const animeMap = new Map<string, Anime>();

  videos.forEach(video => {
    const animeTitle = extractAnimeTitle(video.title);
    const episodeTitle = video.title.replace(animeTitle, '').trim();
    
    // Create video URL
    const videoUrl = `https://iframe.mediadelivery.net/play/${LIBRARY_ID}/${video.guid}`;
    
    // Create thumbnail URL
    const thumbnailUrl = video.thumbnailFileName 
      ? `https://${CDN_HOSTNAME}/${video.guid}/${video.thumbnailFileName}`
      : `https://${CDN_HOSTNAME}/${video.guid}/thumbnail.jpg`;

    const episode: Episode = {
      id: video.guid,
      title: episodeTitle || video.title,
      videoUrl,
      thumbnailUrl,
      duration: formatDuration(video.length),
      description: video.description
    };

    if (!animeMap.has(animeTitle)) {
      animeMap.set(animeTitle, {
        id: animeTitle.toLowerCase().replace(/\s+/g, '-'),
        title: animeTitle,
        description: `Watch ${animeTitle} episodes online in HD quality.`,
        bannerUrl: thumbnailUrl, // Use first episode thumbnail as banner
        episodes: [],
        year: new Date(video.dateCreated).getFullYear(),
        genre: ['Anime']
      });
    }

    animeMap.get(animeTitle)!.episodes.push(episode);
  });

  // Sort episodes within each anime by title
  animeMap.forEach(anime => {
    anime.episodes.sort((a, b) => {
      // Extract episode numbers for sorting
      const getEpisodeNumber = (title: string) => {
        const match = title.match(/(\d+)/);
        return match ? parseInt(match[1]) : 999;
      };
      return getEpisodeNumber(a.title) - getEpisodeNumber(b.title);
    });
  });

  return Array.from(animeMap.values()).sort((a, b) => a.title.localeCompare(b.title));
}

export async function GET() {
  try {
    console.log('Fetching anime from Bunny Stream...');
    const videos = await fetchBunnyLibrary();
    
    if (videos.length === 0) {
      return NextResponse.json({ 
        ok: true, 
        data: [],
        message: 'No videos found in Bunny Stream library'
      });
    }

    console.log(`Found ${videos.length} videos in Bunny Stream`);
    const animeList = organizeAnime(videos);
    
    console.log(`Organized into ${animeList.length} anime series`);
    
    return NextResponse.json({ 
      ok: true, 
      data: animeList,
      count: animeList.length,
      totalVideos: videos.length
    });

  } catch (error) {
    console.error('Error in sync-anime API:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      data: []
    }, { status: 500 });
  }
}
