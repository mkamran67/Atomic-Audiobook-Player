import { useState } from 'react';
import { Collection, parseDurationSecs, formatTotalDuration } from '../../../types/collection';
import { LibraryBook } from '../../../types/library';
import CoverImage from '../../../components/base/CoverImage';

interface CollectionDetailProps {
  collection: Collection;
  allBooks: LibraryBook[];
  onBack: () => void;
  onUpdate: (updated: Collection) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  'not-started': { label: 'New',       cls: 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500' },
  'in-progress':  { label: 'Listening', cls: 'bg-orange-50 text-orange-500 dark:bg-orange-900/20 dark:text-orange-400' },
  completed:      { label: 'Done',      cls: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' },
};

function getQueueInfo(bookIds: string[], allBooks: LibraryBook[]) {
  const books = bookIds.map((id) => allBooks.find((b) => b.id === id)).filter(Boolean) as LibraryBook[];
  const nowPlayingIdx = books.findIndex((b) => b.status === 'in-progress');
  const nowPlaying = nowPlayingIdx >= 0 ? books[nowPlayingIdx] : null;
  let nextUpIdx = -1;
  if (nowPlayingIdx >= 0) {
    for (let i = nowPlayingIdx + 1; i < books.length; i++) {
      if (books[i].status === 'not-started') { nextUpIdx = i; break; }
    }
  } else {
    nextUpIdx = books.findIndex((b) => b.status === 'not-started');
  }
  return { nowPlayingId: nowPlaying?.id ?? null, nextUpId: nextUpIdx >= 0 ? books[nextUpIdx].id : null };
}

export default function CollectionDetail({ collection, allBooks, onBack, onUpdate, onDelete }: CollectionDetailProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(collection.name);
  const [showAddPicker, setShowAddPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  const books = collection.bookIds
    .map((id) => allBooks.find((b) => b.id === id))
    .filter(Boolean) as LibraryBook[];

  const totalSecs = books.reduce((acc, b) => acc + parseDurationSecs(b.duration), 0);
  const { nowPlayingId, nextUpId } = getQueueInfo(collection.bookIds, allBooks);

  const allDone = books.length > 0 && books.every((b) => b.status === 'completed');

  function commitName() {
    const trimmed = nameVal.trim();
    if (trimmed) onUpdate({ ...collection, name: trimmed });
    else setNameVal(collection.name);
    setEditingName(false);
  }

  function moveBook(index: number, dir: -1 | 1) {
    const ids = [...collection.bookIds];
    const target = index + dir;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    onUpdate({ ...collection, bookIds: ids });
  }

  function removeBook(id: string) {
    onUpdate({ ...collection, bookIds: collection.bookIds.filter((x) => x !== id) });
  }

  function addBook(id: string) {
    if (collection.bookIds.includes(id)) return;
    onUpdate({ ...collection, bookIds: [...collection.bookIds, id] });
  }

  const availableToAdd = allBooks.filter(
    (b) =>
      !collection.bookIds.includes(b.id) &&
      (b.title.toLowerCase().includes(pickerSearch.toLowerCase()) ||
        b.author.toLowerCase().includes(pickerSearch.toLowerCase()))
  );

  return (
    <div>
      {/* Back + header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer flex-shrink-0"
        >
          <i className="ri-arrow-left-s-line text-xl"></i>
        </button>

        {editingName ? (
          <input
            autoFocus
            value={nameVal}
            onChange={(e) => setNameVal(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') { setNameVal(collection.name); setEditingName(false); } }}
            className="flex-1 text-2xl font-bold bg-transparent text-gray-800 dark:text-white focus:outline-none border-b-2 border-amber-400"
            maxLength={80}
          />
        ) : (
          <h1
            onClick={() => setEditingName(true)}
            className="flex-1 text-2xl font-bold text-gray-800 dark:text-white cursor-text hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate"
            dangerouslySetInnerHTML={{ __html: collection.name }}
          />
        )}

        <button
          onClick={() => onDelete(collection.id)}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer flex-shrink-0"
          title="Delete collection"
        >
          <i className="ri-delete-bin-line text-lg"></i>
        </button>
      </div>

      {/* Description */}
      {collection.description && (
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-5 leading-relaxed" dangerouslySetInnerHTML={{ __html: collection.description }} />
      )}

      {/* Stats + Play bar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl px-5 py-4 mb-5 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <i className="ri-book-2-line"></i>
            <span>{books.length} {books.length === 1 ? 'book' : 'books'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <i className="ri-time-line"></i>
            <span>{formatTotalDuration(totalSecs)}</span>
          </div>
          {allDone && (
            <div className="flex items-center gap-1.5 text-sm text-emerald-500 dark:text-emerald-400">
              <i className="ri-checkbox-circle-fill"></i>
              <span>All complete</span>
            </div>
          )}
        </div>
        <button className="h-9 px-4 flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap flex-shrink-0">
          <div className="w-3.5 h-3.5 flex items-center justify-center">
            <i className="ri-play-fill text-sm"></i>
          </div>
          {nowPlayingId ? 'Resume Collection' : 'Play from Start'}
        </button>
      </div>

      {/* Book list */}
      <div className="space-y-2 mb-4">
        {books.map((book, index) => {
          const st = statusConfig[book.status];
          const isNowPlaying = book.id === nowPlayingId;
          const isNextUp = book.id === nextUpId;

          return (
            <div
              key={book.id}
              className={`bg-white dark:bg-gray-900 rounded-2xl px-5 py-4 flex items-center gap-4 group transition-colors ${
                isNowPlaying ? 'ring-2 ring-orange-300 dark:ring-orange-700' : ''
              }`}
            >
              {/* Order number */}
              <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400 flex-shrink-0">
                {isNowPlaying ? (
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                ) : (
                  index + 1
                )}
              </div>

              {/* Cover */}
              <div className="w-10 h-[56px] rounded-md overflow-hidden flex-shrink-0">
                <CoverImage src={book.cover} alt={book.title} className="w-full h-full object-cover object-top" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{book.title}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{book.author}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${st.cls}`}>
                    {st.label}
                  </span>
                  {isNowPlaying && (
                    <span className="text-[10px] font-semibold text-orange-500 dark:text-orange-400 flex items-center gap-0.5">
                      <i className="ri-volume-up-line text-xs"></i> Now Playing
                    </span>
                  )}
                  {isNextUp && !isNowPlaying && (
                    <span className="text-[10px] font-medium text-amber-500 flex items-center gap-0.5">
                      <i className="ri-skip-forward-line text-xs"></i> Next Up
                    </span>
                  )}
                </div>
              </div>

              {/* Duration */}
              <span className="text-xs text-gray-300 dark:text-gray-600 flex-shrink-0 hidden sm:block">
                {book.duration.replace(':00', '')}
              </span>

              {/* Reorder + remove (visible on hover) */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => moveBook(index, -1)}
                  disabled={index === 0}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <i className="ri-arrow-up-s-line text-base"></i>
                </button>
                <button
                  onClick={() => moveBook(index, 1)}
                  disabled={index === books.length - 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <i className="ri-arrow-down-s-line text-base"></i>
                </button>
                <button
                  onClick={() => removeBook(book.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                  title="Remove from collection"
                >
                  <i className="ri-delete-bin-line text-sm"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add books button */}
      <button
        onClick={() => setShowAddPicker((p) => !p)}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-400 dark:text-gray-500 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-500 transition-colors cursor-pointer whitespace-nowrap"
      >
        <i className="ri-add-line text-base"></i>
        Add Books to Collection
      </button>

      {/* Inline picker */}
      {showAddPicker && (
        <div className="mt-3 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
              <input
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                placeholder="Search books to add…"
                className="w-full h-9 pl-8 pr-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>
          {availableToAdd.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-6">
              {allBooks.length === collection.bookIds.length ? 'All books are in this collection' : 'No matches'}
            </p>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800/60 max-h-64 overflow-y-auto">
              {availableToAdd.map((book) => (
                <div
                  key={book.id}
                  onClick={() => addBook(book.id)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-amber-50 dark:hover:bg-amber-900/10 cursor-pointer transition-colors group"
                >
                  <div className="w-8 h-11 rounded-md overflow-hidden flex-shrink-0">
                    <CoverImage src={book.cover} alt={book.title} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 dark:text-white truncate">{book.title}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">{book.author}</p>
                  </div>
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-amber-500 group-hover:text-white text-gray-400 transition-colors flex-shrink-0">
                    <i className="ri-add-line text-sm"></i>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
