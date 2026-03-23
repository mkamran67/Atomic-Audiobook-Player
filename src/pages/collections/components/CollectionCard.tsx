import { Collection, parseDurationSecs, formatTotalDuration } from '../../../mocks/collections';
import { LibraryBook } from '../../../mocks/library';

interface CollectionCardProps {
  collection: Collection;
  allBooks: LibraryBook[];
  onOpen: () => void;
  onPlay: () => void;
}

function getQueueInfo(bookIds: number[], allBooks: LibraryBook[]) {
  const books = bookIds.map((id) => allBooks.find((b) => b.id === id)).filter(Boolean) as LibraryBook[];
  const nowPlaying = books.find((b) => b.status === 'in-progress') ?? null;
  let nextUp: LibraryBook | null = null;
  if (nowPlaying) {
    const idx = books.findIndex((b) => b.id === nowPlaying.id);
    nextUp = books.slice(idx + 1).find((b) => b.status === 'not-started') ?? null;
  } else {
    nextUp = books.find((b) => b.status === 'not-started') ?? null;
  }
  const allDone = books.length > 0 && books.every((b) => b.status === 'completed');
  return { nowPlaying, nextUp, allDone };
}

export default function CollectionCard({ collection, allBooks, onOpen, onPlay }: CollectionCardProps) {
  const books = collection.bookIds
    .map((id) => allBooks.find((b) => b.id === id))
    .filter(Boolean) as LibraryBook[];

  const coverBooks = books.slice(0, 3);
  const totalSecs = books.reduce((acc, b) => acc + parseDurationSecs(b.duration), 0);
  const { nowPlaying, nextUp, allDone } = getQueueInfo(collection.bookIds, allBooks);

  return (
    <div
      onClick={onOpen}
      className="bg-white dark:bg-gray-900 rounded-2xl p-5 cursor-pointer hover:scale-[1.01] transition-all duration-200 flex flex-col gap-4 group"
    >
      {/* Stacked covers */}
      <div className="relative flex items-end" style={{ height: '80px', width: `${Math.min(coverBooks.length, 3) * 26 + 48}px` }}>
        {coverBooks.map((book, i) => (
          <div
            key={book.id}
            className="absolute w-14 h-20 rounded-xl overflow-hidden border-2 border-white dark:border-gray-900"
            style={{
              left: `${i * 26}px`,
              zIndex: i + 1,
              transform: `rotate(${(i - 1) * 3}deg)`,
            }}
          >
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover object-top"
            />
          </div>
        ))}
        {books.length > 3 && (
          <div
            className="absolute w-14 h-20 rounded-xl bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center"
            style={{ left: `${3 * 26}px`, zIndex: 4 }}
          >
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">+{books.length - 3}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white leading-snug mb-1 truncate" dangerouslySetInnerHTML={{ __html: collection.name }} />
        <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: collection.description }} />
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
        <span className="flex items-center gap-1">
          <i className="ri-book-2-line text-sm"></i>
          {books.length} {books.length === 1 ? 'book' : 'books'}
        </span>
        <span className="flex items-center gap-1">
          <i className="ri-time-line text-sm"></i>
          {formatTotalDuration(totalSecs)}
        </span>
        {allDone && (
          <span className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400 ml-auto">
            <i className="ri-checkbox-circle-fill text-sm"></i>
            Complete
          </span>
        )}
      </div>

      {/* Queue info */}
      {(nowPlaying || nextUp) && (
        <div className="flex flex-col gap-1">
          {nowPlaying && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse flex-shrink-0"></span>
              <span className="text-orange-500 dark:text-orange-400 font-medium whitespace-nowrap truncate">
                Now: {nowPlaying.title}
              </span>
            </div>
          )}
          {nextUp && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">
                <i className="ri-skip-forward-line text-xs"></i>
              </div>
              <span className="truncate">Next: {nextUp.title}</span>
            </div>
          )}
        </div>
      )}

      {/* Play button */}
      <button
        onClick={(e) => { e.stopPropagation(); onPlay(); }}
        className="w-full h-9 flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
      >
        <div className="w-3.5 h-3.5 flex items-center justify-center">
          <i className="ri-play-fill text-sm"></i>
        </div>
        Play Collection
      </button>
    </div>
  );
}
