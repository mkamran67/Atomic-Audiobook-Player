import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ChapterSelector from "./ChapterSelector";
import { RootState } from "../../store";
import { MinimumChapterDetails } from "../../types/book.types";
import ButtonGroup from "./ButtonGroup";


function convertSecondsToString(timeInSeconds: number) {


  let wholeNumberOfSeconds = Math.round(timeInSeconds);

  // Get seconds
  const seconds = wholeNumberOfSeconds % 60;
  // Get minutes
  let totalMinutes = (wholeNumberOfSeconds - seconds) / 60;
  const minutes = totalMinutes % 60;
  totalMinutes = totalMinutes - minutes;
  // Get hours
  const hours = totalMinutes / 60;

  const fixedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const fixedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const fixedHours = hours < 10 ? `0${hours}` : hours;

  return `${fixedHours}:${fixedMinutes}:${fixedSeconds}`;
}

function getPercentFromTime(currentTime: number, totalTrackDuration: number | undefined): number {

  if (totalTrackDuration === undefined) {
    return 0;
  }

  return (currentTime / totalTrackDuration) * 100;
}

function getNextChapter(currentChapter: string, chapterList: MinimumChapterDetails[]) {
  console.log("👉 -> file: Player.tsx:50 -> chapterList:", chapterList)
  // console.log("👉 -> file: Player.tsx:50 -> currentChapter:", currentChapter)
}


export default function Player() {
  // 1. User selects a book to play ✅
  // 1A. Continue from previously played book
  // 2. Load selected book or previously played book
  // 3. Logic for playing - pausing, seeking, etc.

  // 0. Get state from store
  const {
    currentChapter,
    chapterList,
    title,
    currentTime: currentTrackTime,
    currentTrack,
    totalTracks,
    totalLength
  } = useSelector((state: RootState) => state.player); // Get the currently playing url from the store

  // TODO: 1. Add logic for playing & pausing
  const [audio, setAudio] = useState(
    currentChapter !== "" ? new Audio(`get-file://${currentChapter}`) : null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeInSeconds, setCurrentTimeInSeconds] = useState("00:00:00");
  const [currentTimeLeftInSeconds, setCurrentTimeLeftInSeconds] = useState("00:00:00");
  const trackProgress = useRef(0);
  const [progressBar, setProgressBar] = useState(0)

  function getDuration(): number {

    if (audio && (audio.duration == Infinity || isNaN(audio.duration))) {
      audio.addEventListener("durationchange", function (e) {
        if (this.duration != Infinity) {
          var duration = this.duration
          audio.remove();
          return duration;
        };
      }, false);
      audio.load();
      audio.currentTime = 24 * 60 * 60; //fake big time
      // audio.volume = 0;
      // audio.play();
    }
  }

  useEffect(() => {
    if (audio) {
      if (isPlaying) {
        audio.currentTime = currentTrackTime !== 0 ? currentTrackTime : trackProgress.current;
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (audio) {
      audio.load();
      console.log(`Audio Loaded - audio useEffect`)
      if (audio.duration == Infinity || isNaN(audio.duration)) {
        console.log("👉 -> file: Player.tsx:88 -> audio.duration:", audio.duration)
        audio.currentTime = 1000000000.0;
        setTimeout(() => {
          audio.currentTime = currentTrackTime ? currentTrackTime : 0;
        }, 100);
      }

      audio.addEventListener("ended", () => {
        // TODO: Change Chapters or Set book to Finished
        getNextChapter(currentChapter, chapterList);
      });

      audio.addEventListener("timeupdate", () => {
        trackProgress.current = audio.currentTime;
        setCurrentTimeInSeconds(convertSecondsToString(audio.currentTime));
        setProgressBar(getPercentFromTime(audio.currentTime, audio.duration));

        if (isNaN(audio.duration) || audio.duration == Infinity) {
          setProgressBar(getPercentFromTime(audio.currentTime, totalLength));
          // setCurrentTimeLeftInSeconds("00:00:00");
          setCurrentTimeLeftInSeconds(convertSecondsToString(audio.duration - audio.currentTime));

        } else {
          setProgressBar(getPercentFromTime(audio.currentTime, audio.duration));
          setCurrentTimeLeftInSeconds(convertSecondsToString(audio.duration - audio.currentTime));
        }
      });
    }

    return () => {
      if (audio) {
        audio.removeEventListener("ended", () => { })
        audio.removeEventListener("timeupdate", () => { })
      }
    }
  }, [audio])

  // Handles Audio source change
  useEffect(() => {
    if (!audio && currentChapter !== "") {
      setAudio(new Audio(`get-file://${currentChapter}`));
    }

    if (audio && currentChapter) {
      setIsPlaying(false);
      audio.src = `get-file://${currentChapter}`;
      audio.load();
      console.log(`Audio Loaded - currentChapter useEffect`)
      if (audio.duration == Infinity || isNaN(audio.duration)) {
        console.log("👉 -> file: Player.tsx:64 -> audio.duration:", audio.duration)
        audio.currentTime = 1000000000.0;
        setTimeout(() => {
          audio.currentTime = currentTrackTime ? currentTrackTime : 0;
        }, 100);
      }
    }
  }, [currentChapter]);



  // TODO: Add logic skipping around
  function steppingAround(amount: number, direction: string) {
    if (audio) {
      if (direction === "forward") {
        audio.currentTime += amount;
      } else if (direction === "backward") {
        audio.currentTime -= amount;
      }
    }
  }

  function onSeek(amount: string) {
    console.log("👉 -> file: Player.tsx:143 -> amount:", amount)

  }


  const setNewChapter = (newChapter: string) => {
    console.log(newChapter)
  };

  return (
    <div className="fixed bottom-0 z-40 w-screen border-t h-36 bg-gray-50">
      <div className="w-full">
        <div className="px-12">
          <div className="object-contain w-48 h-full bg-slate-400"></div>
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="w-48 text-center truncate">{title}</p>
            </div>
            <ButtonGroup isPlaying={isPlaying} steppingAround={steppingAround} isThereAudio={audio ? true : false} setIsPlaying={setIsPlaying} />
            <div className="justify-end">
              <ChapterSelector chapterList={chapterList} currentChapter={currentChapter} setNewChapter={setNewChapter} />
            </div>
          </div>
          <div className="flex flex-row items-center text-center justify-evenly">
            <p className="pr-2">{currentTimeInSeconds}</p>
            <input
              type="range"
              min="0"
              max="100"
              value={progressBar}
              onChange={(e) => onSeek(e.target.value)}
              className="w-full cursor-pointer range-lg range-primary"
            />
            <p className="pl-2">-{currentTimeLeftInSeconds}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
