import { NextRequest, NextResponse } from 'next/server';
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id } = await params;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const body = await request.json();

    // TODO: Implement show update logic
    // This would typically involve:
    // 1. Validate user permissions (admin only)
    // 2. Validate input data
    // 3. Update show in database
    // 4. Handle image uploads if provided
    // 5. Return updated show

    return NextResponse.json(
      { error: 'Show update not implemented yet' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error updating show:', error);
    return NextResponse.json(
      { error: 'Failed to update show' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id } = await params;

    // TODO: Implement show deletion logic
    // This would typically involve:
    // 1. Validate user permissions (admin only)
    // 2. Delete show and all associated episodes from database
    // 3. Remove associated files from storage
    // 4. Return success response

    return NextResponse.json(
      { error: 'Show deletion not implemented yet' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error deleting show:', error);
    return NextResponse.json(
      { error: 'Failed to delete show' },
      { status: 500 }
    );
  }
}
