"use client";
import { useContext } from "react";
import { CollageContext } from "@/context/CollageContext";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "@/components/ui/button";

const ToggleDetails = () => {
  const { state, updateMovies, setSpareMovies } = useContext(CollageContext);

  const movieTitleShown =
    state.movies.length > 0
      ? state.movies.every((movie) => movie.displayMovieName)
      : false;
  const movieScoreShown =
    state.movies.length > 0
      ? state.movies.every((movie) => movie.displayRating)
      : false;

  const toggleMovieTitle = () => {
    const newMovies = state.movies.map((movie) => ({
      ...movie,
      displayMovieName: !movieTitleShown,
    }));
    const newSpareMovies = state.spareMovies.map((movie) => ({
      ...movie,
      displayMovieName: !movieTitleShown,
    }));
    updateMovies(newMovies);
    setSpareMovies(newSpareMovies);
  };

  const toggleMovieScore = () => {
    const newMovies = state.movies.map((movie) => ({
      ...movie,
      displayRating: !movieScoreShown,
    }));
    const newSpareMovies = state.spareMovies.map((movie) => ({
      ...movie,
      displayRating: !movieScoreShown,
    }));
    updateMovies(newMovies);
    setSpareMovies(newSpareMovies);
  };

  return (
    <div className="flex flex-col md:flex-row gap-1 md:gap-4 w-fit">
      <Button
        onClick={toggleMovieTitle}
        variant="ghost"
        className="px-3 py-2 text-[#99aabb] dark:text-slate-100 hover:text-slate-900 hover:bg-white/75 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl transition hover:drop-shadow-sm w-40"
      >
        {movieTitleShown ? (
          <span className="flex flex-row items-center justify-around gap-2">
            <Eye className="w-6 h-6" /> <span>Hide Title</span>
          </span>
        ) : (
          <span className="flex flex-row items-center justify-around gap-2">
            <EyeClosed className="w-6 h-6" /> <span>Show Title</span>
          </span>
        )}
      </Button>
      <Button
        onClick={toggleMovieScore}
        variant="ghost"
        className="px-3 py-2 text-[#99aabb] dark:text-slate-100 hover:text-slate-900 hover:bg-white/75 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl transition hover:drop-shadow-sm w-40"
      >
        {movieScoreShown ? (
          <span className="flex flex-row items-center justify-around gap-2">
            <Eye className="w-6 h-6" /> <span>Hide Score</span>
          </span>
        ) : (
          <span className="flex flex-row items-center justify-around gap-2">
            <EyeClosed className="w-6 h-6" /> <span>Show Score</span>
          </span>
        )}
      </Button>
    </div>
  );
};

export default ToggleDetails;
