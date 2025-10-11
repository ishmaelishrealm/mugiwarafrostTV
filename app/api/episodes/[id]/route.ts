import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch episode with anime data
    const episode = await prisma.episode.findUnique({
      where: { id },
      include: {
        anime: {
          select: {
            id: true,
            title: true,
            description: true,
            bannerImage: true,
            featured: true,
          }
        }
      }
    });

    if (!episode) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(episode);
  } catch (error) {
    console.error('Error fetching episode:', error);
    return NextResponse.json(
      { error: 'Failed to fetch episode' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, episodeNumber, thumbnail } = body;

    // Update episode
    const updatedEpisode = await prisma.episode.update({
      where: { id },
      data: {
        title,
        episodeNumber,
        thumbnail,
      },
      include: {
        anime: {
          select: {
            id: true,
            title: true,
            description: true,
            bannerImage: true,
            featured: true,
          }
        }
      },
    });

    return NextResponse.json(updatedEpisode);
  } catch (error) {
    console.error('Error updating episode:', error);
    return NextResponse.json(
      { error: 'Failed to update episode' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete episode
    await prisma.episode.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Episode deleted successfully' });
  } catch (error) {
    console.error('Error deleting episode:', error);
    return NextResponse.json(
      { error: 'Failed to delete episode' },
      { status: 500 }
    );
  }
}

