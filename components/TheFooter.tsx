"use client";
import React from "react";
import Link from "next/link";

const TheFooter: React.FC = () => {
  return (
    <footer className="flex flex-row flex-grow-0 justify-center items-center text-center w-screen my-4">
      <div className="flex justify-center items-center space-x-4">
        <p className="~w-50%/100% ~text-[0.8rem]/sm">
          &copy; 2025 -{" "}
          <Link
            href="https://felipe-bueno.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Felipe Bueno
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default TheFooter;
