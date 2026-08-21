"use client";

import React from "react";

export default function ObjectiveSkeletonGrid() {
  return (
    <div className="grid w-full grid-cols-1 gap-6 items-start md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-80 w-full animate-pulse rounded-2xl border border-[#1C1924] bg-linear-to-b from-[#15101B] via-[#0D0D10] to-[#09090B] p-5 shadow-2xl"
        />
      ))}
    </div>
  );
}