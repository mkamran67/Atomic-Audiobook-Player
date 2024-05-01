import { useEffect, useRef, useState } from 'react';
import { SAVE_BOOK_PROGRESS, REQUEST_TO_ELECTRON } from '../../../../src/shared/constants';
import { SaveBookProgressPayload } from '../../../../src/shared/types';


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

const useAudioPlayer = (url: string, bookPath: string, currentTrack: number) => {
  const [audio] = useState(new Audio(url));
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.1);
  const previousTime = useRef(0);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const onPlaying = () => {
    setDuration(audio.duration);
    setCurrentTime(audio.currentTime);
  };

  const onTimeUpdate = () => {

    // 'C:\\Users\\highz\\bucket\\Atomic-Audiobook-Player\\get-audio:\\E:\\Books\\Audio Books\\Food, Diet\\Fat for Fuel A Revolutionary Diet to Combat Cancer, Boost Brain Power, and Increase Your Energy\\Fat for Fuel_ A Revo_B072L48PKB_LC_32_22050_Mono.mp3'

    const currentTime = Math.ceil(audio.currentTime);
    setCurrentTime(currentTime);
    // Save every 30 seconds save progress
    if (currentTime !== previousTime.current && currentTime % 30 === 0) {

      const payload: SaveBookProgressPayload = {
        currentChapterURL: url,
        currentTime: currentTime,
        duration: duration,
        bookURL: bookPath,
        currentTrack: currentTrack,
        markedForCompletion: false
      };

      window.api.send(
        REQUEST_TO_ELECTRON,
        {
          type: SAVE_BOOK_PROGRESS,
          data: payload
        }
      );



      previousTime.current = currentTime;
    }

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
    audio.addEventListener('ended', () => setIsPlaying(false));
    isPlaying ? audio.play() : audio.pause();

    return () => {
      audio.removeEventListener('loadeddata', onPlaying);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', () => setIsPlaying(false));
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


export { useDebounceValue, useAudioPlayer };