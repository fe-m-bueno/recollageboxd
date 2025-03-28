"use client";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CollageContext } from "@/context/CollageContext";
import CustomSelect from "./CustomSelect";
import CustomCheckbox from "./CustomCheckbox";
import { Button } from "@/components/ui/button";

const UserInput = () => {
  const [username, setUsername] = useState("");
  const [timespan, setTimespan] = useState("7day");
  const [gridSize, setGridSize] = useState("3x3");
  const [displayMovieName, setDisplayMovieName] = useState(true);
  const [displayRating, setDisplayRating] = useState(true);
  const [loading, setLoading] = useState(false);
  const { updateSettings, setMovies, setSpareMovies } =
    useContext(CollageContext);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    setLoading(true);
    updateSettings({
      username,
      timespan,
      gridSize,
      displayMovieName,
      displayRating,
    });

    try {
      const res = await fetch(`/api/letterboxd?username=${username}`);
      const data = await res.json();
      let movies = data.films || [];

      movies = movies.map((movie: any, index: number) => ({
        ...movie,
        displayMovieName,
        displayRating,
        imageUrl: movie.poster || "/black-placeholder.png",
        id: `${movie.tmdbMovieId}-${index}`,
      }));

      const gridCount =
        gridSize === "5x10" ? 50 : parseInt(gridSize.split("x")[0]) ** 2;
      const spareCount = 30;
      const mainMovies = movies.slice(0, gridCount);
      const spareMovies = movies.slice(gridCount, gridCount + spareCount);
      setMovies(mainMovies);
      setSpareMovies(spareMovies);
      router.push("/movies");
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 830);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridSizeOptions = [
    { value: "3x3", label: "3x3" },
    { value: "4x4", label: "4x4" },
    { value: "5x5", label: "5x5" },
    { value: "5x10", label: "5x10" },
  ];

  const timespanOptions = [
    { value: "7day", label: "7 days" },
    { value: "1month", label: "1 month" },
    { value: "3month", label: "3 months" },
    { value: "6month", label: "6 months" },
    { value: "12month", label: "12 months" },
    { value: "overall", label: "Overall" },
  ];

  return (
    <form onSubmit={handleSubmit} className="p-6 ~w-[20rem]/[44rem]">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 w-full ~text-[0.7rem]/md">
          <label className="block mb-2 pl-3">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="bg-[#8899aa] border-t border-[#b2bdc8] backdrop-blur-sm focus:outline-none placeholder:text-[#323540] placeholder:~text-sm /[1rem] focus:ring-2 focus:ring-blue-600 w-full px-3 ~py-1/2 rounded text-black"
          />
        </div>

        <div className={`${!isMobile ? "~w-32/36" : "w-full"}`}>
          <CustomSelect
            value={timespan}
            onChange={setTimespan}
            options={timespanOptions}
            labelKey="Timespan"
          />
        </div>
        <div className={`${!isMobile ? "~w-32/36" : "w-full"}`}>
          <CustomSelect
            value={gridSize}
            onChange={setGridSize}
            options={gridSizeOptions}
            labelKey="Grid Size"
          />
        </div>
      </div>
      <div className="flex flex-row justify-start space-x-4 ~text-xs/base">
        <CustomCheckbox
          label="Display Movie Name"
          checked={displayMovieName}
          onChange={() => setDisplayMovieName(!displayMovieName)}
        />
        <CustomCheckbox
          label="Display Rating"
          checked={displayRating}
          onChange={() => setDisplayRating(!displayRating)}
        />
      </div>
      <div className="flex flex-row items-center justify-center  mt-8">
        <Button
          type="submit"
          disabled={loading}
          className="~w-[10rem]/[12rem] hover:bg-[#009d1a] bg-[#00ac1c] border-t-2 border-[#4dc561] rounded-sm text-nowrap text-lg py-6"
        >
          {loading ? "Loading..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default UserInput;
