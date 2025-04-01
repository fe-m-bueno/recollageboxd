"use client";
import { useContext, useEffect, useState } from "react";
import { CollageContext } from "@/context/CollageContext";
import MovieCard from "./MovieCard";
import SpareMovieCard from "./SpareMovieCard";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "./ui/button";

interface MovieGridProps {
  filterDates: { start: string; end: string };
}

const MovieGrid: React.FC<MovieGridProps> = ({ filterDates }) => {
  const {
    state,
    updateMovies,
    swapMovieWithSpare,
    replacementTarget,
    setReplacementTarget,
    previousScroll,
    setPreviousScroll,
  } = useContext(CollageContext);
  const { movies, settings, spareMovies } = state;
  const router = useRouter();

  useEffect(() => {
    if (!movies.length) {
      router.push("/");
    }
  }, [movies, router]);

  const filteredMovies = movies.filter((movie: any) => {
    if (movie.forceShow) return true;
    const pubDate = new Date(movie.pubDate);
    const start = new Date(filterDates.start);
    const end = new Date(filterDates.end);
    return pubDate >= start && pubDate <= end;
  });

  const displayedMovies =
    replacementTarget !== null ? filteredMovies : filteredMovies;

  const defaultColumns =
    settings.gridSize === "5x10"
      ? 5
      : settings.gridSize === "4"
      ? 2
      : parseInt(settings.gridSize.split("x")[0]);

  const [computedColumns, setComputedColumns] =
    useState<number>(defaultColumns);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newColumns = defaultColumns;
      if (settings.gridSize === "4x4") {
        newColumns = width < 800 ? 2 : 4;
      } else if (settings.gridSize === "5x10") {
        if (width < 730) newColumns = 3;
        else if (width < 1200) newColumns = 5;
        else newColumns = 5;
      } else if (settings.gridSize === "5x5") {
        newColumns = width < 1000 ? 2 : 5;
      } else if (settings.gridSize === "4") {
        newColumns = width < 800 ? 2 : 2;
      } else {
        newColumns = defaultColumns;
      }
      setComputedColumns(newColumns);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [settings.gridSize, defaultColumns]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = movies.findIndex((m: any) => m.id === active.id);
      const newIndex = movies.findIndex((m: any) => m.id === over.id);
      const newMovies = arrayMove(movies, oldIndex, newIndex);
      updateMovies(newMovies);
    }
  };

  const handleCancelReplacement = () => {
    setReplacementTarget(null);
    if (previousScroll !== null) {
      window.scrollTo({ top: previousScroll, behavior: "smooth" });
      setPreviousScroll(null);
    }
  };

  return (
    <div className="w-fit h-fit">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="w-fit h-fit mx-auto" style={{ touchAction: "none" }}>
          <SortableContext
            items={movies.map((m: any) => m.id)}
            strategy={rectSortingStrategy}
          >
            {displayedMovies.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">
                  No movies found during the selected period, try changing the
                  date range.
                </p>
              </div>
            )}
            <div
              className="grid gap-2 w-fit h-fit place-items-center"
              style={{
                gridTemplateColumns: `repeat(${computedColumns}, minmax(6rem, max-content))`,
              }}
            >
              {displayedMovies.map((movie: any, index: number) => (
                <div
                  key={movie.id}
                  className="flex items-center justify-center"
                >
                  <MovieCard movie={movie} index={index} />
                </div>
              ))}
            </div>
          </SortableContext>
        </div>
        {displayedMovies.length !== 0 && (
          <section id="spare" className="mt-4 flex flex-col items-center">
            {replacementTarget ? (
              <Button
                variant="destructive"
                onClick={handleCancelReplacement}
                className="mb-4 mt-2 w-full sm:w-auto hover:bg-[#9d0000] bg-[#ac0000] border-t border-[#c54d4d] text-white hover:text-white"
              >
                Cancel replacement
              </Button>
            ) : (
              <h2 className="text-lg font-bold p-4">Backup movies</h2>
            )}
            <div className="flex flex-wrap justify-evenly gap-2 pt-2 mb-4 md:max-w-[48rem] sm:max-w-[24rem]">
              {spareMovies.map((movie: any) => (
                <div
                  key={movie.id}
                  title={movie.title}
                  className={`w-[4rem] h-[6rem] rounded-lg ${
                    replacementTarget
                      ? "cursor-pointer transition ring ring-blue-600 dark:ring-blue-400 animate-pulse"
                      : "ring-2 ring-gray-800"
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (replacementTarget) {
                      swapMovieWithSpare(movie.id);
                      if (previousScroll !== null) {
                        window.scrollTo({
                          top: previousScroll,
                          behavior: "smooth",
                        });
                        setPreviousScroll(null);
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (replacementTarget) {
                        swapMovieWithSpare(movie.id);
                        if (previousScroll !== null) {
                          window.scrollTo({
                            top: previousScroll,
                            behavior: "smooth",
                          });
                          setPreviousScroll(null);
                        }
                      }
                    }
                  }}
                >
                  <SpareMovieCard movie={movie} />
                </div>
              ))}
            </div>
          </section>
        )}
      </DndContext>
    </div>
  );
};

export default MovieGrid;
