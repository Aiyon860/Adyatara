"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAudioStore } from "@/hooks/use-audio-store";

/**
 * AudioPlayerProvider manages the actual HTML5 audio element
 * and syncs it with the Zustand store state.
 *
 * Autoplay behaviour:
 *  1. On mount, attempts to autoplay immediately.
 *  2. If the browser blocks autoplay (policy), registers a one-shot listener
 *     on the first user interaction (click / keydown / touchstart) and calls
 *     audio.play() *directly inside that event handler* so it satisfies the
 *     browser's user-gesture requirement.
 *  3. On /game routes the player is paused and the fallback listener is torn down.
 *
 * This provider should wrap the entire app to enable audio playback.
 */
export function AudioPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSongIdRef = useRef<string | null>(null);
  const isAudioReadyRef = useRef(false);
  // Holds the pending interaction-fallback handler so we can remove it later
  const interactionResumeRef = useRef<(() => void) | null>(null);
  const pathname = usePathname();

  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    seekTime,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    clearSeek,
    initialize,
    next,
  } = useAudioStore();

  // ─── Helpers ──────────────────────────────────────────────────────────────

  /** Remove any pending first-interaction autoplay listeners. */
  const clearInteractionListeners = () => {
    const handler = interactionResumeRef.current;
    if (!handler) return;
    document.removeEventListener("click", handler);
    document.removeEventListener("keydown", handler);
    document.removeEventListener("touchstart", handler);
    interactionResumeRef.current = null;
  };

  // ─── Initialize + attempt autoplay on mount ────────────────────────────────

  useEffect(() => {
    initialize();
    // Optimistically set isPlaying; the play/pause sync effect will do the
    // actual audio.play() call and handle fallback if autoplay is blocked.
    setIsPlaying(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Pause on /game route ──────────────────────────────────────────────────

  const isGameRoute = pathname?.startsWith("/game");

  useEffect(() => {
    if (isGameRoute && isPlaying) {
      setIsPlaying(false);
    }
  }, [isGameRoute, isPlaying, setIsPlaying]);

  // ─── Handle seek requests ──────────────────────────────────────────────────

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || seekTime === null) return;
    audio.currentTime = seekTime;
    clearSeek();
  }, [seekTime, clearSeek]);

  // ─── Sync audio element with current song ─────────────────────────────────

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    // Only reload when the song actually changes
    if (currentSongIdRef.current !== currentSong.id) {
      currentSongIdRef.current = currentSong.id;
      isAudioReadyRef.current = false;

      const encodedSrc = encodeURI(currentSong.src);
      audio.src = encodedSrc;
      audio.load();

      const handleCanPlay = () => {
        // Restore previous position when re-loading a persisted song
        if (currentTime > 0 && currentTime < audio.duration) {
          audio.currentTime = currentTime;
        }
        isAudioReadyRef.current = true;
        audio.removeEventListener("canplay", handleCanPlay);
      };
      audio.addEventListener("canplay", handleCanPlay);
    }
  }, [currentSong, currentTime]);

  // ─── Sync play / pause state ───────────────────────────────────────────────

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (!isPlaying) {
      audio.pause();
      // No longer need to resume on interaction
      clearInteractionListeners();
      return;
    }

    /**
     * Try audio.play(). If the browser rejects it (autoplay policy), register
     * a one-shot interaction handler that calls audio.play() *synchronously*
     * inside the user-gesture callback — the only reliable way to satisfy the
     * browser's autoplay policy without a prior interaction.
     */
    const attemptPlay = () => {
      const playPromise = audio.play();
      if (playPromise === undefined) return;

      playPromise.catch((err: Error) => {
        // Autoplay was blocked — this is expected on the first visit.
        console.warn("[AudioPlayer] Autoplay blocked:", err.message);
        setIsPlaying(false);

        // Guard against registering duplicate listeners
        clearInteractionListeners();

        let handled = false;
        const resume = () => {
          if (handled) return;
          handled = true;
          clearInteractionListeners();

          // Call play() directly inside the user-gesture event handler
          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {
              // Still blocked — give up silently
            });
        };

        interactionResumeRef.current = resume;
        document.addEventListener("click", resume);
        document.addEventListener("keydown", resume);
        document.addEventListener("touchstart", resume);
      });
    };

    if (!isAudioReadyRef.current) {
      // Audio hasn't finished loading yet — wait for it
      const handleCanPlayThrough = () => {
        attemptPlay();
        audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      };
      audio.addEventListener("canplaythrough", handleCanPlayThrough);
      return () => {
        audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      };
    }

    attemptPlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentSong]);

  // ─── Sync volume ───────────────────────────────────────────────────────────

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  // ─── Audio element event listeners ────────────────────────────────────────

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);

    const handleLoadedMetadata = () => setDuration(audio.duration);

    const handleEnded = () => {
      // Auto-advance to the next track
      next();
      setIsPlaying(true);
    };

    const handleError = (e: Event) => {
      const el = e.target as HTMLAudioElement;
      console.error(
        "[AudioPlayer] Error:",
        el.error?.message ?? "Unknown error",
      );
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [setCurrentTime, setDuration, setIsPlaying, next]);

  // ─── Cleanup on unmount ────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      clearInteractionListeners();
    };
  }, []);

  return (
    <>
      {children}
      {/* Hidden HTML5 audio element — all control is done via the store */}
      <audio ref={audioRef} preload="auto" />
    </>
  );
}
