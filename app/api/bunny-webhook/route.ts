import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BUNNY_LIBRARY_ID, BUNNY_DELIVERY_DOMAIN } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Normalize payload
    const {
      VideoLibraryId,
      VideoGuid,
      Status,
      Title,
      DateCreated,
      CollectionId,
    } = payload || {};

    if (!VideoLibraryId || String(VideoLibraryId) !== String(BUNNY_LIBRARY_ID)) {
      return NextResponse.json({ ok: true, skipped: true, reason: 'Wrong library' });
    }

    if (!VideoGuid || !Title) {
      return NextResponse.json({ ok: false, error: 'Missing VideoGuid or Title' }, { status: 400 });
    }

    if (Status !== 'Ready') {
      return NextResponse.json({ ok: true, skipped: true, reason: `Status ${Status}` });
    }

    const playbackUrl = `https://iframe.mediadelivery.net/play/${BUNNY_LIBRARY_ID}/${VideoGuid}`;
    const thumbnailUrl = `https://${BUNNY_DELIVERY_DOMAIN}/${VideoGuid}/thumbnail.jpg`;

    // Parse anime title and episode title
    const parts = String(Title).split(' - ');
    const animeTitle = parts[0]?.trim() || 'Unknown Anime';
    const episodeTitle = parts[1]?.trim() || String(Title);

    // Extract episode number
    let episodeNumber: number | undefined;
    const match = episodeTitle.match(/(?:Episode|Ep)\s*(\d+)/i);
    if (match) episodeNumber = parseInt(match[1]);

    // Find or create anime (prefer bunny collection id if provided)
    let anime = null;
    if (CollectionId) {
      anime = await prisma.anime.findFirst({ where: { bunnyId: String(CollectionId) } });
    }
    if (!anime) {
      anime = await prisma.anime.findFirst({ where: { title: animeTitle } });
    }
    if (!anime) {
      await prisma.anime.updateMany({ data: { featured: false } });
      anime = await prisma.anime.create({
        data: {
          title: animeTitle,
          description: `Auto-imported from Bunny.net - ${animeTitle}`,
          bannerImage: thumbnailUrl,
          bunnyId: CollectionId ? String(CollectionId) : null,
          featured: true,
        }
      });
    }

    await prisma.episode.upsert({
      where: { bunnyVideoId: String(VideoGuid) },
      update: { title: episodeTitle, playbackUrl, thumbnail: thumbnailUrl },
      create: {
        title: episodeTitle,
        episodeNumber,
        bunnyVideoId: String(VideoGuid),
        playbackUrl,
        thumbnail: thumbnailUrl,
        animeId: anime.id,
        createdAt: DateCreated ? new Date(DateCreated) : new Date(),
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error processing Bunny webhook:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({ 
    ok: true, 
    message: 'Bunny Stream webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
