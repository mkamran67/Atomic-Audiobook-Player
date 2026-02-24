import { useState, useRef, useEffect } from 'react';
import { MinimumChapterDetails } from "../../../../../src/shared/types";

interface Props {
  chapterList: MinimumChapterDetails[];
  setNewChapter: (chapter: string) => void;
  currentChapter: string;
}


function ChapterSelector({ chapterList, setNewChapter, currentChapter }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (chapterList.length <= 1) {
    return (
      <button className="text-base-content/50 px-3 py-1.5 text-sm rounded-md cursor-not-allowed opacity-50">No Chapters</button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="px-3 py-1.5 text-sm rounded-md bg-base-200 text-base-content hover:bg-base-300 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        Select Chapter
      </button>
      {isOpen && (
        <ul className="absolute bottom-full right-0 mb-1 p-2 shadow-lg bg-base-100 border border-base-300 rounded-lg w-36 max-h-48 overflow-y-auto z-50">
          {chapterList.map((chapter, index) => (
            <li
              key={`chapter-${index}`}
              onClick={() => {
                if (currentChapter !== chapter.path) {
                  setNewChapter(chapter.path);
                  setIsOpen(false);
                }
              }}
              className={`px-2 py-1 rounded text-sm cursor-pointer ${
                currentChapter === chapter.path
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-base-200'
              }`}
            >
              {`Chapter ${index + 1}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChapterSelector;
