import { NextRequest, NextResponse } from 'next/server';

/** ---- Types ---- */
export interface Show {
  id: string;
  title: string;
  synopsis: string;
  coverUrl: string;
  genres: string[];
  status: 'Ongoing' | 'Completed' | 'Hiatus';
  year: number;
  rating: number;
  episodeCount: number;
  isPremium: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ShowsResponse {
  shows: Show[];
  pagination: Pagination;
}

/** ---- Empty Data Array (will be populated when anime is uploaded) ---- */
const shows: Show[] = [];

/** ---- GET handler ---- */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const genre = searchParams.get('genre')?.toLowerCase();
    const search = searchParams.get('search')?.toLowerCase();
    const sort = searchParams.get('sort') || 'popular';

    let filteredShows = [...shows];

    // Filter by genre
    if (genre) {
      filteredShows = filteredShows.filter((show) =>
        show.genres.some((g) => g.toLowerCase().includes(genre))
      );
    }

    // Filter by title/synopsis
    if (search) {
      filteredShows = filteredShows.filter(
        (show) =>
          show.title.toLowerCase().includes(search) ||
          show.synopsis.toLowerCase().includes(search)
      );
    }

    // Sorting
    switch (sort) {
      case 'rating':
        filteredShows.sort((a, b) => b.rating - a.rating);
        break;
      case 'year':
        filteredShows.sort((a, b) => b.year - a.year);
        break;
      case 'title':
        filteredShows.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        filteredShows.sort((a, b) => b.rating - a.rating);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedShows = filteredShows.slice(startIndex, startIndex + limit);

    const response: ShowsResponse = {
      shows: paginatedShows,
      pagination: {
        page,
        limit,
        total: filteredShows.length,
        totalPages: Math.ceil(filteredShows.length / limit),
        hasNext: startIndex + limit < filteredShows.length,
        hasPrev: page > 1,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching shows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shows' },
      { status: 500 }
    );
  }
}

/** ---- POST handler ---- */
export async function POST(request: NextRequest) {
  try {
    const body: Partial<Show> = await request.json();

    // Validate required fields
    if (!body.title || !body.synopsis || !body.coverUrl) {
      return NextResponse.json(
        { error: 'Missing required show fields' },
        { status: 400 }
      );
    }

    // TODO: Insert into DB (this is a mock response)
    const newShow: Show = {
      id: String(Date.now()),
      title: body.title,
      synopsis: body.synopsis,
      coverUrl: body.coverUrl,
      genres: body.genres ?? [],
      status: body.status ?? 'Ongoing',
      year: body.year ?? new Date().getFullYear(),
      rating: body.rating ?? 0,
      episodeCount: body.episodeCount ?? 0,
      isPremium: body.isPremium ?? false,
    };

    return NextResponse.json(newShow, { status: 201 });
  } catch (error) {
    console.error('Error creating show:', error);
    return NextResponse.json(
      { error: 'Failed to create show' },
      { status: 500 }
    );
  }
}