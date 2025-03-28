import { NextResponse } from "next/server";
import {
  createCanvas,
  loadImage,
  registerFont,
  CanvasRenderingContext2D as CanvasContext,
} from "canvas";
import path from "path";

registerFont(path.join(process.cwd(), "public/fonts/NotoSans.ttf"), {
  family: "NotoSans",
});
registerFont(path.join(process.cwd(), "public/fonts/Inter.ttf"), {
  family: "Inter",
});
registerFont(path.join(process.cwd(), "public/fonts/NotoSansArabic.ttf"), {
  family: "NotoSansArabic",
});
registerFont(path.join(process.cwd(), "public/fonts/NotoSansDevanagari.ttf"), {
  family: "NotoSansDevanagari",
});
registerFont(path.join(process.cwd(), "public/fonts/NotoSansJP.ttf"), {
  family: "NotoSansJP",
});
registerFont(path.join(process.cwd(), "public/fonts/NotoSansKR.ttf"), {
  family: "NotoSansKR",
});
registerFont(path.join(process.cwd(), "public/fonts/NotoSansSC.ttf"), {
  family: "NotoSansSC",
});
registerFont(path.join(process.cwd(), "public/fonts/NotoSansThai.ttf"), {
  family: "NotoSansThai",
});
registerFont(path.join(process.cwd(), "public/fonts/NotoSerifHebrew.ttf"), {
  family: "NotoSerifHebrew",
});

const FONT_FALLBACKS = [
  { name: "Inter", languages: /[\u0000-\u00FF]/ },
  { name: "NotoSans", languages: /[\u0000-\u00FF]/ },
  { name: "NotoSansJP", languages: /[\u3040-\u30FF\u31F0-\u31FF]/ },
  { name: "NotoSansKR", languages: /[\uAC00-\uD7AF]/ },
  { name: "NotoSansArabic", languages: /[\u0600-\u06FF]/ },
  { name: "NotoSansSC", languages: /[\u4E00-\u9FFF]/ },
  { name: "NotoSansThai", languages: /[\u0E00-\u0E7F]/ },
  { name: "NotoSansDevanagari", languages: /[\u0900-\u097F]/ },
  { name: "NotoSerifHebrew", languages: /[\u0590-\u05FF]/ },
];

function getBestFontForChar(char: string): string {
  for (const font of FONT_FALLBACKS) {
    if (font.languages.test(char)) {
      return font.name;
    }
  }
  return "NotoSans";
}

function decodeHTMLEntities(text: string): string {
  return text.replace(/&#(\d+);/g, (_, dec) =>
    String.fromCharCode(Number(dec))
  );
}

function drawTextWithFallback(
  ctx: CanvasContext,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  maxWidth: number,
  isLargeGrid: boolean
) {
  let offsetX = x;
  const lineHeight = fontSize + 4;

  for (const char of text) {
    const fontToUse = getBestFontForChar(char);
    ctx.font = `${fontSize}px ${fontToUse}`;
    ctx.textBaseline = "top";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";

    if (!isLargeGrid) {
      ctx.shadowColor = "black";
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowBlur = 2;
      ctx.lineWidth = 1;
    } else {
      ctx.shadowBlur = 0;
    }

    if (offsetX + ctx.measureText(char).width > x + maxWidth) {
      offsetX = x;
      y += lineHeight;
    }

    ctx.strokeText(char, offsetX, y + 0.9);
    ctx.fillText(char, offsetX, y);
    ctx.shadowColor = "transparent";
    offsetX += ctx.measureText(char).width;
  }

  return y + lineHeight;
}

function drawStars(
  ctx: CanvasContext,
  rating: number,
  x: number,
  y: number,
  starWidth = 75,
  starHeight = 15
) {
  const parsedRating = Math.min(Math.max(rating, 0), 5);
  const fillWidth = starWidth * (parsedRating / 5);
  const starCount = 5;
  const starSpacing = starWidth / starCount;

  const drawStar = (starX: number, starY: number, size: number) => {
    ctx.beginPath();
    const outerRadius = size / 2;
    const innerRadius = outerRadius / 2.5;
    for (let i = 0; i < 5; i++) {
      const angle = Math.PI / 2 + (i * 2 * Math.PI) / 5;
      const xOuter = starX + Math.cos(angle) * outerRadius;
      const yOuter = starY - Math.sin(angle) * outerRadius;
      const xInner = starX + Math.cos(angle + Math.PI / 5) * innerRadius;
      const yInner = starY - Math.sin(angle + Math.PI / 5) * innerRadius;
      if (i === 0) {
        ctx.moveTo(xOuter, yOuter);
      } else {
        ctx.lineTo(xOuter, yOuter);
      }
      ctx.lineTo(xInner, yInner);
    }
    ctx.closePath();
  };

  ctx.shadowColor = "black";
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.shadowBlur = 2;

  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  for (let i = 0; i < starCount; i++) {
    const starX = x + i * starSpacing + starSpacing / 2;
    const starY = y + starHeight / 2;
    drawStar(starX, starY, starHeight);
    ctx.stroke();
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, fillWidth, starHeight);
  ctx.clip();
  ctx.fillStyle = "white";
  for (let i = 0; i < starCount; i++) {
    const starX = x + i * starSpacing + starSpacing / 2;
    const starY = y + starHeight / 2;
    drawStar(starX, starY, starHeight);
    ctx.fill();
  }
  ctx.restore();

  ctx.shadowColor = "transparent";
}

export async function POST(request: Request) {
  try {
    const { movies } = await request.json();

    if (!movies || movies.length === 0) {
      return NextResponse.json(
        { error: "Nenhum filme para gerar o collage." },
        { status: 400 }
      );
    }

    const cellWidth = 300;
    const cellHeight = Math.floor(cellWidth * 1.5);

    const totalMovies = movies.length;
    const columns = Math.ceil(totalMovies === 50 ? 5 : Math.sqrt(totalMovies));
    const rows = Math.ceil(totalMovies / columns);

    const canvasWidth = columns * cellWidth;
    const canvasHeight = rows * cellHeight;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const images = await Promise.allSettled(
      movies.map(async (movie: any) => {
        try {
          return { img: await loadImage(movie.imageUrl), movie };
        } catch {
          return { img: null, movie };
        }
      })
    );

    images.forEach((result, i) => {
      if (result.status !== "fulfilled" || !result.value) return;
      const { img, movie } = result.value;

      const row = Math.floor(i / columns);
      const col = i % columns;
      const x = col * cellWidth;
      const y = row * cellHeight;

      if (img) {
        ctx.drawImage(img, x, y, cellWidth, cellHeight);
      } else {
        ctx.fillStyle = "#cccccc";
        ctx.fillRect(x, y, cellWidth, cellHeight);
      }

      let text = "";
      if (movie.displayMovieName && movie.filmTitle) {
        text += decodeHTMLEntities(movie.filmTitle) + "\n";
      }

      let textBottomY = y;
      if (text) {
        const fontSize = Math.floor(cellWidth / 20);
        const maxTextWidth = cellWidth - 10;
        const lines = text.split("\n").filter((line) => line.trim() !== "");
        lines.forEach((line, j) => {
          textBottomY = drawTextWithFallback(
            ctx,
            line,
            x + 5,
            y + 5 + j * fontSize * 1.2,
            fontSize,
            maxTextWidth,
            false
          );
        });
      }

      if (
        movie.displayRating &&
        movie.memberRating !== undefined &&
        movie.memberRating !== null
      ) {
        const starWidth = 75;
        const starHeight = 15;
        const starX = x + 5;
        const starY = textBottomY + 5;

        drawStars(ctx, movie.memberRating, starX, starY, starWidth, starHeight);
      }
    });

    const buffer = canvas.toBuffer("image/png");
    return new NextResponse(buffer, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: "Failed to generate collage" },
      { status: 500 }
    );
  }
}
