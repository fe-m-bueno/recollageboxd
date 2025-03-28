"use client";

import Image from "next/image";

interface StarsProps {
  rating?: number;
}

export default function Stars({ rating = 0 }: StarsProps) {
  const fillPercentage = (rating / 5) * 100;

  return (
    <div className="relative w-[110px] h-[20px] filter grayscale contrast-100 saturate-100">
      <Image
        src="/stars.png"
        alt="Empty stars"
        width={50}
        height={10}
        className="absolute inset-0 w-auto h-auto"
      />

      <Image
        src="/stars-filled.png"
        alt="Filled stars"
        width={50}
        height={10}
        className="absolute inset-0 w-auto h-auto"
        style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}
      />
    </div>
  );
}
