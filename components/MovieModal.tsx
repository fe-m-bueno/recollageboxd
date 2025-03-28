"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";
import CustomCheckbox from "./CustomCheckbox";
import { CollageContext } from "@/context/CollageContext";
import { Skeleton } from "./ui/skeleton";

interface MovieModalProps {
  movie: any;
  closeModal: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, closeModal }) => {
  const {
    state,
    updateMovies,
    toggleMovieOption,
    setReplacementTarget,
    setPreviousScroll,
  } = useContext(CollageContext);
  const [posters, setPosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPosters() {
      setLoading(true);
      try {
        const res = await fetch(`/api/tmdb?tmdbMovieId=${movie.tmdbMovieId}`);
        const data = await res.json();
        setPosters(data.posters || []);
      } catch (error) {
        console.error("Error fetching posters", error);
      }
      setLoading(false);
    }
    if (movie.tmdbMovieId) {
      fetchPosters();
    }
  }, [movie.tmdbMovieId]);

  const handleSelectPoster = (poster: any) => {
    const newPosterUrl = `https://image.tmdb.org/t/p/w300${poster.file_path}`;
    const updatedMovies = state.movies.map((m: any) =>
      m.id === movie.id ? { ...m, imageUrl: newPosterUrl } : m
    );
    updateMovies(updatedMovies);
    closeModal();
  };

  const handleToggleDisplayOption = (
    option: "displayMovieName" | "displayRating"
  ) => {
    toggleMovieOption(movie.id, option);
  };

  const handleReplacement = () => {
    setReplacementTarget(movie.id);
    setPreviousScroll(window.scrollY);
    const spareSection = document.getElementById("spare");
    if (spareSection) {
      spareSection.scrollIntoView({ behavior: "smooth" });
    }
    closeModal();
  };

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className="max-w-[90vw] sm:max-w-[80vw] md:max-w-[50vw] lg:max-w-[25vw] mx-auto bg-[#14181c] border-gray-600/50 text-[#99aabb]">
        <DialogHeader>
          <DialogTitle>Movie Options</DialogTitle>
          <DialogDescription>
            Configure the display options and replace the poster of the movie "
            {movie.filmTitle}"
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h4 className="font-bold mb-2">Display Options</h4>
            <div className="space-y-2">
              <CustomCheckbox
                label="Display Movie Name"
                checked={movie.displayMovieName}
                onChange={() => handleToggleDisplayOption("displayMovieName")}
              />
              <CustomCheckbox
                label="Display Rating"
                checked={movie.displayRating}
                onChange={() => handleToggleDisplayOption("displayRating")}
              />
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-2">Replace Poster</h4>
            {loading ? (
              <div className="flex flex-col items-center justify-center">
                <div className="grid grid-cols-2 gap-4 min-h-[30vh] max-h-96 overflow-y-auto w-full">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <Skeleton key={index} className="aspect-[2/3] w-full" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 min-h-[30vh] max-h-96 overflow-y-auto w-full">
                {posters.map((poster, index) => (
                  <div
                    key={index}
                    className="cursor-pointer aspect-[2/3] w-full shadow-sm border-gray-600/70 border rounded-sm"
                    onClick={() => handleSelectPoster(poster)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSelectPoster(poster)
                    }
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                      alt={`Poster ${index + 1}`}
                      width={500}
                      height={750}
                      className="rounded w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row justify-between gap-4">
          <Button
            variant="default"
            onClick={handleReplacement}
            className="w-full sm:w-auto hover:bg-[#009d1a] bg-[#00ac1c] border-t border-[#4dc561] text-white hover:text-white"
          >
            Choose replacement
          </Button>
          <Button
            variant="destructive"
            onClick={closeModal}
            className="w-full sm:w-auto hover:bg-[#9d0000] bg-[#ac0000] border-t border-[#c54d4d] text-white hover:text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MovieModal;
