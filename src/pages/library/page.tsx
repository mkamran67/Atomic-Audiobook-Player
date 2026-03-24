import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebarCollapsed } from '../../hooks/useSidebarCollapsed';
import Sidebar from '../../components/feature/Sidebar';
import GridView from './components/GridView';
import ListView from './components/ListView';
import CompactView from './components/CompactView';
import FolderView from './components/FolderView';
import { useAppSelector, useAppDispatch } from '../../store';
import { toggleLike } from '../../store/librarySlice';

type ViewMode = 'grid' | 'list' | 'folder';
type StatusFilter = 'all' | 'not-started' | 'in-progress' | 'completed' | 'new-arrivals' | 'liked';
type SortBy = 'title' | 'author' | 'rating' | 'progress' | 'year';

const sortLabels: Record<SortBy, string> = {
  title: 'Title A–Z',
  author: 'Author',
  rating: 'Rating',
  progress: 'Progress',
  year: 'Year',
};

export default function LibraryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialFilter = (): StatusFilter => {
    const params = new URLSearchParams(location.search);
    const s = params.get('status') as StatusFilter | null;
    const valid: StatusFilter[] = ['all', 'not-started', 'in-progress', 'completed', 'new-arrivals', 'liked'];
    return s && valid.includes(s) ? s : 'all';
  };

  const getInitialSort = (): SortBy => {
    const params = new URLSearchParams(location.search);
    const s = params.get('sort') as SortBy | null;
    const valid: SortBy[] = ['title', 'author', 'rating', 'progress', 'year'];
    return s && valid.includes(s) ? s : 'title';
  };

  const getInitialView = (): ViewMode => {
    const params = new URLSearchParams(location.search);
    const v = params.get('view') as ViewMode | null;
    const valid: ViewMode[] = ['grid', 'list', 'folder'];
    return v && valid.includes(v) ? v : 'grid';
  };

  const dispatch = useAppDispatch();
  const libraryBooks = useAppSelector((state) => state.library.books);
  const likedIds = useMemo(
    () => new Set(libraryBooks.filter((b) => b.liked).map((b) => b.id)),
    [libraryBooks]
  );

  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapsed();
  const [viewMode, setViewMode] = useState<ViewMode>(getInitialView);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(getInitialFilter);
  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>(getInitialSort);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showGenreMenu, setShowGenreMenu] = useState(false);

  const sortMenuRef = useRef<HTMLDivElement>(null);
  const genreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) setShowSortMenu(false);
      if (genreMenuRef.current && !genreMenuRef.current.contains(e.target as Node)) setShowGenreMenu(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const genres = useMemo(() => Array.from(new Set(libraryBooks.map((b) => b.genre))).sort(), [libraryBooks]);

  const stats = useMemo(() => ({
    total: libraryBooks.length,
    reading: libraryBooks.filter((b) => b.status === 'in-progress').length,
    completed: libraryBooks.filter((b) => b.status === 'completed').length,
    notStarted: libraryBooks.filter((b) => b.status === 'not-started').length,
    newArrivals: libraryBooks.filter((b) => b.year >= 2024).length,
  }), [libraryBooks]);

  const filteredBooks = useMemo(() => {
    let books = [...libraryBooks];

    if (search.trim()) {
      const q = search.toLowerCase();
      books = books.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }

    if (statusFilter === 'liked') {
      books = books.filter((b) => likedIds.has(b.id));
    } else if (statusFilter === 'new-arrivals') {
      books = books.filter((b) => b.year >= 2024);
    } else if (statusFilter !== 'all') {
      books = books.filter((b) => b.status === statusFilter);
    }

    if (genreFilter) books = books.filter((b) => b.genre === genreFilter);

    books.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'title') cmp = a.title.localeCompare(b.title);
      else if (sortBy === 'author') cmp = a.author.localeCompare(b.author);
      else if (sortBy === 'rating') cmp = a.rating - b.rating;
      else if (sortBy === 'progress') cmp = a.progress - b.progress;
      else if (sortBy === 'year') cmp = a.year - b.year;
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return books;
  }, [search, statusFilter, genreFilter, sortBy, sortDir, likedIds]);

  const handleTabChange = (tab: string) => {
    if (tab === 'home')        { navigate('/');            return; }
    if (tab === 'settings')    { navigate('/settings');    return; }
    if (tab === 'bookmarks')   { navigate('/bookmarks');   return; }
    if (tab === 'collections') { navigate('/collections'); return; }
  };

  const handleToggleLike = (id: string) => {
    dispatch(toggleLike(id));
  };

  const handleSort = (col: string) => {
    if (sortBy === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col as SortBy); setSortDir('asc'); }
  };

  const activeFilterCount = (statusFilter !== 'all' ? 1 : 0) + (genreFilter ? 1 : 0);

  const clearFilters = () => { setStatusFilter('all'); setGenreFilter(null); setSearch(''); };

  const statusOptions: { id: StatusFilter; label: string; count: number; color: string }[] = [
    { id: 'all',          label: 'All',          count: stats.total,       color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200' },
    { id: 'in-progress',  label: 'Listening',    count: stats.reading,     color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    { id: 'completed',    label: 'Completed',    count: stats.completed,   color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { id: 'not-started',  label: 'Not Started',  count: stats.notStarted,  color: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400' },
    { id: 'new-arrivals', label: 'New Arrivals', count: stats.newArrivals, color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
    { id: 'liked',        label: 'Liked',        count: likedIds.size,     color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <Sidebar
        activeTab="library"
        onTabChange={handleTabChange}
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      <main
        className={`flex-1 transition-all duration-300 p-4 md:p-8 pt-20 md:pt-8 min-w-0 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-52'
        }`}
      >
        {/* ── Page header ── */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Library</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {filteredBooks.length} of {stats.total} books
            </p>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-3 mb-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books or authors..."
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-700 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer">
                <i className="ri-close-line text-xs"></i>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Genre filter */}
            <div className="relative" ref={genreMenuRef}>
              <button
                onClick={() => setShowGenreMenu((p) => !p)}
                className={`h-10 px-3 flex items-center gap-1.5 rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  genreFilter
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <i className="ri-filter-3-line text-base"></i>
                <span className="hidden sm:inline">{genreFilter ?? 'Genre'}</span>
                {genreFilter && <i className="ri-close-line text-xs cursor-pointer" onClick={(e) => { e.stopPropagation(); setGenreFilter(null); }}></i>}
              </button>
              {showGenreMenu && (
                <div className="absolute top-full mt-1 left-0 w-52 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl z-30 py-2 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => { setGenreFilter(null); setShowGenreMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer whitespace-nowrap ${!genreFilter ? 'text-purple-600 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    All Genres
                  </button>
                  {genres.map((g) => (
                    <button
                      key={g}
                      onClick={() => { setGenreFilter(g); setShowGenreMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer whitespace-nowrap ${genreFilter === g ? 'text-purple-600 font-semibold bg-purple-50 dark:bg-purple-900/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="relative" ref={sortMenuRef}>
              <button
                onClick={() => setShowSortMenu((p) => !p)}
                className="h-10 px-3 flex items-center gap-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-sort-asc text-base"></i>
                <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
                <i className={`ri-arrow-${sortDir === 'asc' ? 'up' : 'down'}-s-line text-xs`}></i>
              </button>
              {showSortMenu && (
                <div className="absolute top-full mt-1 right-0 w-44 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl z-30 py-2">
                  {(Object.keys(sortLabels) as SortBy[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => { handleSort(key); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer whitespace-nowrap flex items-center justify-between ${sortBy === key ? 'text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-900/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                      {sortLabels[key]}
                      {sortBy === key && <i className={`ri-arrow-${sortDir === 'asc' ? 'up' : 'down'}-s-line text-purple-500`}></i>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
              {([
                { mode: 'grid'   as ViewMode, icon: 'ri-layout-grid-line', tip: 'Grid'   },
                { mode: 'list'   as ViewMode, icon: 'ri-list-unordered',   tip: 'List'   },
                { mode: 'folder' as ViewMode, icon: 'ri-folder-line',      tip: 'Folders' },
              ]).map(({ mode, icon, tip }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  title={tip}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    viewMode === mode
                      ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <i className={`${icon} text-base`}></i>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Status filter pills ── */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto py-1 px-0.5 scrollbar-hide">
          {statusOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setStatusFilter(opt.id)}
              className={`h-8 px-3 flex items-center gap-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === opt.id
                  ? opt.color + ' ring-2 ring-offset-1 ring-purple-300 dark:ring-purple-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {opt.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${statusFilter === opt.id ? 'bg-white/40 dark:bg-black/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                {opt.count}
              </span>
            </button>
          ))}

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="h-8 px-3 flex items-center gap-1 rounded-full text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 flex-shrink-0 transition-colors cursor-pointer whitespace-nowrap ml-1"
            >
              <i className="ri-close-line text-sm"></i>
              Clear filters
            </button>
          )}
        </div>

        {/* ── Book views ── */}
        {viewMode === 'grid' && (
          <GridView books={filteredBooks} likedIds={likedIds} onToggleLike={handleToggleLike} />
        )}
        {viewMode === 'list' && (
          <ListView
            books={filteredBooks}
            likedIds={likedIds}
            onToggleLike={handleToggleLike}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={handleSort}
          />
        )}
        {viewMode === 'folder' && (
          <FolderView books={filteredBooks} likedIds={likedIds} onToggleLike={handleToggleLike} />
        )}
      </main>
    </div>
  );
}
