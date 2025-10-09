import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BUNNY_LIBRARY_ID = process.env.BUNNY_LIBRARY_ID!;
const BUNNY_DELIVERY_DOMAIN = process.env.BUNNY_DELIVERY_DOMAIN!;

export async function POST(req: NextRequest) {
  try {
    // Extract webhook data directly
    const { eventType, videoGuid, title, libraryId } = await req.json();

    // Log incoming webhook for debugging
    console.log("🎬 Bunny Webhook received:", JSON.stringify({ eventType, videoGuid, title, libraryId }, null, 2));

    // Validate webhook data
    if (!eventType || !videoGuid || !title) {
      console.error("❌ Invalid webhook data:", { eventType, videoGuid, title, libraryId });
      return NextResponse.json(
        { success: false, message: "Missing required webhook data" },
        { status: 400 }
      );
    }

    // Only process video upload/encoding events
    if (!["VideoUploaded", "VideoEncoded", "VideoReady"].includes(eventType)) {
      console.log(`⏭️ Skipping event type: ${eventType}`);
      return NextResponse.json({ success: true, message: "Event type not processed" });
    }

    console.log(`🎬 Processing ${eventType} for video: ${title} (${videoGuid})`);

    // Parse anime and episode from title
    // Expected format: "Anime Title - Episode X" or just "Anime Title"
    const titleParts = title.split(" - ");
    const animeTitle = titleParts[0]?.trim() || "Untitled Anime";
    const episodeTitle = titleParts[1]?.trim() || "Episode 1";

    // Find or create anime
    let anime = await prisma.anime.findFirst({ 
      where: { 
        title: animeTitle
      } 
    });

    if (!anime) {
      console.log(`📺 Creating new anime: ${animeTitle}`);
      
      // Mark all other anime as not featured
      await prisma.anime.updateMany({ data: { featured: false } });
      
      // Create new anime
      anime = await prisma.anime.create({
        data: {
          title: animeTitle,
          description: `Auto-created anime collection for ${animeTitle}`,
          bannerImage: `https://${BUNNY_DELIVERY_DOMAIN}/${videoGuid}/thumbnail.jpg`,
          featured: true, // New anime becomes featured
        },
      });
      
      console.log(`✅ Created anime: ${anime.title} (ID: ${anime.id})`);
    } else {
      console.log(`📺 Found existing anime: ${anime.title}`);
      
      // Update featured status for this anime (newest upload becomes featured)
      if (eventType === "VideoEncoded" || eventType === "VideoReady") {
        await prisma.anime.updateMany({ data: { featured: false } });
        await prisma.anime.update({
          where: { id: anime.id },
          data: { featured: true }
        });
        console.log(`⭐ Made anime featured: ${anime.title}`);
      }
    }

    // Create or update episode
    const playbackUrl = `https://iframe.mediadelivery.net/play/${BUNNY_LIBRARY_ID}/${videoGuid}`;
    const thumbnailUrl = `https://${BUNNY_DELIVERY_DOMAIN}/${videoGuid}/thumbnail.jpg`;

    // Count existing episodes for this anime to determine episode number
    const episodeCount = await prisma.episode.count({ 
      where: { animeId: anime.id } 
    });
    const nextEpisodeNumber = episodeCount + 1;

    const episode = await prisma.episode.upsert({
      where: { bunnyVideoId: videoGuid },
      update: {
        title: episodeTitle,
        playbackUrl: playbackUrl,
        thumbnail: thumbnailUrl,
        updatedAt: new Date(),
      },
      create: {
        title: episodeTitle,
        bunnyVideoId: videoGuid,
        playbackUrl: playbackUrl,
        thumbnail: thumbnailUrl,
        episodeNumber: nextEpisodeNumber,
        animeId: anime.id,
      },
    });

    console.log(`✅ Created/Updated episode: ${episode.title} (Episode ${episode.episodeNumber})`);

    // Log success
    console.log(`🎉 Webhook processed successfully:
      - Anime: ${anime.title}
      - Episode: ${episode.title}
      - Video ID: ${videoGuid}
      - Featured: ${anime.featured}
    `);

    return NextResponse.json({ 
      success: true, 
      message: "Webhook processed successfully",
      data: {
        animeId: anime.id,
        animeTitle: anime.title,
        episodeId: episode.id,
        episodeTitle: episode.title,
        episodeNumber: episode.episodeNumber,
        featured: anime.featured
      }
    });

  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Webhook processing failed",
        error: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({ 
    message: "Bunny.net webhook endpoint is active",
    status: "ready",
    timestamp: new Date().toISOString()
  });
}