import { useEffect, useState } from 'react';

const useDebounceValue = <T>(value: T, delay = 250) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};


const useAudio = (url: string) => {

  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    setPlaying(!playing);
  };

  useEffect(() => {
    console.log(audio.src, playing);
    if (audio) {
      playing ? audio.play() : audio.pause();
    } else {
      console.log('No audio');
    }

  }, [playing]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return [playing, toggle] as const;
};

const useAudioPlayer = (url: string) => {
  console.log("file: customHooks.ts:44 -> url:", url);
  const [audio] = useState(new Audio(url));
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const onPlaying = () => {
    setDuration(audio.duration);
    setCurrentTime(audio.currentTime);
  };

  const onTimeUpdate = () => {
    setCurrentTime(audio.currentTime);
  };

  const changeVolume = (newVolume: number) => {
    setVolume(newVolume);
    audio.volume = newVolume;
  };

  const seek = (time: number) => {
    audio.currentTime = time;
    setCurrentTime(time);
  };

  useEffect(() => {
    audio.addEventListener('loadeddata', onPlaying);
    audio.addEventListener('timeupdate', onTimeUpdate);
    isPlaying ? audio.play() : audio.pause();

    return () => {
      audio.removeEventListener('loadeddata', onPlaying);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.pause();
    };
  }, [isPlaying, audio]);

  return {
    isPlaying,
    duration,
    currentTime,
    volume,
    togglePlayPause,
    changeVolume,
    seek,
  };
};


export { useDebounceValue, useAudio, useAudioPlayer };