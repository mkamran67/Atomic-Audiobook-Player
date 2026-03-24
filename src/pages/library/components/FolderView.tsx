import { useState, useMemo } from 'react';
import { LibraryBook } from '../../../types/library';
import CoverImage from '../../../components/base/CoverImage';

interface FolderViewProps {
  books: LibraryBook[];
  likedIds: Set<string>;
  onToggleLike: (id: string) => void;
}

const statusConfig = {
  'not-started': { label: 'Not Started', dot: 'bg-gray-300 dark:bg-gray-600', text: 'text-gray-400' },
  'in-progress':  { label: 'In Progress', dot: 'bg-orange-400',               text: 'text-orange-400' },
  completed:      { label: 'Completed',   dot: 'bg-emerald-400',              text: 'text-emerald-500' },
};

// Folder colour strip — one accent per genre bucket
const folderAccent = (genre: string) => {
  const map: Record<string, string> = {
    Fantasy: 'text-emerald-500',
    Fiction: 'text-cyan-500',
    Novel: 'text-violet-500',
    'Dark Academia': 'text-amber-500',
    'Dark Romance': 'text-rose-500',
    'Gothic Fantasy': 'text-slate-500',
    'Epic Fantasy': 'text-orange-500',
    'Dark Fantasy': 'text-red-500',
    'Ocean Fantasy': 'text-sky-500',
    'Academic Novel': 'text-lime-600',
    'Magical Realism': 'text-teal-500',
    'Gothic Horror': 'text-pink-500',
    'Military Fantasy': 'text-stone-500',
    'Fantasy Romance': 'text-fuchsia-500',
    Mythology: 'text-yellow-500',
  };
  return map[genre] ?? 'text-amber-500';
};

function BookRow({
  book,
  isLast,
  isLiked,
  onToggleLike,
}: {
  book: LibraryBook;
  isLast: boolean;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const st = statusConfig[book.status];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors group ${
        hovered ? 'bg-gray-50 dark:bg-gray-800/60' : ''
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tree line */}
      <div className="flex-shrink-0 flex items-center" style={{ width: 40 }}>
        <div className="w-px self-stretch bg-gray-200 dark:bg-gray-700 ml-4 mr-2" style={{ minHeight: 20 }} />
        <div className="w-3 h-px bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* File icon */}
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-gray-400">
        <i className="ri-headphone-line text-sm"></i>
      </div>

      {/* Thumbnail */}
      <div className="w-8 h-11 rounded overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
        <CoverImage src={book.cover} alt={book.title} className="w-full h-full object-cover object-top" />
      </div>

      {/* Title + author */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{book.title}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{book.author} · {book.year}</p>
      </div>

      {/* Progress bar — only in-progress */}
      {book.status === 'in-progress' && (
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0 w-28">
          <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div className="h-full bg-orange-400 rounded-full" style={{ width: `${book.progress}%` }} />
          </div>
          <span className="text-[10px] text-gray-400 tabular-nums">{book.progress}%</span>
        </div>
      )}

      {/* Status dot + label */}
      <div className="hidden md:flex items-center gap-1.5 flex-shrink-0 w-28">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${st.dot}`} />
        <span className={`text-xs ${st.text}`}>{st.label}</span>
      </div>

      {/* Duration */}
      <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 w-16 tabular-nums">
        <div className="w-3 h-3 flex items-center justify-center">
          <i className="ri-time-line text-[10px]"></i>
        </div>
        {book.duration}
      </div>

      {/* Like */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleLike(book.id); }}
        className={`w-6 h-6 flex items-center justify-center rounded-md transition-all cursor-pointer flex-shrink-0 ${
          isLiked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <i className={`${isLiked ? 'ri-heart-fill text-rose-400' : 'ri-heart-line text-gray-400'} text-sm`} />
      </button>
    </div>
  );
}

function FolderRow({
  genre,
  books,
  likedIds,
  onToggleLike,
  defaultOpen,
}: {
  genre: string;
  books: LibraryBook[];
  likedIds: Set<string>;
  onToggleLike: (id: string) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const completed  = books.filter((b) => b.status === 'completed').length;
  const inProgress = books.filter((b) => b.status === 'in-progress').length;
  const accent = folderAccent(genre);

  return (
    <div className="mb-1">
      {/* Folder header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors cursor-pointer group"
      >
        {/* Chevron */}
        <div className="w-5 h-5 flex items-center justify-center text-gray-400 flex-shrink-0 transition-transform duration-200" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          <i className="ri-arrow-right-s-line text-base"></i>
        </div>

        {/* Folder icon */}
        <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${accent}`}>
          <i className={`${open ? 'ri-folder-open-line' : 'ri-folder-line'} text-base`}></i>
        </div>

        {/* Genre name */}
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex-1 text-left">{genre}</span>

        {/* Counts */}
        <div className="flex items-center gap-2 mr-2 opacity-60 group-hover:opacity-100 transition-opacity">
          {inProgress > 0 && (
            <span className="text-[10px] font-medium text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded-full">
              {inProgress} listening
            </span>
          )}
          {completed > 0 && (
            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-full">
              {completed} done
            </span>
          )}
          <span className="text-xs text-gray-400 tabular-nums">{books.length} file{books.length !== 1 ? 's' : ''}</span>
        </div>
      </button>

      {/* Books */}
      {open && (
        <div className="ml-2 border-l-0">
          {books.map((book, i) => (
            <BookRow
              key={book.id}
              book={book}
              isLast={i === books.length - 1}
              isLiked={likedIds.has(book.id)}
              onToggleLike={onToggleLike}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FolderView({ books, likedIds, onToggleLike }: FolderViewProps) {
  const [allOpen, setAllOpen] = useState(true);
  const [key, setKey] = useState(0); // force remount on toggle-all

  const folders = useMemo(() => {
    const map = new Map<string, LibraryBook[]>();
    books.forEach((b) => {
      if (!map.has(b.genre)) map.set(b.genre, []);
      map.get(b.genre)!.push(b);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [books]);

  function handleToggleAll() {
    setAllOpen((v) => !v);
    setKey((k) => k + 1); // remount folders with new default
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
          <i className="ri-folder-line text-3xl text-gray-300 dark:text-gray-600"></i>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">No books found</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
      {/* Explorer toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-hard-drive-2-line text-sm"></i>
          </div>
          <span>Library</span>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300 font-medium">All Books</span>
          <span className="ml-2 text-gray-300 dark:text-gray-600">·</span>
          <span className="ml-2">{books.length} items in {folders.length} folders</span>
        </div>
        <button
          onClick={handleToggleAll}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
        >
          <div className="w-3.5 h-3.5 flex items-center justify-center">
            <i className={`${allOpen ? 'ri-collapse-diagonal-line' : 'ri-expand-diagonal-line'} text-xs`}></i>
          </div>
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
        <div style={{ width: 40 }} className="flex-shrink-0" />
        <div className="w-5 flex-shrink-0" />
        <div className="w-8 flex-shrink-0" />
        <span className="flex-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Title</span>
        <span className="hidden sm:block w-28 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Progress</span>
        <span className="hidden md:block w-28 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Status</span>
        <span className="hidden sm:block w-16 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Duration</span>
        <div className="w-6 flex-shrink-0" />
      </div>

      {/* Folders */}
      <div className="p-2">
        {folders.map(([genre, genreBooks]) => (
          <FolderRow
            key={`${key}-${genre}`}
            genre={genre}
            books={genreBooks}
            likedIds={likedIds}
            onToggleLike={onToggleLike}
            defaultOpen={allOpen}
          />
        ))}
      </div>
    </div>
  );
}
