import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PlayCircleIcon, ForwardIcon, PauseCircleIcon } from "@heroicons/react/24/outline";
import ChapterSelector from "./ChapterSelector";
import { RootState } from "../../store";

export default function Player() {
  // 1. User selects a book to play
  // 1A. Continue from previously played book
  // 2. Load selected book or previously played book
  // 3. Logic for playing - pausing, seeking, etc.
  const [progress, setProgress] = useState(0); // Handles progress bar
  const { currentlyPlayingUrl, currentTime } = useSelector((state: RootState) => state.player); // Get the currently playing url from the store
  const [audio] = useState(null); //
  const [isPlaying, setIsPlaying] = useState(false);
  const toggle = () => setIsPlaying(!isPlaying);

  // useEffect(() => {
  //   isPlaying ? audio.play() : audio.pause();
  // }, [isPlaying]);

  // useEffect(() => {
  //   audio.addEventListener("ended", () => setIsPlaying(false));
  //   return () => {
  //     audio.removeEventListener("ended", () => setIsPlaying(false));
  //   };
  // }, []);

  const onChange = (value: any) => {
    // 1. Convert selected time to % ->
    setProgress(value);
  };

  return (
    <div className="fixed bottom-0 z-40 w-screen border-t h-36 bg-gray-50">
      <div className="w-full">
        <div className="px-12">
          <div className="object-contain w-48 h-full bg-slate-400"></div>
          <div className="flex items-center justify-between pt-2">
            <div>
              <p>Current Chapter</p>
            </div>
            <div className="flex">
              <ForwardIcon className="w-10 h-10 text-gray-500 rotate-180 cursor-pointer hover:text-gray-800" />
              {isPlaying ? (
                <PauseCircleIcon
                  className="w-10 h-10 text-gray-500 cursor-pointer hover:text-gray-800"
                  onClick={toggle}
                />
              ) : (
                <PlayCircleIcon
                  className="w-10 h-10 text-gray-500 cursor-pointer hover:text-gray-800"
                  onClick={toggle}
                />
              )}
              <ForwardIcon className="w-10 h-10 text-gray-500 cursor-pointer hover:text-gray-800" />
            </div>
            <div className="justify-end">
              <ChapterSelector />
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => onChange(e.target.value)}
            className="w-full cursor-pointer range-lg range-primary"
          />
        </div>
      </div>
    </div>
  );
}
