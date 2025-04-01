import Features from "@/components/Features";
import TheFooter from "@/components/TheFooter";
import UserInput from "@/components/UserInput";
import Logo from "@/public/recollage.svg";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "Gatekeep your Hidden Gems",
      sub: "Keep your guilty pleasures a secret",
      content:
        "Hide movies from your collage to keep your cinema taste mysterious.",
      image: "gatekeep",
    },
    {
      title: "Want to show off the old you?",
      sub: "Your backup movies got you covered",
      content: "Easily swap it for another movie from your list.",
      image: "spare",
    },
    {
      title: "Move Posters Freely",
      sub: "No More Fixed Grids",
      content:
        "Manually reorder your collage – highlight your favorites however you want.",
      image: "move",
    },
    {
      title: "Customize Your Posters",
      sub: "Choose your posters, just like a pro",
      content:
        "Select from multiple poster options and truly reflect your personal taste.",
      image: "customize",
    },
  ];

  return (
    <div className="relative h-screen flex flex-col items-center justify-between pt-32">
      <Link
        href="https://recollagefm.vercel.app"
        className="absolute top-4 right-4 animate-pulse group inline-flex items-center gap-1"
      >
        <span className="group-hover:underline">
          Check out the Last.fm Recollage
        </span>
        <ArrowUpRight className="group-hover:translate-x-1 transition group-hover:-translate-y-1" />
      </Link>
      <div>
        <Logo className="~w-[16rem]/[36rem] h-auto fill-current pb-4 px-2" />
      </div>
      <div className="bg-white/5 backdrop-blur-md border-t border-[#b2bdc8]/20 w-fit h-fit p-4 flex flex-col gap-2 items-center justify-center rounded-sm text-white ~text-xs/base relative mx-auto">
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-ping"></div>
        <span>Only works with diary entries, with a limit of 50 movies.</span>
        <span className="~text-xs/base">
          This app is not affiliated with Letterboxd. All rights belong to them.
        </span>
      </div>
      <UserInput />
      <div className="flex flex-wrap justify-between items-center min-w-96 gap-6 px-4 mt-4">
        {features.map((f, index) => (
          <Features
            key={index}
            title={f.title}
            content={f.content}
            sub={f.sub}
            image={f.image}
          />
        ))}
      </div>
      <TheFooter />
    </div>
  );
}
