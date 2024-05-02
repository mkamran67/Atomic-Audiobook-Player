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

const useAudioPlayer = (url: string, bookPath: string, currentTrack: number, incomingTime: number) => {
  const [audio] = useState(new Audio(url));
  const [isPlaying, setIsPlaying] = useState(false);
  // const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(incomingTime);
  const [volume, setVolume] = useState(100);
  const previousTime = useRef(0);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // const onPlaying = () => {
  //   setDuration(audio.duration);
  //   setCurrentTime(audio.currentTime);
  // };

  const onTimeUpdate = () => {
    const currentTime = Math.ceil(audio.currentTime);
    setCurrentTime(currentTime);
    // Save every 30 seconds save progress
    if (currentTime !== previousTime.current && currentTime % 15 === 0) {

      const payload: SaveBookProgressPayload = {
        currentChapterURL: url.replace('get-audio://', ''),
        currentTime: currentTime,
        duration: audio.duration,
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
    audio.volume = (newVolume / 100);
  };

  const seek = (time: number) => {
    audio.currentTime = time;
    audio.play();
    setCurrentTime(time);
  };

  useEffect(() => {
    isPlaying ? audio.play() : audio.pause();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', () => setIsPlaying(false));
    audio.addEventListener('seeked', () => onTimeUpdate());

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', () => setIsPlaying(false));
      audio.removeEventListener('seeked', () => onTimeUpdate());
      audio.pause();
    };
  }, [isPlaying, audio]);

  useEffect(() => {
    audio.currentTime = incomingTime;
  }, []);


  return {
    isPlaying,
    // duration,
    currentTime,
    volume,
    togglePlayPause,
    changeVolume,
    seek,
    audio
  };
};


export { useDebounceValue, useAudioPlayer };