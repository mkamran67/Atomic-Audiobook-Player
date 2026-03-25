import { LibraryBook, genreColors } from '../../../types/library';
import CoverImage from '../../../components/base/CoverImage';

interface ListViewProps {
  books: LibraryBook[];
  likedIds: Set<string>;
  onToggleLike: (id: string) => void;
  onBookClick: (book: LibraryBook) => void;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  onSort: (col: string) => void;
}

const statusConfig = {
  'not-started': { label: 'Not Started', cls: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400', icon: 'ri-time-line' },
  'in-progress': { label: 'Listening', cls: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400', icon: 'ri-headphone-line' },
  completed: { label: 'Completed', cls: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', icon: 'ri-checkbox-circle-line' },
};

function SortHeader({ label, col, active, dir, onSort }: { label: string; col: string; active: boolean; dir: 'asc' | 'desc'; onSort: (c: string) => void }) {
  return (
    <button
      onClick={() => onSort(col)}
      className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer whitespace-nowrap"
    >
      {label}
      {active
        ? <i className={`ri-arrow-${dir === 'asc' ? 'up' : 'down'}-s-line text-sm text-purple-500`}></i>
        : <i className="ri-expand-up-down-line text-xs opacity-40"></i>
      }
    </button>
  );
}

export default function ListView({ books, likedIds, onToggleLike, onBookClick, sortBy, sortDir, onSort }: ListViewProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
          <i className="ri-book-2-line text-3xl text-gray-300 dark:text-gray-600"></i>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">No books found</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
      {/* Header row */}
      <div className="hidden md:grid grid-cols-[2.5fr_1fr_1fr_1fr_1.2fr_0.8fr_auto] gap-4 px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <SortHeader label="Book" col="title" active={sortBy === 'title'} dir={sortDir} onSort={onSort} />
        <SortHeader label="Genre" col="genre" active={sortBy === 'genre'} dir={sortDir} onSort={onSort} />
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Status</span>
        <SortHeader label="Rating" col="rating" active={sortBy === 'rating'} dir={sortDir} onSort={onSort} />
        <SortHeader label="Progress" col="progress" active={sortBy === 'progress'} dir={sortDir} onSort={onSort} />
        <SortHeader label="Year" col="year" active={sortBy === 'year'} dir={sortDir} onSort={onSort} />
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 w-16 text-right">Actions</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {books.map((book) => {
          const st = statusConfig[book.status];
          const isLiked = likedIds.has(book.id);

          return (
            <div
              key={book.id}
              onClick={() => onBookClick(book)}
              className="group flex md:grid md:grid-cols-[2.5fr_1fr_1fr_1fr_1.2fr_0.8fr_auto] gap-3 md:gap-4 items-center px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors cursor-pointer"
            >
              {/* Cover + info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <CoverImage src={book.cover} alt={book.title} className="w-full h-full object-cover object-top" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{book.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{book.author}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{book.duration}</p>
                  {/* Mobile: show status + rating inline */}
                  <div className="flex items-center gap-2 mt-1 md:hidden">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${st.cls}`}>
                      <i className={`${st.icon} text-[9px]`}></i>
                      {st.label}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`ri-star-${i < book.rating ? 'fill' : 'line'} text-[10px] ${i < book.rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}></i>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Genre */}
              <div className="hidden md:block">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${genreColors[book.genre] ?? 'bg-gray-100 text-gray-500'}`}>
                  {book.genre}
                </span>
              </div>

              {/* Status */}
              <div className="hidden md:block">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${st.cls}`}>
                  <i className={`${st.icon} text-xs`}></i>
                  {st.label}
                </span>
              </div>

              {/* Rating */}
              <div className="hidden md:flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`ri-star-${i < book.rating ? 'fill' : 'line'} text-sm ${i < book.rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}></i>
                ))}
              </div>

              {/* Progress */}
              <div className="hidden md:block">
                {book.status === 'in-progress' ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: `${book.progress}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 w-7 text-right">{book.progress}%</span>
                  </div>
                ) : book.status === 'completed' ? (
                  <div className="flex items-center gap-1 text-emerald-500">
                    <i className="ri-checkbox-circle-fill text-sm"></i>
                    <span className="text-xs font-medium">Done</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
                )}
              </div>

              {/* Year */}
              <div className="hidden md:block">
                <span className="text-sm text-gray-500 dark:text-gray-400">{book.year}</span>
              </div>

              {/* Actions */}
              <div className="hidden md:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleLike(book.id); }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className={`${isLiked ? 'ri-heart-fill text-rose-400' : 'ri-heart-line text-gray-400 dark:text-gray-500'} text-sm`}></i>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onBookClick(book); }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-play-fill text-sm"></i>
                </button>
              </div>

              {/* Mobile: like + play */}
              <div className="md:hidden flex items-center gap-1 ml-auto flex-shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleLike(book.id); }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className={`${isLiked ? 'ri-heart-fill text-rose-400' : 'ri-heart-line text-gray-400'} text-sm`}></i>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onBookClick(book); }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-500 text-white cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-play-fill text-sm"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
