"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CollageContext } from "../context/CollageContext";
import { Loader, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenerateCollageProps {
  filterDates: { start: string; end: string };
}
const GenerateCollage: React.FC<GenerateCollageProps> = ({ filterDates }) => {
  const { state } = useContext(CollageContext);
  const { movies } = state;
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const filteredMovies = movies.filter((movie) => {
    if (movie.forceShow) return true;
    const movieDate = new Date(movie.pubDate);
    const startDate = new Date(filterDates.start);
    const endDate = new Date(filterDates.end);
    return movieDate >= startDate && movieDate <= endDate;
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(10);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 200);

    try {
      const res = await fetch("/api/canvas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movies: filteredMovies,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error generating collage: ${res.statusText}`);
      }

      const blob = await res.blob();

      const imageUrl = URL.createObjectURL(blob);
      setProgress(100);
      clearInterval(interval);

      if (typeof window !== "undefined") {
        localStorage.setItem("collageImage", imageUrl);
      }

      router.push("/results");
    } catch (error) {
      console.error("Error generating collage:", error);
      clearInterval(interval);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      {isGenerating && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div
            className="bg-green-500 animate-pulse h-1"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <Button
        onClick={handleGenerate}
        variant="default"
        className="cursor-pointer text-white ~px-2/4 ~py-1/2 mr-1 hover:bg-[#009d1a] bg-[#00ac1c] border-t border-[#4dc561] rounded-sm text-nowrap"
        disabled={isGenerating || filteredMovies.length === 0}
      >
        <span className="drop-shadow-md ~text-sm/base font-bold">
          {isGenerating ? (
            <span>
              <Loader className="~w-3/4 ~h-3/4" />
            </span>
          ) : (
            <span className="capitalize">CREATE</span>
          )}
        </span>
      </Button>
    </div>
  );
};

export default GenerateCollage;
