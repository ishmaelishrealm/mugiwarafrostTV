import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BUNNY_API_KEY, BUNNY_LIBRARY_ID, BUNNY_DELIVERY_DOMAIN } from "@/lib/config";

export async function GET() {
  try {
    console.log("🔄 Starting Bunny.net sync...");

    // 1️⃣ Fetch all videos from Bunny Library
    const response = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
      {
        headers: {
          accept: "application/json",
          AccessKey: BUNNY_API_KEY,
        },
      }
    );

    if (!response.ok) {
      console.error("❌ Failed to fetch Bunny videos:", response.status);
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to fetch Bunny videos",
          details: `HTTP ${response.status}: ${response.statusText}`
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    const videos = data?.items || [];

    console.log(`📹 Found ${videos.length} videos in Bunny library`);

    let newEpisodes = 0;
    let newAnime = 0;
    let updatedEpisodes = 0;
    const errors: string[] = [];

    // 2️⃣ Loop through each video
    for (const vid of videos) {
      try {
        const {
          guid,
          title,
          status,
          dateUploaded,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          collectionId,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          length,
          thumbnailFileName,
          dateCreated,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          storageSize,
        } = vid;

        // Skip unprocessed, deleted, or failed videos
        if (status !== 4) {
          console.log(`⏭️ Skipping video ${title} (status: ${status})`);
          continue;
        }

        if (!title || !guid) {
          console.log(`⏭️ Skipping video with missing title or guid`);
          continue;
        }

        const playbackUrl = `https://iframe.mediadelivery.net/play/${BUNNY_LIBRARY_ID}/${guid}`;
        const thumbnailUrl = thumbnailFileName 
          ? `https://${BUNNY_DELIVERY_DOMAIN}/${guid}/thumbnail.jpg`
          : null;

        // 3️⃣ Check if episode already exists
        const existingEpisode = await prisma.episode.findUnique({
          where: { bunnyVideoId: guid },
          include: { anime: true }
        });

        if (existingEpisode) {
          // Update existing episode if needed
          const needsUpdate = 
            existingEpisode.title !== title ||
            existingEpisode.playbackUrl !== playbackUrl ||
            existingEpisode.thumbnail !== thumbnailUrl;

          if (needsUpdate) {
            await prisma.episode.update({
              where: { bunnyVideoId: guid },
              data: {
                title,
                playbackUrl,
                thumbnail: thumbnailUrl,
              },
            });
            updatedEpisodes++;
            console.log(`🔄 Updated episode: ${title}`);
          }
          continue;
        }

        // 4️⃣ Parse anime title from video title
        const titleParts = title.split(" - ");
        const animeTitle = titleParts[0]?.trim() || "Unknown Anime";
        const episodeTitle = titleParts[1]?.trim() || title;

        // Extract episode number if possible
        let episodeNumber: number | undefined;
        const episodeMatch = episodeTitle.match(/(?:Episode|Ep)\s*(\d+)/i);
        if (episodeMatch) {
          episodeNumber = parseInt(episodeMatch[1]);
        }

        // 5️⃣ Find or create anime
        let anime = await prisma.anime.findFirst({
          where: { title: animeTitle }
        });

        if (!anime) {
          // Mark all other anime as not featured when creating new one
          await prisma.anime.updateMany({ 
            data: { featured: false } 
          });

          anime = await prisma.anime.create({
            data: {
              title: animeTitle,
              description: `Auto-imported from Bunny.net - ${animeTitle}`,
              bannerImage: thumbnailUrl,
              featured: true, // Make the newest anime featured
            },
          });
          newAnime++;
          console.log(`🆕 Created new anime: ${animeTitle}`);
        } else {
          // If this is the latest episode of an existing anime, make it featured
          const latestEpisode = await prisma.episode.findFirst({
            where: { animeId: anime.id },
            orderBy: { createdAt: 'desc' }
          });

          if (!latestEpisode || new Date(dateUploaded) > latestEpisode.createdAt) {
            await prisma.anime.updateMany({ 
              data: { featured: false } 
            });
            await prisma.anime.update({
              where: { id: anime.id },
              data: { featured: true }
            });
            console.log(`⭐ Made anime featured: ${animeTitle}`);
          }
        }

        // 6️⃣ Create new episode
        await prisma.episode.create({
          data: {
            title: episodeTitle,
            episodeNumber,
            bunnyVideoId: guid,
            playbackUrl,
            thumbnail: thumbnailUrl,
            animeId: anime.id,
            createdAt: new Date(dateUploaded || dateCreated),
          },
        });

        newEpisodes++;
        console.log(`✅ Added episode: ${episodeTitle} to ${animeTitle}`);

      } catch (error) {
        const errorMsg = `Failed to process video ${vid.title}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }

    const summary = {
      success: true,
      message: `Sync complete! Added ${newEpisodes} new episodes, ${newAnime} new anime, updated ${updatedEpisodes} episodes`,
      details: {
        totalVideos: videos.length,
        newEpisodes,
        newAnime,
        updatedEpisodes,
        errors: errors.length > 0 ? errors : undefined,
      }
    };

    console.log("🎉 Sync completed:", summary.message);
    return NextResponse.json(summary);

  } catch (error) {
    console.error("❌ Sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to sync with Bunny.net",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Optional: Add POST method for manual triggering with parameters
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { forceUpdate = false } = body;

    console.log(`🔄 Manual sync triggered (forceUpdate: ${forceUpdate})`);
    
    // For now, just call the GET method
    // In the future, you could add force update logic here
    return GET();

  } catch (error) {
    console.error("❌ Manual sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to trigger manual sync",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
