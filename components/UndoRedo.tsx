"use client";
import React, { useContext } from "react";
import { CollageContext } from "@/context/CollageContext";
import { Button } from "@/components/ui/button";
import { Undo } from "lucide-react";

const UndoRedo = () => {
  const { undo, canUndo } = useContext(CollageContext);
  return (
    <Button
      onClick={undo}
      disabled={!canUndo}
      className="cursor-pointer text-white ~px-2/4 ~py-1/2 mr-1 hover:bg-[#ee6f00ec] bg-[#ee7000] border-t border-[#f39b4d] rounded-sm text-nowrap"
    >
      <Undo className="~w-3/4 ~h-3/4" strokeWidth={3} />
      <span className="capitalize font-bold">UNDO</span>
    </Button>
  );
};

export default UndoRedo;
