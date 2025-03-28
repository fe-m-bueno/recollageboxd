"use client";
import React, { useContext, useState, useEffect } from "react";
import { CollageContext } from "@/context/CollageContext";
import MovieGrid from "@/components/MovieGrid";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import TheNavbar from "@/components/TheNavbar";

import Link from "next/link";

export default function MoviesPage() {
  const { state, updateMovies } = useContext(CollageContext);
  const { movies, settings } = state;

  const [filterDates, setFilterDates] = useState<{
    start: string;
    end: string;
  }>({ start: "", end: "" });

  useEffect(() => {
    const today = new Date();
    let defaultDays = 7;
    switch (settings.timespan) {
      case "7day":
        defaultDays = 7;
        break;
      case "1month":
        defaultDays = 30;
        break;
      case "3month":
        defaultDays = 90;
        break;
      case "6month":
        defaultDays = 180;
        break;
      case "12month":
        defaultDays = 365;
        break;
      case "overall":
        defaultDays = 10000;
        break;
      default:
        defaultDays = 7;
    }
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - defaultDays);
    setFilterDates({
      start: pastDate.toISOString().split("T")[0],
      end: today.toISOString().split("T")[0],
    });
  }, [settings.timespan]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(MouseSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = movies.findIndex((m: any) => m.id === active.id);
    const newIndex = movies.findIndex((m: any) => m.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      const newMovies = arrayMove(movies, oldIndex, newIndex);
      updateMovies(newMovies);
    }
  };

  let gridCount = 9;
  if (settings.gridSize === "4x4") gridCount = 16;
  else if (settings.gridSize === "5x5") gridCount = 25;
  else if (settings.gridSize === "5x10") gridCount = 50;
  else if (settings.gridSize === "10x10") gridCount = 100;
  const maxSize = Math.sqrt(gridCount) * 250 + (Math.sqrt(gridCount) - 1) * 16;

  return (
    <div className="min-h-screen">
      <div className="w-screen flex justify-center">
        <div className="w-full px-4 flex flex-row items-center justify-center gap-4 mb-4 bg-[#14181c] z-10">
          <TheNavbar
            filterDates={filterDates}
            setFilterDates={setFilterDates}
          />
        </div>
      </div>

      <div
        className="mx-auto px-4 flex flex-col items-center justify-center"
        style={{
          width: "100%",
          maxWidth: `${maxSize}px`,
          height: "100%",
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={movies.map((m: any) => m.id)}
            strategy={rectSortingStrategy}
          >
            <MovieGrid filterDates={filterDates} />
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
