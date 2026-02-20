import { useEffect, useRef, useState } from 'react';
import { REQUEST_TO_ELECTRON, SAVE_BOOK_PROGRESS } from '../../../../src/shared/constants';
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

const useAudioPlayer = (url: string, bookPath: string, currentTrack: number, incomingTime: number, onEnded?: () => void) => {
  const [audio] = useState(new Audio(url));
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(incomingTime);
  const [volume, setVolume] = useState(100);
  const previousTime = useRef(0);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const onPlaying = () => {
    setDuration(audio.duration);
    setCurrentTime(audio.currentTime);
  };

  const onTimeUpdate = () => {
    const currentTime = Math.ceil(audio.currentTime);
    setCurrentTime(currentTime);
    // Save every 15 seconds
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

    const handleEnded = () => {
      setIsPlaying(false);
      onEndedRef.current?.();
    };
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleSeeked = () => onTimeUpdate();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('seeked', handleSeeked);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('seeked', handleSeeked);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);

      audio.pause();
    };
  }, [isPlaying, audio]);

  useEffect(() => {
    audio.currentTime = incomingTime;
  }, []);



  return {
    isPlaying,
    duration,
    currentTime,
    volume,
    audio,
    togglePlayPause,
    changeVolume,
    seek,
    onPlaying,
  };
};


export { useAudioPlayer, useDebounceValue };
