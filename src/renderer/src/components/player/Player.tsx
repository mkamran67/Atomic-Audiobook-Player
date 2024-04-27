import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ChapterSelector from "./ChapterSelector";
import { RootState } from "../../state/store";
import { MinimumChapterDetails } from "../../types/book.types";
import ButtonGroup from "./ButtonGroup";
import BookCard from "../library/BookCard";
import default_img from '../../assets/default-book-cover.jpg';
import { useAudio } from "../../utils/customHooks";
import { convertURI } from "../../utils/funcs";
import AudioPlayer from "./AudioPlayer";



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

function getNextChapter(_currentChapter: string, chapterList: MinimumChapterDetails[]) {
  console.log("👉 -> file: Player.tsx:50 -> chapterList:", chapterList);
  // console.log("👉 -> file: Player.tsx:50 -> currentChapter:", currentChapter)
}


export default function Player() {
  // 1. User selects a book to play ✅
  // 1A. Continue from previously played book
  // 2. Load selected book or previously played book
  // 3. Logic for playing - pausing, seeking, etc.

  // 0. Get state from store
  const {
    chapterList,
    currentChapter,
    currentTime,
    currentTrack,
    totalTracks,
    author,
    coverPath,
    title,
    totalLength,
    totalSize,
    year,
    bookPath
  } = useSelector((state: RootState) => state.player); // Get the currently playing url from the store



  return (
    <div className="fixed bottom-0 left-0 z-40 w-screen bg-gray-900 h-52 overflow-none">
      <div className="flex flex-row max-w-full max-h-full p-2">
        {
          currentChapter ?
            (<>
              <AudioPlayer url={currentChapter} />
            </>
            ) : (
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <p className="w-64 text-center truncate hover:w-full">No book playing</p>
              </div>
            )
        }
      </div>
    </div >
  );
}