import { PlayCircleIcon, ForwardIcon, PauseCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import ChapterSelector from "./ChapterSelector";

type Props = {};

const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

export default function Player({}: Props) {
  const [value, setValue] = useState(50);

  const onChange = (value: any) => {
    setValue(value);
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
              <PlayCircleIcon className="w-10 h-10 text-gray-500 cursor-pointer hover:text-gray-800" />
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
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full cursor-pointer range-lg range-primary"
          />
        </div>
      </div>
    </div>
  );
}
