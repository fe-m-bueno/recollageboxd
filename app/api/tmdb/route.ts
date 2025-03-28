import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tmdbMovieId = searchParams.get("tmdbMovieId");
  if (!tmdbMovieId) {
    return NextResponse.json(
      { error: 'The "tmdbMovieId" parameter is required' },
      { status: 400 }
    );
  }

  const tmdbApiKey = process.env.TMDB_API_KEY;
  const tmdbBaseUrl = process.env.TMDB_BASE_URL;
  if (!tmdbApiKey || !tmdbBaseUrl) {
    return NextResponse.json(
      { error: "TMDB configuration is missing" },
      { status: 500 }
    );
  }

  const tmdbUrl = `${tmdbBaseUrl}/movie/${tmdbMovieId}/images?api_key=${tmdbApiKey}`;
  let tmdbResponse: any;
  try {
    const res = await fetch(tmdbUrl);
    if (!res.ok) throw new Error("Failed to fetch TMDB images");
    tmdbResponse = await res.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching images from TMDB" },
      { status: 500 }
    );
  }

  interface ImageType {
    aspect_ratio: number;
    height: number;
    iso_639_1: string | null;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
  }

  const posters: ImageType[] = (tmdbResponse.posters || []).map(
    (poster: any) => ({
      aspect_ratio: poster.aspect_ratio || 0,
      height: poster.height || 0,
      iso_639_1: poster.iso_639_1 || null,
      file_path: poster.file_path,
      vote_average: poster.vote_average || 0,
      vote_count: poster.vote_count || 0,
      width: poster.width || 0,
    })
  );

  const backdrops: ImageType[] = (tmdbResponse.backdrops || []).map(
    (backdrop: any) => ({
      aspect_ratio: backdrop.aspect_ratio || 0,
      height: backdrop.height || 0,
      iso_639_1: backdrop.iso_639_1 || null,
      file_path: backdrop.file_path,
      vote_average: backdrop.vote_average || 0,
      vote_count: backdrop.vote_count || 0,
      width: backdrop.width || 0,
    })
  );

  const logos: ImageType[] = (tmdbResponse.logos || []).map((logo: any) => ({
    aspect_ratio: logo.aspect_ratio || 0,
    height: logo.height || 0,
    iso_639_1: logo.iso_639_1 || null,
    file_path: logo.file_path,
    vote_average: logo.vote_average || 0,
    vote_count: logo.vote_count || 0,
    width: logo.width || 0,
  }));

  return NextResponse.json({ posters, backdrops, logos });
}
