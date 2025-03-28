"use client";
import React, { useState } from "react";
import Image from "next/image";

interface SpareMovieCardProps {
  movie: Movie;
}

interface Movie {
  title: string;
  filmTitle: string;
  filmYear: string;
  memberRating: string;
  tmdbMovieId: string;
  poster: string;
  link: string;
  pubDate: string;
}

const SpareMovieCard: React.FC<SpareMovieCardProps> = ({ movie }) => {
  return (
    <div className="relative w-full h-full">
      <img
        src={movie.poster}
        alt={movie.title || "Placeholder"}
        width={300}
        height={300}
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
  );
};

export default SpareMovieCard;
