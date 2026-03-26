import { useState, useEffect, useCallback, useRef } from 'react';
import { getAudioEngine } from '../audio/AudioEngine';

const EQ_BANDS_KEY = 'readit-eq-bands';

export function useAudioEngine() {
  const engine = getAudioEngine();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const lastTimeRef = useRef(0);
  const onEndedRef = useRef<(() => void) | null>(null);

  // Subscribe to engine events
  useEffect(() => {
    engine.on('timeupdate', (time: number) => {
      // Only trust timeupdate from a loaded audio source
      if (!engine.ready) return;
      // Throttle: only update state if changed by >= 0.25s
      if (Math.abs(time - lastTimeRef.current) >= 1) {
        lastTimeRef.current = time;
        setCurrentTime(time);
      }
    });

    engine.on('durationchange', (dur: number) => {
      setDuration(dur);
    });

    engine.on('play', () => setIsPlaying(true));
    engine.on('pause', () => setIsPlaying(false));

    engine.on('ended', () => {
      setIsPlaying(false);
      onEndedRef.current?.();
    });

    engine.on('error', (msg: string) => {
      setError(msg);
    });

    return () => {
      engine.off('timeupdate');
      engine.off('durationchange');
      engine.off('play');
      engine.off('pause');
      engine.off('ended');
      engine.off('error');
    };
  }, [engine]);

  // Sync EQ bands from localStorage
  const applyStoredEqBands = useCallback(() => {
    try {
      const raw = localStorage.getItem(EQ_BANDS_KEY);
      if (raw) {
        const bands = JSON.parse(raw) as number[];
        if (Array.isArray(bands) && bands.length === 5) {
          engine.setEqBands(bands);
        }
      }
    } catch {
      // ignore
    }
  }, [engine]);

  useEffect(() => {
    applyStoredEqBands();

    const handleEqChange = () => applyStoredEqBands();
    window.addEventListener('eq-bands-changed', handleEqChange);
    return () => window.removeEventListener('eq-bands-changed', handleEqChange);
  }, [applyStoredEqBands]);

  // ── Actions ────────────────────────────────────────────────────────────

  const loadAndPlay = useCallback(async (filePath: string, startTime?: number) => {
    setError(null);
    engine.loadChapter(filePath, startTime);
    try {
      await engine.play();
    } catch {
      // source not ready yet, user will click play
    }
  }, [engine]);

  const play = useCallback(async () => {
    try {
      await engine.play();
    } catch {
      // ignore
    }
  }, [engine]);

  const pause = useCallback(() => {
    engine.pause();
  }, [engine]);

  const togglePlayPause = useCallback(async () => {
    if (engine.paused) {
      await play();
    } else {
      pause();
    }
  }, [engine, play, pause]);

  const seek = useCallback((seconds: number) => {
    engine.seek(seconds);
    setCurrentTime(seconds);
    lastTimeRef.current = seconds;
  }, [engine]);

  const skip = useCallback((seconds: number) => {
    const newTime = Math.max(0, lastTimeRef.current + seconds);
    engine.seek(newTime);
    setCurrentTime(newTime);
    lastTimeRef.current = newTime;
  }, [engine]);

  const setPlaybackSpeed = useCallback((rate: number) => {
    engine.setPlaybackRate(rate);
  }, [engine]);

  const setVolume = useCallback((v: number) => {
    engine.setVolume(v);
  }, [engine]);

  const setVolumeBoost = useCallback((enabled: boolean) => {
    engine.setVolumeBoost(enabled);
  }, [engine]);

  const setEqBands = useCallback((bands: number[]) => {
    engine.setEqBands(bands);
  }, [engine]);

  const registerOnEnded = useCallback((cb: () => void) => {
    onEndedRef.current = cb;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    isPlaying,
    currentTime,
    duration,
    error,

    loadAndPlay,
    play,
    pause,
    togglePlayPause,
    seek,
    skip,
    setPlaybackSpeed,
    setVolume,
    setVolumeBoost,
    setEqBands,
    registerOnEnded,
    clearError,
  };
}
