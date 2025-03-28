"use client";
import {
  EyeOff,
  Lock,
  DoorClosed,
  RefreshCcw,
  Layers,
  History,
  LayoutGrid,
  Move,
  Settings2,
  Images,
  Clapperboard,
  ScanEye,
} from "lucide-react";
import { useEffect, useState } from "react";
const Features = ({
  title,
  sub,
  content,
  image,
}: {
  title: string;
  sub?: string;
  content: string;
  image?: string;
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1300);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={` text-center transition flex flex-col items-center bg-black/5 rounded-3xl shadow-lg hover:transform hover:-translate-y-3 backdrop-blur-sm ${
        isMobile
          ? "w-full h-auto justify-center py-4 px-4 gap-4"
          : "~w-20/80 ~h-20/80 justify-between py-8 px-4 m-4 "
      }`}
    >
      <div className="bg-gradient-to-r from-[#8899aa] to-[#b2bdc8] text-transparent bg-clip-text">
        <h2 className="~text-sm/3xl font-bold">{title}</h2>
      </div>
      <div>
        <p className="~text-xs/md font-semibold dark:text-blue-400">{sub}</p>
      </div>
      <div>
        {image === "gatekeep" && (
          <div className="flex flex-row justify-around items-center gap-3 text-[#ee7000] dark:text-white">
            <EyeOff className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
            <Lock className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
            <DoorClosed className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
          </div>
        )}
        {image === "spare" && (
          <div className="flex flex-row justify-around items-center gap-3 text-[#ee7000] dark:text-white">
            <RefreshCcw className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
            <Layers className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
            <History className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
          </div>
        )}
        {image === "move" && (
          <div className="flex flex-row justify-around items-center gap-1 text-[#ee7000]  dark:text-white">
            <Move className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
            <Settings2 className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
            <LayoutGrid className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
          </div>
        )}
        {image === "customize" && (
          <div className="flex flex-row justify-around items-center gap-1 text-[#ee7000]  dark:text-white">
            <Images className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
            <Clapperboard className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
            <ScanEye className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
          </div>
        )}
      </div>

      <p className="~text-[0.8rem]/sm">{content}</p>
    </div>
  );
};

export default Features;
