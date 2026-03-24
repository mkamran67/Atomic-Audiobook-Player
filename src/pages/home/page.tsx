import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/feature/Sidebar';
import BookCard from '../../components/feature/BookCard';
import AudioPlayer from '../../components/feature/AudioPlayer';
import CoverImage from '../../components/base/CoverImage';
import ThemeToggle from '../../components/base/ThemeToggle';
import NotificationsPanel from './components/NotificationsPanel';
import type { Notification } from '../../types/notification';
import { useBookProgress } from '../../hooks/useBookProgress';
import { useSidebarCollapsed } from '../../hooks/useSidebarCollapsed';
import { useAppSelector, useAppDispatch } from '../../store';
import { setCurrentTrack, addToQueue, setPlayerCollapsed } from '../../store/playerSlice';

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const playlist = useAppSelector((state) => state.player.playlist);
  const playerCollapsed = useAppSelector((state) => state.player.playerCollapsed);
  const books = useAppSelector((state) => state.library.books);

  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapsed();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifList, setNotifList] = useState<Notification[]>([]);

  const myBooks = books.slice(0, 8);
  const keepReading = books.filter((b) => b.status === 'in-progress');

  const keepReadingForProgress = keepReading.map((b) => ({
    id: b.id,
    progress: b.progress,
    currentChapter: 1,
    totalChapters: 1,
  }));

  const { progressMap, markChapterComplete, markBookComplete, markPreviousChapter, getBookProgress } =
    useBookProgress(keepReadingForProgress);

  // Derive stats from library
  const uniqueAuthors = new Set(books.map((b) => b.author)).size;
  const completedBooks = books.filter((b) => b.status === 'completed').length;
  const totalHours = books.reduce((sum, b) => sum + Math.floor((b.durationMs || 0) / 3600000), 0);

  // Derive popular authors (top 4 by book count)
  const authorCounts = new Map<string, number>();
  books.forEach((b) => authorCounts.set(b.author, (authorCounts.get(b.author) ?? 0) + 1));
  const popularAuthors = Array.from(authorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name], i) => ({ id: i + 1, name }));

  const unreadCount = notifList.filter((n) => !n.read).length;

  const handleMarkRead = (id: number) => {
    setNotifList((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllRead = () => {
    setNotifList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleAddToQueue = (track) => {
    dispatch(addToQueue(track));
  };

  const handleTabChange = (tab) => {
    if (tab === 'library')     { navigate('/library');     return; }
    if (tab === 'settings')    { navigate('/settings');    return; }
    if (tab === 'bookmarks')   { navigate('/bookmarks');   return; }
    if (tab === 'collections') { navigate('/collections'); return; }
    setActiveTab(tab);
  };

  const hasPlayer = currentTrack !== null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        playerBarVisible={playerCollapsed && hasPlayer}
      />

      <main className={`flex-1 transition-all duration-300 px-4 md:px-8 pt-20 md:pt-8 ${playerCollapsed && hasPlayer ? 'pb-52' : 'pb-8'} ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-52'} ${playerCollapsed || !hasPlayer ? 'md:mr-0' : 'md:mr-[400px]'} min-w-0`}>
        <header className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                id="search-input"
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((prev) => !prev)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-purple-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-notification-3-line text-xl text-gray-600 dark:text-gray-300"></i>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <NotificationsPanel
                open={notifOpen}
                onClose={() => setNotifOpen(false)}
                notifications={notifList}
                onMarkRead={handleMarkRead}
                onMarkAllRead={handleMarkAllRead}
              />
            </div>
          </div>
        </header>

        <section className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">My Books</h2>
            <button
              onClick={() => navigate('/library?status=in-progress')}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors whitespace-nowrap cursor-pointer"
            >
              More <i className="ri-arrow-right-line"></i>
            </button>
          </div>
          {myBooks.length > 0 ? (
            <div className="-mx-4 md:-mx-8 flex gap-6 overflow-x-auto pb-4 scrollbar-styled px-4 md:px-8">
              {myBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  status={getBookProgress(book.id)?.status}
                  onClick={() => dispatch(setCurrentTrack({ id: book.id, title: book.title, author: book.author, cover: book.cover, duration: book.duration }))}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-900/20 mb-4">
                <i className="ri-book-2-line text-2xl text-purple-300 dark:text-purple-700"></i>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">No books yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Add a root directory in Settings to get started</p>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
          <section>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">Keep Listening</h2>
              <button
                onClick={() => navigate('/library?status=in-progress')}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors whitespace-nowrap cursor-pointer"
              >
                More <i className="ri-arrow-right-line"></i>
              </button>
            </div>
            {keepReading.length > 0 ? (
              <div className="space-y-3">
                {keepReading.map((book) => {
                  const prog = progressMap[book.id];
                  const isCompleted = prog?.status === 'completed';
                  const isInProgress = prog?.status === 'in-progress';
                  return (
                    <div
                      key={book.id}
                      onClick={() => dispatch(setCurrentTrack({ id: book.id, title: book.title, author: book.author, cover: book.cover, duration: book.duration }))}
                      className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                        currentTrack?.id === book.id
                          ? 'bg-purple-100 dark:bg-purple-900/30 shadow-lg'
                          : 'bg-white dark:bg-gray-800 hover:shadow-lg dark:hover:shadow-purple-900/20'
                      }`}
                    >
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <CoverImage src={book.cover} alt={book.title} className="w-full h-full object-cover object-top" />
                        {isCompleted && (
                          <div className="absolute inset-0 bg-emerald-500/60 flex items-center justify-center">
                            <i className="ri-check-line text-white text-xl"></i>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800 dark:text-white truncate text-sm md:text-base">{book.title}</h3>
                          {isCompleted && (
                            <span className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 whitespace-nowrap hidden sm:inline-flex">
                              Completed
                            </span>
                          )}
                          {isInProgress && (
                            <span className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 whitespace-nowrap hidden sm:inline-flex">
                              In Progress
                            </span>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">{book.author}</p>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isCompleted
                                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                  : 'bg-gradient-to-r from-purple-400 to-purple-500 dark:from-purple-600 dark:to-purple-700'
                              }`}
                              style={{ width: `${prog?.progress ?? book.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
                <i className="ri-headphone-line text-2xl text-gray-300 dark:text-gray-600 mb-2"></i>
                <p className="text-sm text-gray-400 dark:text-gray-500">Start listening to see your progress here</p>
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">Popular Authors</h2>
              <button
                onClick={() => navigate('/library?sort=author&view=list')}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors whitespace-nowrap cursor-pointer"
              >
                More <i className="ri-arrow-right-line"></i>
              </button>
            </div>
            {popularAuthors.length > 0 ? (
              <div className="space-y-3">
                {popularAuthors.map((author) => (
                  <div
                    key={author.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-lg dark:hover:shadow-purple-900/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                          {author.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white text-sm md:text-base">{author.name}</span>
                    </div>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors whitespace-nowrap">
                      <i className="ri-book-2-line text-purple-500 dark:text-purple-400"></i>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
                <i className="ri-user-line text-2xl text-gray-300 dark:text-gray-600 mb-2"></i>
                <p className="text-sm text-gray-400 dark:text-gray-500">Authors will appear as you add books</p>
              </div>
            )}
          </section>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 hover:shadow-lg dark:hover:shadow-purple-900/20 transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-xl mb-3 md:mb-4">
              <i className="ri-book-2-line text-xl md:text-2xl text-purple-500 dark:text-purple-400"></i>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">{books.length}</p>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total Books</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 hover:shadow-lg dark:hover:shadow-purple-900/20 transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-cyan-100 dark:bg-cyan-900/30 rounded-xl mb-3 md:mb-4">
              <i className="ri-user-line text-xl md:text-2xl text-cyan-500 dark:text-cyan-400"></i>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">{uniqueAuthors}</p>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Authors</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 hover:shadow-lg dark:hover:shadow-purple-900/20 transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 rounded-xl mb-3 md:mb-4">
              <i className="ri-book-open-line text-xl md:text-2xl text-emerald-500 dark:text-emerald-400"></i>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">{completedBooks}</p>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Completed</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 hover:shadow-lg dark:hover:shadow-purple-900/20 transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-900/30 rounded-xl mb-3 md:mb-4">
              <i className="ri-file-list-line text-xl md:text-2xl text-orange-500 dark:text-orange-400"></i>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">{totalHours.toLocaleString()}</p>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total Hours</p>
          </div>
        </section>
      </main>

      {currentTrack && (
        <AudioPlayer
          currentTrack={currentTrack}
          playlist={playlist}
          onTrackChange={(track) => dispatch(setCurrentTrack(track))}
          isCollapsed={playerCollapsed}
          onCollapsedChange={(collapsed) => dispatch(setPlayerCollapsed(collapsed))}
          bookProgress={progressMap[currentTrack.id]}
          onChapterComplete={() => markChapterComplete(currentTrack.id)}
          onPreviousChapter={() => markPreviousChapter(currentTrack.id)}
          onBookComplete={() => markBookComplete(currentTrack.id)}
          onAddToQueue={handleAddToQueue}
        />
      )}
    </div>
  );
}
