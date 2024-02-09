import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PlayCircleIcon, ForwardIcon, PauseCircleIcon } from "@heroicons/react/24/outline";
import ChapterSelector from "./ChapterSelector";
import { RootState } from "../../store";

function getTimeLeft(timeInSeconds: number, totalLengthInSeconds: number): string {
  if (Number.isNaN(timeInSeconds) || Number.isNaN(totalLengthInSeconds)) {
    return "00:00:00";
  }

  const timeLeftInSeconds = totalLengthInSeconds - timeInSeconds;

  const seconds = Math.floor(timeLeftInSeconds % 60);
  const minutes = Math.floor((timeLeftInSeconds % 3600) / 60);
  const hours = Math.floor(timeLeftInSeconds / 3600);

  const fixedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const fixedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const fixedHours = hours < 10 ? `0${hours}` : hours;

  return `${fixedHours}:${fixedMinutes}:${fixedSeconds}`;
}

function convertSecondsToString(timeInSeconds: number) {
  const seconds = Math.floor(timeInSeconds % 60);
  const minutes = Math.floor(timeInSeconds / 60);
  const hours = Math.floor(timeInSeconds / 3600);

  const fixedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const fixedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const fixedHours = hours < 10 ? `0${hours}` : hours;

  return `${fixedHours}:${fixedMinutes}:${fixedSeconds}`;
}

function getPercentFromTime(newProgress: number, timeLeftInSeconds: number): number {
  if (Number.isNaN(newProgress) || Number.isNaN(timeLeftInSeconds)) {
    return 0;
  }

  // 50/100 = .50 * 14000
  const timeInSeconds = (newProgress / 100) * timeLeftInSeconds;

  return timeInSeconds;
}

export default function Player() {
  // 1. User selects a book to play ✅
  // 1A. Continue from previously played book
  // 2. Load selected book or previously played book
  // 3. Logic for playing - pausing, seeking, etc.

  // TODO: Add logic for playing
  // TODO: Add logic for seeking
  // TODO: Add logic for pausing
  // TODO: Add logic for rewinding
  // TODO: Add logic for forward
  // TODO: Hide when not playing ❓

  const [progress, setProgress] = useState(0); // Handles progress bar
  const { currentChapter, totalLength } = useSelector((state: RootState) => state.player); // Get the currently playing url from the store
  const [currentTime, setCurrentTime] = useState("--:--:--");
  const [currentChapterTimeLeft, setCurrentChapterTimeLeft] = useState("--:--:--");
  const [audio] = useState(
    currentChapter ? new Audio(`get-file://${currentChapter}`) : new Audio("../src/assets/sample.mp3")
  );
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audio) {
      audio.addEventListener("timeupdate", function () {
        setCurrentTime(convertSecondsToString(audio.currentTime));
      });

      setCurrentChapterTimeLeft(getTimeLeft(audio.currentTime, Number(totalLength)));
    }

    return () => {
      audio.removeEventListener("timeupdate", () => {
        // TODO Let Electron save the time - save time
      });
    };
  }, [audio.currentTime]);

  useEffect(() => {
    if (currentChapter) {
      audio.pause();
      setIsPlaying(false);
      // REVIEW - proper protocol
      audio.src = `get-file://${currentChapter}`;
      setCurrentTime(convertSecondsToString(audio.currentTime));
      audio.play();
      setIsPlaying(true);
    } else {
      audio.src = "../src/assets/sample.mp3";
    }

    if (audio.paused) {
      setIsPlaying(false);
    }
  }, [currentChapter]);

  useEffect(() => {
    isPlaying ? audio.play() : audio.pause();
  }, [isPlaying, audio]);

  useEffect(() => {
    audio.addEventListener("ended", () => setIsPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  // Updates time by progress bar
  useEffect(() => {
    if (audio) {
      // convert percentage to seconds
      audio.currentTime = getPercentFromTime(progress, Number(currentChapterTimeLeft));
    }
  }, [progress]);

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
                  onClick={() => setIsPlaying(false)}
                />
              ) : (
                <PlayCircleIcon
                  className="w-10 h-10 text-gray-500 cursor-pointer hover:text-gray-800"
                  onClick={() => setIsPlaying(true)}
                />
              )}
              <ForwardIcon className="w-10 h-10 text-gray-500 cursor-pointer hover:text-gray-800" />
            </div>
            <div className="justify-end">
              <ChapterSelector />
            </div>
          </div>
          <div className="flex flex-row items-center text-center justify-evenly">
            <p className="pr-2">{currentTime}</p>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => onChange(e.target.value)}
              className="w-full cursor-pointer range-lg range-primary"
            />
            <p className="pl-2">-{currentChapterTimeLeft}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
