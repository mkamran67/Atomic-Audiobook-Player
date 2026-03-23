import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebarCollapsed } from '../../hooks/useSidebarCollapsed';
import Sidebar from '../../components/feature/Sidebar';
import { libraryBooks } from '../../mocks/library';
import { mockBookmarks, MockBookmark } from '../../mocks/bookmarks';
import BooksShelf from './components/BooksShelf';
import BookmarkGroup from './components/BookmarkGroup';

export default function BookmarksPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapsed();
  const [search, setSearch] = useState('');
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useState<MockBookmark[]>(mockBookmarks);

  // ── Collapse state (lifted from BookmarkGroup) ───────────────────────────
  const [collapsedIds, setCollapsedIds] = useState<Set<number>>(new Set());

  const handleTabChange = (tab: string) => {
    if (tab === 'home')        { navigate('/');            return; }
    if (tab === 'library')     { navigate('/library');     return; }
    if (tab === 'settings')    { navigate('/settings');    return; }
    if (tab === 'collections') { navigate('/collections'); return; }
  };

  const handleDelete = (id: string) => {
    setBookmarks((prev) => prev.filter((bm) => bm.id !== id));
  };

  // Map of bookId → count (for the shelf badges)
  const bookmarkCounts = useMemo(() => {
    const map = new Map<number, number>();
    bookmarks.forEach((bm) => map.set(bm.bookId, (map.get(bm.bookId) ?? 0) + 1));
    return map;
  }, [bookmarks]);

  const q = search.trim().toLowerCase();

  // Filtered books for the shelf
  const shelfBooks = useMemo(() => {
    if (!q) return libraryBooks;
    return libraryBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
    );
  }, [q]);

  // Filtered + grouped bookmarks
  const filteredGroups = useMemo(() => {
    let bms = bookmarks;

    // Book selection filter
    if (selectedBookId !== null) {
      bms = bms.filter((bm) => bm.bookId === selectedBookId);
    }

    // Search filter
    if (q) {
      bms = bms.filter((bm) => {
        const book = libraryBooks.find((b) => b.id === bm.bookId);
        return (
          bm.label.toLowerCase().includes(q) ||
          (bm.note?.toLowerCase().includes(q) ?? false) ||
          book?.title.toLowerCase().includes(q) ||
          book?.author.toLowerCase().includes(q)
        );
      });
    }

    // Group by bookId preserving the order books appear in library
    const grouped = new Map<number, MockBookmark[]>();
    bms.forEach((bm) => {
      const arr = grouped.get(bm.bookId) ?? [];
      arr.push(bm);
      grouped.set(bm.bookId, arr);
    });

    // Return as sorted array of [book, bookmarks]
    return Array.from(grouped.entries())
      .map(([bookId, marks]) => ({
        book: libraryBooks.find((b) => b.id === bookId)!,
        marks: marks.sort((a, b) => a.time - b.time),
      }))
      .filter((g) => g.book);
  }, [bookmarks, selectedBookId, q]);

  const allCollapsed =
    filteredGroups.length > 0 &&
    filteredGroups.every((g) => collapsedIds.has(g.book.id));

  function toggleGroup(bookId: number) {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(bookId)) next.delete(bookId);
      else next.add(bookId);
      return next;
    });
  }

  function toggleAll() {
    if (allCollapsed) {
      setCollapsedIds(new Set());
    } else {
      setCollapsedIds(new Set(filteredGroups.map((g) => g.book.id)));
    }
  }

  const totalVisible = filteredGroups.reduce((acc, g) => acc + g.marks.length, 0);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <Sidebar
        activeTab="bookmarks"
        onTabChange={handleTabChange}
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      <main
        className={`flex-1 transition-all duration-300 p-4 md:p-8 pt-20 md:pt-8 min-w-0 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-52'
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Bookmarks</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {bookmarks.length} saved {bookmarks.length === 1 ? 'mark' : 'marks'} across {bookmarkCounts.size} {bookmarkCounts.size === 1 ? 'book' : 'books'}
            </p>
          </div>
          {selectedBookId !== null && (
            <button
              onClick={() => setSelectedBookId(null)}
              className="h-9 px-3 flex items-center gap-1.5 rounded-xl text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-close-line text-sm"></i>
              Clear filter
            </button>
          )}
        </div>

        {/* ── Search bar ── */}
        <div className="relative mb-6">
          <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search books, bookmarks, notes…"
            className="w-full h-11 pl-11 pr-10 rounded-2xl bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-700 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <i className="ri-close-line text-sm"></i>
            </button>
          )}
        </div>

        {/* ── Books shelf ── */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Books
            </h2>
            <span className="text-xs text-gray-300 dark:text-gray-600">
              {shelfBooks.length}
            </span>
            {selectedBookId !== null && (
              <span className="ml-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                Filtered
              </span>
            )}
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4">
            <BooksShelf
              books={shelfBooks}
              bookmarkCounts={bookmarkCounts}
              selectedBookId={selectedBookId}
              onSelect={setSelectedBookId}
            />
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-2 px-1">
            Click a cover to filter · Amber badge = bookmark count · Faded = no bookmarks yet
          </p>
        </section>

        {/* ── Bookmarks list ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Bookmarks
              </h2>
              <span className="text-xs text-gray-300 dark:text-gray-600">{totalVisible}</span>
            </div>
            <div className="flex items-center gap-3">
              {(q || selectedBookId !== null) && totalVisible > 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Showing {totalVisible} result{totalVisible !== 1 ? 's' : ''}
                </p>
              )}
              {filteredGroups.length > 0 && (
                <button
                  onClick={toggleAll}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-amber-500 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <div className="w-3.5 h-3.5 flex items-center justify-center">
                    <i className={`${allCollapsed ? 'ri-expand-up-down-line' : 'ri-collapse-diagonal-line'} text-xs`}></i>
                  </div>
                  {allCollapsed ? 'Expand all' : 'Collapse all'}
                </button>
              )}
            </div>
          </div>

          {filteredGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-900 rounded-2xl">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/20 mb-4">
                <i className="ri-bookmark-line text-2xl text-amber-300 dark:text-amber-700"></i>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {q || selectedBookId !== null ? 'No bookmarks match your search' : 'No bookmarks yet'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {q || selectedBookId !== null
                  ? 'Try a different term or clear the filter'
                  : 'Bookmarks you save while listening will appear here'}
              </p>
            </div>
          ) : (
            filteredGroups.map(({ book, marks }) => (
              <BookmarkGroup
                key={book.id}
                book={book}
                bookmarks={marks}
                isCollapsed={collapsedIds.has(book.id)}
                onToggle={() => toggleGroup(book.id)}
                onDelete={handleDelete}
              />
            ))
          )}
        </section>
      </main>
    </div>
  );
}
