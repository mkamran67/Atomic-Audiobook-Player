import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { convertURI } from "../../utils/funcs";
import AudioPlayer from "./AudioPlayer";
import BookCover from "./BookCover";


export default function Player() {
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
  } = useSelector((state: RootState) => state.player);

  const bookCoverPath = coverPath !== 'none' && coverPath ? convertURI(coverPath) : null;

  return (
    <div className="fixed bottom-0 left-0 z-40 w-screen bg-gray-900 h-28 md:h-32 border-t border-white/10">
      <div className="flex flex-row items-center justify-center w-full h-full">
        <BookCover imgSrc={bookCoverPath} />
        {
          currentChapter ?
            (<>
              <AudioPlayer
                key={currentChapter}
                url={currentChapter}
                bookURL={bookPath}
                title={title}
                currentTrack={currentTrack}
                incomingTime={currentTime}
                chapterList={chapterList}
              />
            </>
            ) : (
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <h3 className="text-lg md:text-xl text-gray-400">No book playing</h3>
              </div>
            )
        }
      </div>
    </div>
  );
}
