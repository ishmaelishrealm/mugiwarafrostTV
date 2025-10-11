import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readdir, readFile } from "fs/promises";

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
};

const PUBLIC_ASSETS = path.join(process.cwd(), "public", "anime-assets");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const folderName = resolvedParams.id;
    const folderPath = path.join(PUBLIC_ASSETS, folderName);

    const files = await readdir(folderPath);
    const metadataFile = files.find((f) => f === "metadata.json");

    let metadata: AnimeMetadata = {};
    if (metadataFile) {
      const metaPath = path.join(folderPath, metadataFile);
      metadata = JSON.parse(await readFile(metaPath, "utf-8"));
    }

    const isImage = (file: string) => /\.(png|jpe?g|webp)$/i.test(file);
    const isVideo = (file: string) => /\.(mp4|webm|ogg)$/i.test(file);

    let thumbnail = files.find((f) =>
      /^thumbnail\.(png|jpe?g|webp)$/i.test(f)
    );
    if (!thumbnail) thumbnail = files.find(isImage) ?? undefined;

    const getEpisodeNumber = (filename: string) => {
      const patterns = [
        /ep(\d+)/i,
        /episode\s*(\d+)/i,
        /s\d+e(\d+)/i,
        /(\d+)/i,
      ];
      for (const pattern of patterns) {
        const match = filename.match(pattern);
        if (match) return parseInt(match[1], 10);
      }
      return 999;
    };

    const episodes = files
      .filter(isVideo)
      .sort((a, b) => getEpisodeNumber(a) - getEpisodeNumber(b))
      .map((file, idx) => ({
        id: `${folderName}-ep-${idx + 1}`,
        title: metadata.episodes?.[file]?.title || `Episode ${idx + 1}`,
        episodeNumber: idx + 1,
        thumbnail: thumbnail
          ? `/anime-assets/${folderName}/${thumbnail}`
          : null,
        createdAt: new Date().toISOString(),
      }));

    return NextResponse.json({
      id: folderName,
      title:
        metadata.title ||
        folderName.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      description:
        metadata.description ||
        `Watch ${folderName.replace(/[-_]/g, " ")} online.`,
      bannerImage: thumbnail
        ? `/anime-assets/${folderName}/${thumbnail}`
        : null,
      featured: false,
      createdAt: new Date().toISOString(),
      episodes,
    });
  } catch (error) {
    console.error("Error loading anime details:", error);
    return NextResponse.json({ error: "Anime not found" }, { status: 404 });
  }
}