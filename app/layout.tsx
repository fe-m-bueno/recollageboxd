import type { Metadata } from "next";
import "./globals.css";
import CollageProvider from "@/context/CollageContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://recollageboxd.vercel.app"),
  title: "Recollage - Create Custom Letterboxd Movie Grids",
  icons: {
    icon: "/favicon.svg",
  },
  description:
    "Generate personalized movie collages from your Letterboxd top movies with customizable layouts.",
  keywords:
    "letterboxd, collage, movie grid, music collage, album artwork, top albums",
  authors: { name: "Felipe B." },
  applicationName: "Recollage - Letterboxd Collage Maker",
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: "https://recollageboxd.vercel.app",
    title: "Recollage - Create Custom Letterboxd Movie Grids",
    description: "Generate custom collages from your top Letterboxd movies.",
    images: [
      {
        url: "/ogcard.png",
        width: 1200,
        height: 630,
        alt: "Preview of Recollage Letterboxd Collage Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recollage - Letterboxd Collage Maker",
    description:
      "Create a personalized movie grid from your top Letterboxd movies.",
    images: ["https://recollageboxd.vercel.app/ogcard.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CollageProvider>{children}</CollageProvider>
      </body>
    </html>
  );
}
