import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: 'The "username" parameter is required' },
      { status: 400 }
    );
  }

  const letterboxdUrl = `https://letterboxd.com/${username}/rss/`;
  let responseText: string;

  try {
    const res = await fetch(letterboxdUrl);
    if (!res.ok) throw new Error("Failed to fetch Letterboxd RSS");
    responseText = await res.text();
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching Letterboxd RSS" },
      { status: 500 }
    );
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });
  const rssData = parser.parse(responseText);

  let items = rssData?.rss?.channel?.item;

  if (!items) {
    return NextResponse.json({ films: [] });
  }

  if (!Array.isArray(items)) {
    items = [items];
  }

  items = items.filter((item: any) => {
    const link = item.link || "";
    const hasFilmData =
      item["letterboxd:filmTitle"] && item["letterboxd:filmYear"];
    const isNotList = !link.includes("/list/");
    return hasFilmData && isNotList;
  });

  const extractImageFromDescription = (description: string): string => {
    const match = description.match(/<img.*?src="(.*?)"/);
    return match ? match[1] : "";
  };

  const films = items.map((item: any) => ({
    title: item.title,
    filmTitle: item["letterboxd:filmTitle"],
    filmYear: item["letterboxd:filmYear"],
    memberRating: item["letterboxd:memberRating"],
    tmdbMovieId: item["tmdb:movieId"],
    poster: extractImageFromDescription(item.description),
    link: item.link,
    pubDate: item.pubDate,
  }));

  return NextResponse.json({ films });
}
