"use client";
import React, { useState, useContext } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal, CircleEllipsis } from "lucide-react";
import MovieModal from "./MovieModal";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CollageContext } from "@/context/CollageContext";
import TitleStars from "./TitleStars";

interface MovieCardProps {
  movie: any;
  index: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: movie.id,
    });
  const [showModal, setShowModal] = useState(false);
  const { replacementTarget } = useContext(CollageContext);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function decodeHTMLEntities(text: string): string {
    return text.replace(/&#(\d+);/g, (_, dec) =>
      String.fromCharCode(Number(dec))
    );
  }

  return (
    <div
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      title={`${movie.filmTitle} - ${movie.filmYear}`}
      className={`rounded-xl relative ~w-[6rem]/[15rem] ~h-[9rem]/[22.5rem] ${
        replacementTarget === movie.id ? "animate-pulse ring ring-blue-400" : ""
      }`}
    >
      <div
        onClick={() => setShowModal(true)}
        aria-label="Options"
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setShowModal(true)}
      >
        <div
          className={
            movie.displayMovieName || movie.displayRating
              ? "bg-gradient-to-b from-black/90 via-black/15 rounded-xl"
              : ""
          }
        >
          <div className="relative">
            <AspectRatio ratio={2 / 3} className="rounded-xl overflow-hidden">
              <Image
                src={movie.imageUrl ? movie.imageUrl : "/black-placeholder.png"}
                alt={movie.title || "Placeholder"}
                className="object-cover w-full h-full"
                width={500}
                height={1000}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/error.png";
                }}
              />
            </AspectRatio>
            <div className="absolute top-0 left-0 w-full h-3/4 bg-gradient-to-b from-black/90 via-black/15 rounded-t-xl">
              <div className="absolute top-2 left-0 w-full pl-2">
                {movie.displayMovieName && (
                  <h3 className="mt-1 text-xs font-bold text-white drop-shadow-lg">
                    {decodeHTMLEntities(movie.filmTitle)}
                  </h3>
                )}
                {movie.displayRating && movie.memberRating && (
                  <TitleStars rating={movie.memberRating} />
                )}
                <div className="absolute top-12 right-2 flex justify-center">
                  <CircleEllipsis size={20} color="#fff" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 pt-6 flex justify-center cursor-move bg-gradient-to-t from-black/60 via-black/25 rounded-b-xl"
        {...listeners}
      >
        <GripHorizontal size={30} color="#fff" />
      </div>
      {showModal && (
        <MovieModal movie={movie} closeModal={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default MovieCard;
