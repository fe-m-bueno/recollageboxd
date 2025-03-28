import DateFilter from "./DateFilter";
import GenerateCollage from "./GenerateCollage";
import ToggleDetails from "./ToggleDetails";
import UndoRedo from "./UndoRedo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import Link from "next/link";
import Logo from "@/public/recollage.svg";

export default function TheNavbar({
  filterDates,
  setFilterDates,
}: {
  filterDates: { start: string; end: string };
  setFilterDates: (dates: { start: string; end: string }) => void;
}) {
  return (
    <div className="flex flex-row items-center justify-between md:justify-center gap-4 md:gap-12 py-8">
      <Link href="/">
        <Logo className="~w-[3rem]/[6rem] h-auto fill-current" />
      </Link>
      <UndoRedo />
      <div className="md:flex hidden gap-2">
        <ToggleDetails />
        <DateFilter filterDates={filterDates} setFilterDates={setFilterDates} />
      </div>
      <div className="md:hidden flex gap-2">
        <Popover>
          <PopoverTrigger>
            <button className="flex items-center gap-2 bg-transparent hover:bg-white/5 border border-gray-600/50 ~px-2/4 ~py-1/2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="bg-[#14181c] border-gray-600/50">
            <div className="flex flex-col gap-4 items-center justify-center">
              <ToggleDetails />
              <DateFilter
                filterDates={filterDates}
                setFilterDates={setFilterDates}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <GenerateCollage filterDates={filterDates} />
    </div>
  );
}
