"use client";

import { Suspense } from "react";
import { AdyataraPlayer } from "@/components/game/adyatara-player";

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0705] flex items-center justify-center" />
      }
    >
      <AdyataraPlayer />
    </Suspense>
  );
}
