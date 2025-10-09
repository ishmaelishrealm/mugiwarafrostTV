import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BUNNY_LIBRARY_ID = process.env.BUNNY_LIBRARY_ID!;
const BUNNY_API_KEY = process.env.BUNNY_API_KEY!;
const DELIVERY_DOMAIN = process.env.BUNNY_DELIVERY_DOMAIN!;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const collectionName = formData.get("collection") as string;

    if (!file || !title) {
      return NextResponse.json({ error: "Missing file or title" }, { status: 400 });
    }

    console.log(`Starting upload for: ${title} (Collection: ${collectionName})`);

    // Step 1: Create video in Bunny
    const createVideoResponse = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "AccessKey": BUNNY_API_KEY,
        },
        body: JSON.stringify({ 
          title: title,
          collectionId: collectionName ? `collection-${collectionName.toLowerCase().replace(/\s+/g, '-')}` : undefined
        }),
      }
    );

    if (!createVideoResponse.ok) {
      const errorText = await createVideoResponse.text();
      console.error("Failed to create Bunny video:", errorText);
      return NextResponse.json({ error: "Failed to create Bunny video" }, { status: 500 });
    }

    const createData = await createVideoResponse.json();
    const videoId = createData.guid;

    if (!videoId) {
      return NextResponse.json({ error: "No video ID returned from Bunny" }, { status: 500 });
    }

    console.log(`Created Bunny video with ID: ${videoId}`);

    // Step 2: Upload file to Bunny
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const uploadResponse = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${videoId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream",
          "AccessKey": BUNNY_API_KEY,
        },
        body: fileBuffer,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("Failed to upload file to Bunny:", errorText);
      return NextResponse.json({ error: "Failed to upload file to Bunny" }, { status: 500 });
    }

    console.log(`File uploaded successfully to Bunny`);

    // Step 3: Create or update anime in database
    const animeTitle = collectionName || title.split(' - ')[0] || title;
    let anime = await prisma.anime.findFirst({ 
      where: { title: animeTitle } 
    });

    if (!anime) {
      // Mark all other anime as not featured
      await prisma.anime.updateMany({ data: { featured: false } });
      
      // Create new anime
      anime = await prisma.anime.create({
        data: {
          title: animeTitle,
          description: description || `Latest episodes of ${animeTitle}`,
          bunnyId: createData.collectionId || `collection-${animeTitle.toLowerCase().replace(/\s+/g, '-')}`,
          featured: true,
        },
      });
      console.log(`Created new anime: ${anime.title}`);
    } else {
      // Mark this anime as featured (newest upload becomes featured)
      await prisma.anime.updateMany({ data: { featured: false } });
      await prisma.anime.update({
        where: { id: anime.id },
        data: { featured: true },
      });
      console.log(`Updated featured anime: ${anime.title}`);
    }

    // Step 4: Create episode
    const episodeCount = await prisma.episode.count({ where: { animeId: anime.id } });
    const nextEpisodeNumber = episodeCount + 1;

    const playbackUrl = `https://iframe.mediadelivery.net/play/${BUNNY_LIBRARY_ID}/${videoId}`;
    const thumbnailUrl = `https://${DELIVERY_DOMAIN}/${videoId}/thumbnail.jpg`;

    await prisma.episode.create({
      data: {
        title: title,
        episodeNumber: nextEpisodeNumber,
        bunnyVideoId: videoId,
        playbackUrl: playbackUrl,
        thumbnail: thumbnailUrl,
        animeId: anime.id,
      },
    });

    console.log(`Created episode ${nextEpisodeNumber}: ${title}`);

    return NextResponse.json({
      success: true,
      anime: anime.title,
      episode: title,
      episodeNumber: nextEpisodeNumber,
      playbackUrl: playbackUrl,
      videoId: videoId,
      message: `Successfully uploaded "${title}" to "${anime.title}"`
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: "Upload failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "Upload endpoint is active",
    supportedFormats: ["mp4", "mkv", "avi", "mov", "webm"],
    maxFileSize: "2GB"
  });
}



