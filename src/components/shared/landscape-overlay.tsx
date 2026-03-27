"use client";

import { useEffect, useState } from "react";
import { Monitor, RotateCcw } from "lucide-react";

/**
 * Overlay that recommends desktop for the best visual novel experience.
 * Triggers on touch devices with viewport width < 1024px in portrait mode.
 * Desktop/laptops are never affected. Users can dismiss to continue on mobile.
 */
export function LandscapeOverlay() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = () => {
      if (dismissed) {
        setShow(false);
        return;
      }
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 1024;
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      setShow(isTouchDevice && isSmallScreen && isPortrait);
    };

    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, [dismissed]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-100 bg-[#0A0705] flex flex-col items-center justify-center text-center px-10 select-none">
      {/* Decorative background lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[12%] left-[8%] w-px h-36 bg-[#D96B4A] opacity-[0.04]" />
        <div className="absolute top-[12%] left-[8%] w-36 h-px bg-[#D96B4A] opacity-[0.04]" />
        <div className="absolute bottom-[12%] right-[8%] w-px h-36 bg-[#D96B4A] opacity-[0.04]" />
        <div className="absolute bottom-[12%] right-[8%] w-36 h-px bg-[#D96B4A] opacity-[0.04]" />
        <div className="absolute top-[50%] left-[6%] w-px h-16 bg-[#D96B4A] opacity-[0.03]" />
        <div className="absolute top-[50%] right-[6%] w-px h-16 bg-[#D96B4A] opacity-[0.03]" />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#D96B4A]/6 blur-3xl pointer-events-none" />

      {/* Decorative dots */}
      <div className="absolute top-[22%] left-[18%] w-1 h-1 rounded-full bg-[#D96B4A] opacity-20 shadow-[0_0_6px_2px_#D96B4A]" />
      <div className="absolute top-[35%] right-[14%] w-1 h-1 rounded-full bg-[#D96B4A] opacity-15 shadow-[0_0_6px_2px_#D96B4A]" />
      <div className="absolute bottom-[28%] left-[12%] w-1 h-1 rounded-full bg-[#D96B4A] opacity-10 shadow-[0_0_6px_2px_#D96B4A]" />

      {/* Monitor icon with framed box */}
      <div className="relative mb-9">
        <div className="relative p-7 border border-gray-800/50">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-[#D96B4A]/35" />
          <div className="absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 border-[#D96B4A]/35" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 border-[#D96B4A]/35" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 border-[#D96B4A]/35" />

          {/* Icon */}
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-[#D96B4A]/20 scale-150 rounded-full" />
            <Monitor
              className="relative w-14 h-14 text-[#D96B4A] animate-pulse"
              strokeWidth={1.25}
            />
          </div>
        </div>
      </div>

      {/* Eyebrow label */}
      <div className="flex items-center gap-4 mb-5">
        <div className="h-px w-10 bg-[#D96B4A]/20" />
        <p className="text-[9px] tracking-[0.35em] text-[#D96B4A] uppercase font-medium">
          REKOMENDASI PERANGKAT
        </p>
        <div className="h-px w-10 bg-[#D96B4A]/20" />
      </div>

      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-serif text-[#F5F0EB] mb-4 leading-snug tracking-wide">
        Untuk Pengalaman Terbaik,
        <br />
        <span className="text-white">Gunakan Desktop</span>
      </h2>

      {/* Description */}
      <p className="text-[13px] text-gray-500 font-light max-w-67.5 leading-relaxed mb-9">
        Visual novel Adyatara dirancang untuk layar yang lebih luas. Buka di{" "}
        <span className="text-[#9A8A7A] font-normal">
          PC, laptop, atau komputer
        </span>{" "}
        agar setiap detail cerita dan visual dapat dinikmati secara penuh.
      </p>

      {/* Separator */}
      <div className="w-full max-w-50 h-px bg-linear-to-r from-transparent via-gray-800 to-transparent mb-7" />

      {/* Landscape alternative */}
      <div className="flex items-center gap-2.5 mb-9 text-gray-700">
        <RotateCcw className="w-3.5 h-3.5 shrink-0" />
        <p className="text-[11px] leading-snug">
          Atau putar perangkat ke{" "}
          <span className="text-gray-500">mode landscape</span>
        </p>
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        className="group flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-gray-700 hover:text-gray-400 transition-colors duration-300 font-medium"
      >
        <span>Tetap lanjutkan di sini</span>
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
          →
        </span>
      </button>
    </div>
  );
}
