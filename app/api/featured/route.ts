import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const featured = await prisma.anime.findFirst({
      where: { featured: true },
      include: { 
        episodes: { 
          take: 1, 
          orderBy: { createdAt: "desc" } 
        } 
      },
    });

    if (!featured || featured.episodes.length === 0) {
      return NextResponse.json({ 
        error: "No featured anime found" 
      }, { status: 404 });
    }

    const episode = featured.episodes[0];
    
    return NextResponse.json({
      title: featured.title,
      description: featured.description,
      playbackUrl: episode.playbackUrl,
      thumbnail: episode.thumbnail,
      animeId: featured.id,
      episodeId: episode.id,
    });
  } catch (error) {
    console.error('Error fetching featured anime:', error);
    return NextResponse.json({ 
      error: "Failed to fetch featured anime" 
    }, { status: 500 });
  }
}






