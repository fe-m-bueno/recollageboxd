"use client";
import React, { createContext, useState, useEffect } from "react";

interface Settings {
  username: string;
  timespan: string;
  gridSize: string;
  displayMovieName: boolean;
  displayRating: boolean;
}

interface CollageState {
  settings: Settings;
  movies: any[];
  spareMovies: any[];
}

interface CollageContextProps {
  state: CollageState;
  updateSettings: (settings: Settings) => void;
  setMovies: (movies: any[]) => void;
  setSpareMovies: (movies: any[]) => void;
  updateMovies: (movies: any[]) => void;
  toggleMovieOption: (movieId: string, option: string) => void;
  deleteMovie: (movieId: string) => void;
  undo: () => void;
  canUndo: boolean;
  replacementTarget: string | null;
  setReplacementTarget: (movieId: string | null) => void;
  swapMovieWithSpare: (spareMovieId: string) => void;
  previousScroll: number | null;
  setPreviousScroll: (value: number | null) => void;
}

export const CollageContext = createContext<CollageContextProps>(
  {} as CollageContextProps
);

export const CollageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<CollageState>({
    settings: {
      username: "",
      timespan: "7day",
      gridSize: "3x3",
      displayMovieName: true,
      displayRating: true,
    },
    movies: [],
    spareMovies: [],
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedState = sessionStorage.getItem("collageState");
      if (storedState) {
        setState(JSON.parse(storedState));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("collageState", JSON.stringify(state));
    }
  }, [state]);

  const [previousScroll, setPreviousScroll] = useState<number | null>(null);
  const [history, setHistory] = useState<[any[], any[]][]>([]);
  const [future, setFuture] = useState<[any[], any[]][]>([]);

  const pushSnapshot = (movies: any[], spareMovies: any[]) => {
    const snapshot: [any[], any[]] = [
      JSON.parse(JSON.stringify(movies)),
      JSON.parse(JSON.stringify(spareMovies)),
    ];
    setHistory((prevHistory) => {
      if (prevHistory.length > 0) {
        const lastSnapshot = prevHistory[prevHistory.length - 1];
        if (JSON.stringify(lastSnapshot) === JSON.stringify(snapshot)) {
          return prevHistory;
        }
      }
      return [...prevHistory, snapshot];
    });
  };

  const updateSettings = (settings: Settings) => {
    setState((prev) => ({ ...prev, settings }));
  };

  const setMovies = (movies: any[]) => {
    setHistory([]);
    setFuture([]);
    setState((prev) => ({ ...prev, movies }));
  };

  const setSpareMovies = (movies: any[]) => {
    setState((prev) => ({ ...prev, spareMovies: movies }));
  };

  const updateState = (newMovies: any[], newSpares: any[]) => {
    setState((prevState) => {
      pushSnapshot(prevState.movies, prevState.spareMovies);
      setFuture([]);
      return { ...prevState, movies: newMovies, spareMovies: newSpares };
    });
  };

  const updateMovies = (movies: any[]) => {
    setState((prevState) => {
      pushSnapshot(prevState.movies, prevState.spareMovies);
      setFuture([]);
      return { ...prevState, movies };
    });
  };

  const toggleMovieOption = (movieId: string, option: string) => {
    setState((prevState) => {
      pushSnapshot(prevState.movies, prevState.spareMovies);
      setFuture([]);
      const newMovies = prevState.movies.map((movie) =>
        movie.id === movieId ? { ...movie, [option]: !movie[option] } : movie
      );
      return { ...prevState, movies: newMovies };
    });
  };

  const deleteMovie = (movieId: string) => {
    setState((prevState) => {
      pushSnapshot(prevState.movies, prevState.spareMovies);
      setFuture([]);
      const movieIndex = prevState.movies.findIndex(
        (movie) => movie.id === movieId
      );
      if (movieIndex !== -1) {
        const newMovies = [...prevState.movies];
        const deletedMovie = newMovies[movieIndex];
        if (prevState.spareMovies.length > 0) {
          const [firstSpare, ...remainingSpares] = prevState.spareMovies;
          newMovies.splice(movieIndex, 1, firstSpare);
          const newSpares = [...remainingSpares, deletedMovie];
          return { ...prevState, movies: newMovies, spareMovies: newSpares };
        } else {
          newMovies.splice(movieIndex, 1);
          return { ...prevState, movies: newMovies };
        }
      }
      return prevState;
    });
  };

  const undo = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;
      const previous = prevHistory[prevHistory.length - 1];
      setState((prevState) => {
        setFuture((prevFuture) => [
          [prevState.movies, prevState.spareMovies],
          ...prevFuture,
        ]);
        return { ...prevState, movies: previous[0], spareMovies: previous[1] };
      });
      return prevHistory.slice(0, -1);
    });
  };

  const canUndo = history.length > 0;
  const [replacementTarget, setReplacementTarget] = useState<string | null>(
    null
  );

  const swapMovieWithSpare = (spareMovieId: string) => {
    if (!replacementTarget) return;
    const mainIndex = state.movies.findIndex(
      (movie) => movie.id === replacementTarget
    );
    if (mainIndex === -1) return;
    const spareIndex = state.spareMovies.findIndex(
      (movie) => movie.id === spareMovieId
    );
    if (spareIndex === -1) return;

    const mainMovie = state.movies[mainIndex];
    const spareMovie = state.spareMovies[spareIndex];

    const newSpareMovie = { ...spareMovie, forceShow: true };

    const newMainMovies = [...state.movies];
    newMainMovies[mainIndex] = newSpareMovie;
    const newSpareMovies = [...state.spareMovies];
    newSpareMovies[spareIndex] = mainMovie;

    updateState(newMainMovies, newSpareMovies);
    setReplacementTarget(null);
  };

  return (
    <CollageContext.Provider
      value={{
        state,
        updateSettings,
        setMovies,
        setSpareMovies,
        updateMovies,
        toggleMovieOption,
        deleteMovie,
        undo,
        canUndo,
        replacementTarget,
        setReplacementTarget,
        swapMovieWithSpare,
        previousScroll,
        setPreviousScroll,
      }}
    >
      {children}
    </CollageContext.Provider>
  );
};

export default CollageProvider;
