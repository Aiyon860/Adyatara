"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronDown,
  Music,
} from "lucide-react";
import { useAudioStore } from "@/hooks/use-audio-store";
import { cn } from "@/lib/utils";

// Hydration-safe mounted check
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
}

/**
 * Fixed bottom audio player bar - Spotify-style layout
 * Hidden when user is on /game route
 */
export function AudioPlayer() {
  const pathname = usePathname();
  const isGameRoute = pathname?.startsWith("/game");
  const isMounted = useIsMounted();

  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    isMinimized,
    togglePlay,
    next,
    prev,
    seekTo,
    setVolume,
    setIsMinimized,
  } = useAudioStore();

  // Don't render during SSR or before hydration
  if (!isMounted) {
    return null;
  }

  // Hide player on game route
  if (isGameRoute) {
    return null;
  }

  // Don't render until we have a song
  if (!currentSong) {
    return null;
  }

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Toggle button - shown when minimized */}
      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-4 right-4 z-50 bg-[#0A0705]/95 border border-gray-800 p-3 backdrop-blur-sm hover:border-[#D96B4A]/60 transition-colors group"
        >
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-gray-700/50 group-hover:border-[#D96B4A]/60" />
          <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-gray-700/50 group-hover:border-[#D96B4A]/60" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-gray-700/50 group-hover:border-[#D96B4A]/60" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-gray-700/50 group-hover:border-[#D96B4A]/60" />

          <Music
            className={cn(
              "w-5 h-5",
              isPlaying ? "text-[#D96B4A]" : "text-gray-400",
            )}
          />
        </button>
      )}

      {/* Full player bar - Spotify-style layout */}
      {!isMinimized && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0705]/95 border-t border-gray-800 backdrop-blur-sm">
          {/* Corner brackets */}
          <div className="absolute -top-px left-0 w-3 h-3 border-l border-t border-gray-700/50" />
          <div className="absolute -top-px right-0 w-3 h-3 border-r border-t border-gray-700/50" />

          {/* Mobile: vertical stack layout (< md) */}
          <div className="md:hidden flex flex-col p-3 space-y-3">
            {/* Row 1: Controls + Info + Volume */}
            <div className="flex items-center gap-2">
              {/* Controls (left) */}
              <div className="flex items-center gap-1">
                <button
                  onClick={prev}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="bg-[#D96B4A] hover:bg-[#E8724A] text-white p-2 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" fill="currentColor" />
                  ) : (
                    <Play className="w-4 h-4" fill="currentColor" />
                  )}
                </button>

                <button
                  onClick={next}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Song info (center) */}
              <div className="flex items-center gap-2 min-w-0 flex-1 px-1">
                <div className="shrink-0 w-8 h-8 bg-[#0D0907] border border-gray-800/80 flex items-center justify-center">
                  <Music className="w-4 h-4 text-[#D96B4A]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-medium text-xs truncate">
                    {currentSong.title}
                  </h3>
                  <p className="text-gray-500 text-[10px]">
                    {currentSong.region}
                  </p>
                </div>
              </div>

              {/* Volume + Minimize (right) */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  {volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-gray-500 hover:text-[#D96B4A] transition-colors p-1"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Row 2: Progress bar + Time */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-gray-500 w-8">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => seekTo(Number(e.target.value))}
                className="flex-1 h-1.5 appearance-none cursor-pointer rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-[#D96B4A] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:bg-[#D96B4A] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                style={{
                  background: `linear-gradient(to right, #D96B4A ${progress}%, rgb(31 41 55 / 0.8) ${progress}%)`,
                }}
              />
              <span className="text-[9px] text-gray-500 w-8 text-right">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Desktop: Spotify-style horizontal layout (md+) */}
          <div className="hidden md:flex items-center justify-between h-24 px-6">
            {/* Left: Song info */}
            <div className="flex items-center gap-4 min-w-0 flex-1 max-w-[30%]">
              <div className="shrink-0 w-14 h-14 bg-[#0D0907] border border-gray-800/80 flex items-center justify-center">
                <Music className="w-7 h-7 text-[#D96B4A]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-white font-medium text-sm truncate">
                  {currentSong.title}
                </h3>
                <p className="text-gray-500 text-xs">
                  {currentSong.region}
                </p>
              </div>
            </div>

            {/* Center: Controls + Progress bar - perfectly centered */}
            <div className="flex flex-col items-center justify-center flex-1 max-w-[40%]">
              {/* Playback controls */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={prev}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={togglePlay}
                  className="bg-[#D96B4A] hover:bg-[#E8724A] text-white p-3 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" fill="currentColor" />
                  ) : (
                    <Play className="w-5 h-5" fill="currentColor" />
                  )}
                </button>

                <button
                  onClick={next}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full flex items-center gap-2">
                <span className="text-[10px] text-gray-500 w-10 text-right">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => seekTo(Number(e.target.value))}
                  className="flex-1 h-1.5 appearance-none cursor-pointer rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#D96B4A] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-[#D96B4A] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  style={{
                    background: `linear-gradient(to right, #D96B4A ${progress}%, rgb(31 41 55 / 0.8) ${progress}%)`,
                  }}
                />
                <span className="text-[10px] text-gray-500 w-10">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right: Volume + Minimize */}
            <div className="flex items-center gap-3 flex-1 max-w-[30%] justify-end">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={(e) => setVolume(Number(e.target.value) / 100)}
                  className="w-20 h-1.5 appearance-none cursor-pointer rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#D96B4A] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-[#D96B4A] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  style={{
                    background: `linear-gradient(to right, #D96B4A ${volume * 100}%, rgb(31 41 55 / 0.8) ${volume * 100}%)`,
                  }}
                />
              </div>

              <button
                onClick={() => setIsMinimized(true)}
                className="text-gray-500 hover:text-[#D96B4A] transition-colors p-2"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
