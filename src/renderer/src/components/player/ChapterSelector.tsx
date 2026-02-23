import { MinimumChapterDetails } from "../../../../../src/shared/types";

interface Props {
  chapterList: MinimumChapterDetails[];
  setNewChapter: (chapter: string) => void;
  currentChapter: string;
}


function ChapterSelector({ chapterList, setNewChapter, currentChapter }: Props) {


  if (chapterList.length <= 1) {
    // REVIEW - Fix colors
    return (
      <button className="text-base-content/50 btn btn-disabled">No Chapters</button>
    );
  }

  return (
    <div className="dropdown dropdown-left dropdown-end">
      <label tabIndex={0} className="m-1 btn">
        Select Chapter
      </label>
      <ul tabIndex={0} className="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-36">
        {chapterList && chapterList.map(
          (chapter, index) => {
            return (
              <li
                key={`chapter-${index}`}
                onClick={() => {
                  setNewChapter(chapter.path);
                }}
                className={
                  currentChapter === chapter.path ? "m-1 disabled" : "m-1 cursor-pointer"
                }
              >
                <a>
                  {`Chapter ${index + 1}`}
                </a>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
}

export default ChapterSelector;
