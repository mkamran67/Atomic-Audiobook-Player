import { useState, useEffect, useRef } from 'react';
import { BookProgressData, BookStatus } from '../../hooks/useBookProgress';
import { useBookmarks, Bookmark } from '../../hooks/useBookmarks';
import { myBooks } from '../../mocks/books';
import { Track } from '../../store/playerSlice';

interface AudioPlayerProps {
  currentTrack: Track;
  playlist: Track[];
  onTrackChange: (track: Track) => void;
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  bookProgress?: BookProgressData;
  onChapterComplete?: () => void;
  onPreviousChapter?: () => void;
  onBookComplete?: () => void;
  onAddToQueue?: (track: Track) => void;
}

const statusConfig: Record<BookStatus, { label: string; classes: string; icon: string }> = {
  'not-started': {
    label: 'Not Started',
    classes: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
    icon: 'ri-time-line',
  },
  'in-progress': {
    label: 'In Progress',
    classes: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    icon: 'ri-headphone-line',
  },
  completed: {
    label: 'Completed',
    classes: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    icon: 'ri-checkbox-circle-line',
  },
};

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2];

interface EqPreset {
  id: string;
  name: string;
  description: string;
}

const DEFAULT_EQ_PRESETS: EqPreset[] = [
  { id: 'flat', name: 'Flat', description: 'No adjustments' },
  { id: 'voice', name: 'Voice Clarity', description: 'Great for spoken word' },
  { id: 'bass-boost', name: 'Bass Boost', description: 'Enhanced low frequencies' },
  { id: 'treble', name: 'Treble Boost', description: 'Crisp high frequencies' },
  { id: 'podcast', name: 'Podcast', description: 'Mid-range warmth boost' },
];

export default function AudioPlayer({
  currentTrack,
  playlist,
  onTrackChange,
  isCollapsed,
  onCollapsedChange,
  bookProgress,
  onChapterComplete,
  onPreviousChapter,
  onBookComplete,
  onAddToQueue,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // toolbar state
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [showTimerMenu, setShowTimerMenu] = useState(false);
  const [volumeBoost, setVolumeBoost] = useState(false);
  const [equalizerOn, setEqualizerOn] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showEqMenu, setShowEqMenu] = useState(false);
  const [eqPresets, setEqPresets] = useState<EqPreset[]>(DEFAULT_EQ_PRESETS);
  const [activeEqPreset, setActiveEqPreset] = useState<string | null>(null);
  const [showCreateEqModal, setShowCreateEqModal] = useState(false);
  const [newEqName, setNewEqName] = useState('');

  // ── Pending bookmark (inline create panel) ────────────────────────────────
  const [pendingBookmark, setPendingBookmark] = useState<{ time: number; label: string; note: string } | null>(null);
  const [autoSaveSeconds, setAutoSaveSeconds] = useState(5);
  const [autoSavePaused, setAutoSavePaused] = useState(false);
  const pendingNoteRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingBookmarkRef = useRef<{ time: number; label: string; note: string } | null>(null);

  // ── Toast ─────────────────────────────────────────────────────────────────
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 2600);
  };

  // chapter / edit state
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'queue' | 'bookmarks'>('queue');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editNote, setEditNote] = useState('');

  const timerMenuRef = useRef<HTMLDivElement>(null);
  const speedMenuRef = useRef<HTMLDivElement>(null);
  const eqMenuRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const bottomProgressRef = useRef<HTMLDivElement>(null);
  const chapterProgressRef = useRef<HTMLDivElement>(null);
  const editLabelRef = useRef<HTMLInputElement>(null);

  const [playerView, setPlayerView] = useState<'player' | 'list'>('player');

  const { addBookmark, updateBookmark, removeBookmark, getBookmarks } = useBookmarks();
  const trackBookmarks = getBookmarks(currentTrack.id);

  // ── Effects ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (currentTrack) {
      const [h, m, s] = currentTrack.duration.split(':').map(Number);
      setDuration(h * 3600 + m * 60 + s);
    }
  }, [currentTrack]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime((prev) => Math.min(prev + playbackSpeed, duration));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration, playbackSpeed]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); setIsPlaying((p) => !p); }
      else if (e.code === 'ArrowRight') setCurrentTime((p) => Math.min(p + 10, duration));
      else if (e.code === 'ArrowLeft') setCurrentTime((p) => Math.max(p - 10, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [duration]);

  useEffect(() => {
    if (sleepTimer === null) return;
    if (sleepTimer <= 0) { setIsPlaying(false); setSleepTimer(null); return; }
    const tick = setInterval(() => setSleepTimer((p) => (p !== null ? p - 1 : null)), 1000);
    return () => clearInterval(tick);
  }, [sleepTimer]);

  const [queueSearch, setQueueSearch] = useState('');
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [collections, setCollections] = useState<{ id: number; name: string; tracks: Track[] }[]>([]);

  const queueSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (timerMenuRef.current && !timerMenuRef.current.contains(e.target as Node)) setShowTimerMenu(false);
      if (speedMenuRef.current && !speedMenuRef.current.contains(e.target as Node)) setShowSpeedMenu(false);
      if (eqMenuRef.current && !eqMenuRef.current.contains(e.target as Node)) setShowEqMenu(false);
      if (queueSearchRef.current && !queueSearchRef.current.contains(e.target as Node)) setQueueSearch('');
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    if (editingId) setTimeout(() => editLabelRef.current?.focus(), 30);
  }, [editingId]);

  useEffect(() => { pendingBookmarkRef.current = pendingBookmark; }, [pendingBookmark]);

  // ── Auto-save timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!pendingBookmark || autoSavePaused) {
      if (autoSaveIntervalRef.current) clearInterval(autoSaveIntervalRef.current);
      return;
    }
    autoSaveIntervalRef.current = setInterval(() => {
      setAutoSaveSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(autoSaveIntervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (autoSaveIntervalRef.current) clearInterval(autoSaveIntervalRef.current); };
  }, [pendingBookmark, autoSavePaused]);

  useEffect(() => {
    if (autoSaveSeconds === 0 && pendingBookmarkRef.current && !autoSavePaused) {
      const pb = pendingBookmarkRef.current;
      const entry = addBookmark(currentTrack.id, pb.time, pb.label.trim() || 'Bookmark');
      if (pb.note.trim()) updateBookmark(entry.id, entry.label, pb.note.trim());
      setPendingBookmark(null);
      triggerToast();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSaveSeconds]);

  useEffect(() => {
    if (pendingBookmark) setTimeout(() => pendingNoteRef.current?.focus(), 60);
  }, [pendingBookmark]);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const formatSleepTimer = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCurrentTime((e.clientX - rect.left) / rect.width * duration);
    }
  };

  const handleSkip = (seconds: number) =>
    setCurrentTime((p) => Math.max(0, Math.min(p + seconds, duration)));

  const handleNext = () => {
    const i = playlist.findIndex((t) => t.id === currentTrack.id);
    onTrackChange(playlist[(i + 1) % playlist.length]);
    setCurrentTime(0);
  };

  const handlePrevious = () => {
    const i = playlist.findIndex((t) => t.id === currentTrack.id);
    onTrackChange(playlist[i === 0 ? playlist.length - 1 : i - 1]);
    setCurrentTime(0);
  };

  const handleAddBookmark = () => {
    const label = bookProgress
      ? `Ch ${bookProgress.currentChapter} · ${formatTime(currentTime)}`
      : formatTime(currentTime);
    setPendingBookmark({ time: currentTime, label, note: '' });
    setAutoSaveSeconds(5);
    setAutoSavePaused(false);
    setActiveTab('bookmarks');
  };

  const handleConfirmBookmark = () => {
    const pb = pendingBookmarkRef.current;
    if (!pb) return;
    if (autoSaveIntervalRef.current) clearInterval(autoSaveIntervalRef.current);
    const entry = addBookmark(currentTrack.id, pb.time, pb.label.trim() || 'Bookmark');
    if (pb.note.trim()) updateBookmark(entry.id, entry.label, pb.note.trim());
    setPendingBookmark(null);
    triggerToast();
  };

  const handleCancelPending = () => {
    if (autoSaveIntervalRef.current) clearInterval(autoSaveIntervalRef.current);
    setPendingBookmark(null);
  };

  const handlePendingNoteChange = (val: string) => {
    setPendingBookmark((pb) => pb ? { ...pb, note: val } : null);
    if (!autoSavePaused) setAutoSavePaused(true);
  };

  const handlePendingLabelChange = (val: string) => {
    setPendingBookmark((pb) => pb ? { ...pb, label: val } : null);
    if (!autoSavePaused) setAutoSavePaused(true);
  };

  const handleStartEdit = (bm: Bookmark) => { setEditingId(bm.id); setEditLabel(bm.label); setEditNote(bm.note || ''); };
  const handleSaveEdit = () => {
    if (editingId) updateBookmark(editingId, editLabel.trim() || 'Bookmark', editNote.trim() || undefined);
    setEditingId(null);
  };

  const handleMarkChapterDone = () => { if (bookProgress?.status !== 'completed') onChapterComplete?.(); };
  const handlePreviousChapter = () => {
    if (bookProgress && bookProgress.currentChapter > 0) onPreviousChapter?.();
  };

  const handleMarkBookComplete = () => { onBookComplete?.(); setShowCompleteConfirm(false); };

  const handleCreateEqPreset = () => {
    if (!newEqName.trim()) return;
    const preset: EqPreset = {
      id: `custom-${Date.now()}`,
      name: newEqName.trim(),
      description: 'Custom preset',
    };
    setEqPresets((prev) => [...prev, preset]);
    setActiveEqPreset(preset.id);
    setEqualizerOn(true);
    setNewEqName('');
    setShowCreateEqModal(false);
    setShowEqMenu(false);
  };

  const handleSelectEqPreset = (preset: EqPreset) => {
    if (activeEqPreset === preset.id) {
      setActiveEqPreset(null);
      setEqualizerOn(false);
    } else {
      setActiveEqPreset(preset.id);
      setEqualizerOn(true);
    }
    setShowEqMenu(false);
  };

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // ── Chapter progress math ─────────────────────────────────────────────────
  const totalChapters = bookProgress?.totalChapters ?? 1;
  const currentChapterIndex = bookProgress?.currentChapter ?? 0;
  const chapterDuration = duration > 0 ? duration / totalChapters : 0;
  const chapterStartTime = currentChapterIndex * chapterDuration;
  const chapterCurrentTime = Math.max(0, currentTime - chapterStartTime);
  const chapterProgress = chapterDuration > 0
    ? Math.min((chapterCurrentTime / chapterDuration) * 100, 100)
    : progressPercent;

  const handleChapterProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (chapterProgressRef.current && chapterDuration > 0) {
      const rect = chapterProgressRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
      setCurrentTime(chapterStartTime + ratio * chapterDuration);
    }
  };

  // ── Queue search pool ────────────────────────────────────────────────────────
  const allAvailableBooks: Track[] = myBooks.map((b) => ({
    id: b.id + 1000,
    title: b.title,
    author: b.author,
    cover: b.cover,
    duration: '6:00:00',
  }));

  const searchResults = queueSearch.trim()
    ? allAvailableBooks.filter(
        (b) =>
          !playlist.some((p) => p.title === b.title) &&
          (b.title.toLowerCase().includes(queueSearch.toLowerCase()) ||
            b.author.toLowerCase().includes(queueSearch.toLowerCase()))
      )
    : [];

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    setCollections((prev) => [
      ...prev,
      { id: Date.now(), name: newCollectionName.trim(), tracks: [...playlist] },
    ]);
    setShowCreateCollection(false);
    setNewCollectionName('');
  };

  // circular countdown ring
  const RING_R = 14;
  const RING_C = 2 * Math.PI * RING_R;
  const ringOffset = autoSavePaused ? 0 : RING_C * (1 - autoSaveSeconds / 5);

  const timerOptions = [
    { label: '5 min', seconds: 5 * 60 }, { label: '10 min', seconds: 10 * 60 },
    { label: '15 min', seconds: 15 * 60 }, { label: '30 min', seconds: 30 * 60 },
    { label: '45 min', seconds: 45 * 60 }, { label: '60 min', seconds: 60 * 60 },
  ];

  // ── Toolbar button base ────────────────────────────────────────────────────
  const toolbarBtn = (active: boolean, activeClass: string) =>
    `w-12 h-12 flex flex-col items-center justify-center rounded-xl transition-all whitespace-nowrap cursor-pointer ${active ? activeClass : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`;

  // ── EQ Bars indicator ─────────────────────────────────────────────────────────
  const EqBars = ({ small = false }: { small?: boolean }) => {
    const h = small ? 10 : 14;
    const w = small ? 2 : 2.5;
    const durations = [0.65, 0.8, 0.55, 0.7];
    const delays = [0, 0.18, 0.32, 0.1];
    return (
      <div className="flex items-end flex-shrink-0" style={{ height: h, gap: small ? 1.5 : 2 }}>
        {durations.map((dur, i) => (
          <div
            key={i}
            style={{
              width: w,
              height: h,
              backgroundColor: '#8b5cf6',
              borderRadius: 2,
              transformOrigin: 'bottom',
              animation: `eqBounce ${dur}s ease-in-out ${delays[i]}s infinite`,
            }}
          />
        ))}
      </div>
    );
  };

  // ── Skip button ───────────────────────────────────────────────────────────────
  const SkipBtn = ({ seconds, label, large }: { seconds: number; label: string; large?: boolean }) => (
    <button
      onClick={() => handleSkip(seconds)}
      className={`flex flex-col items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap cursor-pointer gap-0.5 ${large ? 'w-12 h-12' : 'w-11 h-11'}`}
    >
      <i className={`${seconds < 0 ? 'ri-rewind-fill' : 'ri-speed-fill'} text-gray-600 dark:text-gray-400 ${large ? 'text-xl' : 'text-lg'}`}></i>
      <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 leading-none">{label}</span>
    </button>
  );

  // ── Bottom bar (collapsed) ────────────────────────────────────────────────────
  if (isCollapsed) {
    return (
      <>
        {/* ── Toast notification ── */}
        {toastVisible && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
            <div
              className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-amber-200 dark:border-amber-700/50"
              style={{ animation: 'toastSlide 2.6s ease-out forwards' }}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 flex-shrink-0">
                <i className="ri-bookmark-fill text-sm text-amber-500"></i>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white whitespace-nowrap">Bookmark saved!</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Added to your bookmarks</p>
              </div>
              <i className="ri-checkbox-circle-fill text-emerald-500 text-lg ml-1 flex-shrink-0"></i>
            </div>
          </div>
        )}

        {/* ── Bookmark popup (collapsed mode) ── */}
        {pendingBookmark && (
          <>
            <div className="fixed inset-0 z-[55]" onClick={handleCancelPending} />
            <div className="fixed bottom-[172px] left-0 right-0 z-[60] flex justify-center px-6 pointer-events-none">
              <div
                className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl border border-amber-300 dark:border-amber-600/60 shadow-2xl p-4 space-y-3 pointer-events-auto"
                style={{ animation: 'slideUpFade 0.2s ease-out' }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <i className="ri-bookmark-fill text-amber-500 text-sm"></i>
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">New Bookmark</span>
                    <span className="text-xs font-mono text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-lg">
                      {formatTime(pendingBookmark.time)}
                    </span>
                  </div>
                  <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
                    <svg width="36" height="36" className="-rotate-90">
                      <circle cx="18" cy="18" r={RING_R} stroke="#fde68a" strokeWidth="3" fill="none" />
                      <circle
                        cx="18" cy="18" r={RING_R}
                        stroke={autoSavePaused ? '#d1d5db' : '#f59e0b'}
                        strokeWidth="3" fill="none"
                        strokeDasharray={RING_C}
                        strokeDashoffset={ringOffset}
                        strokeLinecap="round"
                        style={{ transition: autoSavePaused ? 'none' : 'stroke-dashoffset 1s linear' }}
                      />
                    </svg>
                    <span className="absolute text-[10px] font-bold" style={{ color: autoSavePaused ? '#9ca3af' : '#f59e0b' }}>
                      {autoSavePaused
                        ? <i className="ri-pause-fill text-xs text-gray-400"></i>
                        : autoSaveSeconds
                      }
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-amber-600/70 dark:text-amber-400/60 -mt-1">
                  {autoSavePaused
                    ? 'Timer paused — save when you\'re done'
                    : `Auto-saving in ${autoSaveSeconds}s — start typing to pause`}
                </p>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">Title</label>
                  <input
                    value={pendingBookmark.label}
                    onChange={(e) => handlePendingLabelChange(e.target.value)}
                    className="w-full text-sm bg-white dark:bg-gray-700 border border-amber-300 dark:border-amber-600 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-600 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">
                    Note <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    ref={pendingNoteRef}
                    value={pendingBookmark.note}
                    onChange={(e) => handlePendingNoteChange(e.target.value)}
                    placeholder="What caught your attention here?"
                    rows={2}
                    maxLength={500}
                    className="w-full resize-none text-sm bg-white dark:bg-gray-700 border border-amber-200 dark:border-amber-700/50 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-600 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 leading-relaxed"
                  />
                  <p className="text-xs text-gray-400 text-right mt-0.5">{pendingBookmark.note.length}/500</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelPending}
                    className="flex-1 h-8 rounded-xl border border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBookmark}
                    className="flex-1 h-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <i className="ri-bookmark-fill text-xs"></i>
                    Save Bookmark
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── The bar itself ── */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700">
            <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="px-4 py-3 flex gap-4 items-stretch">
            <div className="w-16 h-16 self-center rounded-xl overflow-hidden flex-shrink-0 shadow-md">
              <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover object-top" />
            </div>

            <div className="flex-1 flex flex-col gap-2 min-w-0">
              {/* Mobile Row 1 */}
              <div className="flex sm:hidden items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{currentTrack.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{currentTrack.author}</p>
                </div>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors shadow-md whitespace-nowrap cursor-pointer flex-shrink-0"
                >
                  <i className={`${isPlaying ? 'ri-pause-fill' : 'ri-play-fill'} text-xl`}></i>
                </button>
                <button
                  onClick={() => onCollapsedChange(false)}
                  title="Expand player"
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap cursor-pointer flex-shrink-0"
                >
                  <i className="ri-layout-right-2-line text-lg text-gray-500 dark:text-gray-400"></i>
                </button>
              </div>

              {/* Desktop Row 1 */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="min-w-0 flex-shrink-0" style={{ width: 170 }}>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{currentTrack.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentTrack.author}</p>
                    {equalizerOn && activeEqPreset && (
                      <span className="flex items-center gap-1 flex-shrink-0 px-1.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30">
                        <EqBars small />
                        <span className="text-[9px] font-semibold text-violet-600 dark:text-violet-400 leading-none whitespace-nowrap">
                          {eqPresets.find((p) => p.id === activeEqPreset)?.name}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="relative" ref={timerMenuRef}>
                    <button
                      onClick={() => { setShowSpeedMenu(false); setShowTimerMenu((p) => !p); }}
                      title="Sleep Timer"
                      className={`w-9 h-9 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                        sleepTimer !== null
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-500'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <i className="ri-moon-line text-base leading-none"></i>
                      {sleepTimer !== null && (
                        <span className="text-[8px] font-bold leading-none mt-0.5 text-orange-500">{formatSleepTimer(sleepTimer)}</span>
                      )}
                    </button>
                    {showTimerMenu && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-44 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 py-1">
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-4 pt-3 pb-2">Sleep Timer</p>
                        {timerOptions.map((opt) => (
                          <button key={opt.seconds} onClick={() => { setSleepTimer(opt.seconds); setShowTimerMenu(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer ${sleepTimer === opt.seconds ? 'text-orange-500 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
                          >
                            {opt.label}
                            {sleepTimer === opt.seconds && <span className="ml-2 text-xs text-orange-400">({formatSleepTimer(sleepTimer)})</span>}
                          </button>
                        ))}
                        {sleepTimer !== null && (
                          <>
                            <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                            <button onClick={() => { setSleepTimer(null); setShowTimerMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors whitespace-nowrap cursor-pointer">
                              Cancel timer
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setVolumeBoost((p) => !p)}
                    title="Volume Boost"
                    className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                      volumeBoost
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <i className={`${volumeBoost ? 'ri-volume-up-fill' : 'ri-volume-up-line'} text-base`}></i>
                  </button>
                  <div className="relative" ref={speedMenuRef}>
                    <button
                      onClick={() => { setShowTimerMenu(false); setShowEqMenu(false); setShowSpeedMenu((p) => !p); }}
                      title="Playback Speed"
                      className={`w-9 h-9 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                        playbackSpeed !== 1
                          ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <i className="ri-speed-up-line text-base leading-none"></i>
                      <span className={`text-[8px] font-bold leading-none mt-0.5 ${playbackSpeed !== 1 ? 'text-sky-500' : 'text-gray-400 dark:text-gray-500'}`}>
                        {playbackSpeed}x
                      </span>
                    </button>
                    {showSpeedMenu && (
                      <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-44 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 py-1">
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-4 pt-3 pb-2">Playback Speed</p>
                        {SPEED_OPTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => { setPlaybackSpeed(s); setShowSpeedMenu(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer flex items-center justify-between ${playbackSpeed === s ? 'text-sky-600 dark:text-sky-400 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
                          >
                            <span>{s}x</span>
                            {s === 1 && <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">Normal</span>}
                            {playbackSpeed === s && s !== 1 && <i className="ri-check-line text-sky-500 text-sm"></i>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative" ref={eqMenuRef}>
                    <button
                      onClick={() => { setShowTimerMenu(false); setShowSpeedMenu(false); setShowEqMenu((p) => !p); }}
                      title="Equalizer"
                      className={toolbarBtn(equalizerOn, 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400')}
                    >
                      <i className={`${equalizerOn ? 'ri-equalizer-fill' : 'ri-equalizer-line'} text-lg`}></i>
                      {equalizerOn && activeEqPreset
                        ? <span className="text-[9px] font-bold leading-none mt-0.5 text-violet-500 truncate max-w-[44px]">{eqPresets.find((p) => p.id === activeEqPreset)?.name.slice(0, 6)}</span>
                        : <span className="text-[9px] font-medium leading-none mt-0.5 text-gray-400 dark:text-gray-500">eq</span>
                      }
                    </button>
                    {showEqMenu && (
                      <div className="absolute bottom-full mb-2 right-0 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 py-1">
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-4 pt-3 pb-2">Equalizer</p>
                        {eqPresets.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => handleSelectEqPreset(preset)}
                            className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-between gap-2 ${activeEqPreset === preset.id ? 'text-violet-600 dark:text-violet-400' : 'text-gray-700 dark:text-gray-300'}`}
                          >
                            <div className="min-w-0">
                              <p className={`text-sm font-medium truncate ${activeEqPreset === preset.id ? 'font-semibold' : ''}`}>{preset.name}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{preset.description}</p>
                            </div>
                            {activeEqPreset === preset.id && <i className="ri-check-line text-violet-500 flex-shrink-0"></i>}
                          </button>
                        ))}
                        <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                        <button
                          onClick={() => { setShowEqMenu(false); setShowCreateEqModal(true); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
                        >
                          <i className="ri-add-circle-line text-base"></i>
                          Create new preset
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleAddBookmark}
                    title="Bookmark this moment"
                    className={toolbarBtn(!!pendingBookmark, 'bg-amber-100 dark:bg-amber-900/30 text-amber-500 scale-110')}
                  >
                    <i className={`${pendingBookmark ? 'ri-bookmark-fill' : 'ri-bookmark-line'} text-lg ${pendingBookmark ? 'text-amber-500' : ''}`}></i>
                    {trackBookmarks.length > 0
                      ? <span className="text-[9px] font-bold leading-none mt-0.5 text-amber-500">{trackBookmarks.length}</span>
                      : <span className="text-[9px] font-medium leading-none mt-0.5 text-gray-400 dark:text-gray-500">mark</span>
                    }
                  </button>
                </div>
                <button
                  onClick={() => onCollapsedChange(false)}
                  title="Expand player"
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap cursor-pointer flex-shrink-0"
                >
                  <i className="ri-layout-right-2-line text-lg text-gray-500 dark:text-gray-400"></i>
                </button>
              </div>

              {/* Row 2: Progress scrubber */}
              <div className="max-w-[80%] mx-auto w-full">
                <div
                  ref={bottomProgressRef}
                  onClick={(e) => handleProgressClick(e, bottomProgressRef)}
                  className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative"
                >
                  {duration > 0 && trackBookmarks.map((bm) => (
                    <div
                      key={bm.id}
                      title={bm.note ? `${bm.label}: ${bm.note.slice(0, 50)}` : bm.label}
                      className="absolute top-0 w-1 h-2.5 rounded-sm bg-amber-500 -translate-x-1/2 pointer-events-none"
                      style={{ left: `${(bm.time / duration) * 100}%` }}
                    />
                  ))}
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full relative transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-orange-500 rounded-full shadow-md" />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Row 3: Chapter badge + media controls + chapter buttons */}
              <div className="flex items-center">
                <div className="flex-1 flex items-center">
                  {bookProgress && (
                    <span className={`flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full ${statusConfig[bookProgress.status].classes}`}>
                      <i className={`${statusConfig[bookProgress.status].icon} text-[10px]`}></i>
                      Ch {bookProgress.currentChapter}/{bookProgress.totalChapters}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <SkipBtn seconds={-60} label="1m" large />
                  <SkipBtn seconds={-10} label="10s" />
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-orange-500 hover:bg-orange-600 text-white transition-colors shadow-lg whitespace-nowrap cursor-pointer mx-1"
                  >
                    <i className={`${isPlaying ? 'ri-pause-fill' : 'ri-play-fill'} text-3xl`}></i>
                  </button>
                  <SkipBtn seconds={10} label="10s" />
                  <SkipBtn seconds={60} label="1m" large />
                </div>
                <div className="flex-1 hidden sm:flex items-center justify-end gap-1">
                  {bookProgress && bookProgress.status !== 'completed' && (
                    <>
                      <button
                        onClick={handlePreviousChapter}
                        disabled={bookProgress.currentChapter === 0}
                        title="Previous chapter"
                        className={`h-7 px-2 flex items-center justify-center gap-0.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer border ${
                          bookProgress.currentChapter === 0
                            ? 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                            : 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/40'
                        }`}
                      >
                        <i className="ri-arrow-left-s-line text-sm"></i>
                        Prev
                      </button>
                      <button
                        onClick={handleMarkChapterDone}
                        className="h-7 px-2 flex items-center justify-center gap-0.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-check-line text-sm"></i>
                        Done
                      </button>
                      <button
                        onClick={() => setShowCompleteConfirm(true)}
                        title="Mark book complete"
                        className="h-7 w-7 flex items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 transition-colors whitespace-nowrap cursor-pointer border border-emerald-200 dark:border-emerald-800"
                      >
                        <i className="ri-checkbox-circle-line text-xs"></i>
                      </button>
                    </>
                  )}
                  {bookProgress?.status === 'completed' && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                      <i className="ri-checkbox-circle-fill text-emerald-500 text-lg"></i>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">Completed!</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 sm:hidden" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Sidebar (expanded) ────────────────────────────────────────────────────────
  return (
    <div className="fixed right-0 top-0 w-full md:w-[400px] h-screen bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden z-[65]">

      {/* ── Toast notification ── */}
      {toastVisible && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
          <div
            className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-amber-200 dark:border-amber-700/50"
            style={{ animation: 'toastSlide 2.6s ease-out forwards' }}
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 flex-shrink-0">
              <i className="ri-bookmark-fill text-sm text-amber-500"></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white whitespace-nowrap">Bookmark saved!</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Added to your bookmarks</p>
            </div>
            <i className="ri-checkbox-circle-fill text-emerald-500 text-lg ml-1 flex-shrink-0"></i>
          </div>
        </div>
      )}

      {/* Layout / collapse buttons */}
      <div className="flex gap-3 px-6 pt-6 w-full flex-shrink-0">
        <button
          onClick={() => setPlayerView('player')}
          className={`flex-1 h-12 rounded-2xl flex items-center justify-center transition-colors whitespace-nowrap cursor-pointer ${
            playerView === 'player'
              ? 'bg-purple-400 dark:bg-purple-600 text-white hover:bg-purple-500 dark:hover:bg-purple-700'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <i className="ri-layout-grid-line text-xl"></i>
        </button>
        <button
          onClick={() => setPlayerView('list')}
          className={`flex-1 h-12 rounded-2xl flex items-center justify-center transition-colors whitespace-nowrap cursor-pointer gap-1.5 ${
            playerView === 'list'
              ? 'bg-purple-400 dark:bg-purple-600 text-white hover:bg-purple-500 dark:hover:bg-purple-700'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <i className="ri-list-unordered text-xl"></i>
        </button>
        <button onClick={() => onCollapsedChange(true)} className="h-12 px-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer">
          <i className="ri-arrow-down-s-line text-xl"></i>
        </button>
      </div>

      {/* ══════════════ LIST VIEW ══════════════ */}
      {playerView === 'list' && (
        <div className="flex flex-col flex-1 min-h-0 px-6 pt-5 pb-6">
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white">Queue</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{playlist.length} audiobooks</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              {playlist.findIndex((t) => t.id === currentTrack.id) + 1} / {playlist.length}
            </span>
          </div>

          <div className="relative mb-3 flex-shrink-0" ref={queueSearchRef}>
            <div className="flex items-center gap-2 px-3 h-9 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                <i className="ri-search-line text-gray-400 text-sm"></i>
              </div>
              <input
                value={queueSearch}
                onChange={(e) => setQueueSearch(e.target.value)}
                placeholder="Search to add books..."
                className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
              />
              {queueSearch && (
                <button
                  onClick={() => setQueueSearch('')}
                  className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 cursor-pointer flex-shrink-0 whitespace-nowrap"
                >
                  <i className="ri-close-line text-xs"></i>
                </button>
              )}
            </div>
            {queueSearch.trim() && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl z-20 overflow-hidden max-h-52 overflow-y-auto">
                {searchResults.map((book) => (
                  <div key={book.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={book.cover} alt={book.title} className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{book.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{book.author}</p>
                    </div>
                    <button
                      onClick={() => { onAddToQueue?.(book); setQueueSearch(''); }}
                      className="h-7 px-2.5 flex items-center gap-1 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
                    >
                      <i className="ri-add-line text-xs"></i>
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
            {queueSearch.trim() && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl z-20 p-4 text-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700 mx-auto mb-3">
                  <i className="ri-book-open-line text-gray-400 text-sm"></i>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">No books found for &ldquo;{queueSearch}&rdquo;</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Try a different title or author name</p>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 space-y-1.5">
            {playlist.map((track, index) => {
              const isActive = track.id === currentTrack.id;
              return (
                <div
                  key={track.id}
                  onClick={() => { onTrackChange(track); setCurrentTime(0); }}
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${currentTrack.id === track.id ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50' : ''}`}
                >
                  <div className={`w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 text-xs font-bold transition-colors ${
                    isActive ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {isActive && isPlaying
                      ? <i className="ri-equalizer-line text-xs animate-pulse"></i>
                      : isActive
                        ? <i className="ri-pause-mini-fill text-xs"></i>
                        : <span>{index + 1}</span>
                    }
                  </div>
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-purple-700 dark:text-purple-300' : 'text-gray-800 dark:text-white'}`}>
                      {track.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{track.author}</p>
                    {track.totalChapters && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {track.totalChapters} chapters · {track.duration}
                      </p>
                    )}
                  </div>
                  {isActive && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsPlaying((p) => !p); }}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-purple-500 hover:bg-purple-600 text-white transition-colors flex-shrink-0 whitespace-nowrap cursor-pointer"
                    >
                      <i className={`${isPlaying ? 'ri-pause-fill' : 'ri-play-fill'} text-xl`}></i>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex-shrink-0 mt-3">
            <button
              onClick={() => setShowCreateCollection(true)}
              className="w-full h-10 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-400 dark:text-gray-500 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-500 dark:hover:text-purple-400 transition-colors cursor-pointer whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-folder-add-line text-sm"></i>
              </div>
              Create Collection
            </button>
          </div>

          <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 cursor-pointer overflow-hidden"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setCurrentTime(((e.clientX - rect.left) / rect.width) * duration);
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover object-top" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 dark:text-white truncate">{currentTrack.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{formatTime(currentTime)} · {formatTime(duration)}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => handleSkip(-10)} className="w-8 h-8 flex flex-col items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-rewind-fill text-gray-600 dark:text-gray-400 text-sm"></i>
                  <span className="text-[8px] font-bold text-gray-400 leading-none">10s</span>
                </button>
                <button
                  onClick={() => setIsPlaying((p) => !p)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-purple-500 hover:bg-purple-600 text-white transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className={`${isPlaying ? 'ri-pause-fill' : 'ri-play-fill'} text-xl`}></i>
                </button>
                <button onClick={() => handleSkip(10)} className="w-8 h-8 flex flex-col items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-speed-fill text-gray-600 dark:text-gray-400 text-sm"></i>
                  <span className="text-[8px] font-bold text-gray-400 leading-none">10s</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ PLAYER VIEW ══════════════ */}
      {playerView === 'player' && (
        <>
          <div className="flex flex-col items-center px-6 pt-4 overflow-y-auto flex-shrink-0">

            {/* ── Top toolbar ── */}
            <div className="w-full flex items-center justify-between mb-5 flex-shrink-0">
              <div className="relative" ref={timerMenuRef}>
                <button onClick={() => setShowTimerMenu((p) => !p)} title="Sleep Timer"
                  className={toolbarBtn(sleepTimer !== null, 'bg-orange-100 dark:bg-orange-900/30 text-orange-500')}>
                  <i className="ri-moon-line text-lg"></i>
                  {sleepTimer !== null
                    ? <span className="text-[9px] font-bold leading-none mt-0.5 text-orange-500">{formatSleepTimer(sleepTimer)}</span>
                    : <span className="text-[9px] font-medium leading-none mt-0.5 text-gray-400 dark:text-gray-500">sleep</span>
                  }
                </button>
                {showTimerMenu && (
                  <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-44 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 py-1">
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-4 pt-3 pb-2">Sleep Timer</p>
                    {timerOptions.map((opt) => (
                      <button key={opt.seconds} onClick={() => { setSleepTimer(opt.seconds); setShowTimerMenu(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer ${sleepTimer === opt.seconds ? 'text-orange-500 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        {opt.label}
                        {sleepTimer === opt.seconds && <span className="ml-2 text-xs text-orange-400">({formatSleepTimer(sleepTimer)})</span>}
                      </button>
                    ))}
                    {sleepTimer !== null && (
                      <>
                        <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                        <button onClick={() => { setSleepTimer(null); setShowTimerMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors whitespace-nowrap cursor-pointer">
                          Cancel timer
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button onClick={() => setVolumeBoost((p) => !p)} title="Volume Boost"
                className={toolbarBtn(volumeBoost, 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400')}
              >
                <i className={`${volumeBoost ? 'ri-volume-up-fill' : 'ri-volume-up-line'} text-lg`}></i>
                <span className="text-[9px] font-medium leading-none mt-0.5 text-gray-400 dark:text-gray-500">boost</span>
              </button>

              <div className="relative" ref={speedMenuRef}>
                <button
                  onClick={() => { setShowTimerMenu(false); setShowEqMenu(false); setShowSpeedMenu((p) => !p); }}
                  title="Playback Speed"
                  className={toolbarBtn(playbackSpeed !== 1, 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400')}
                >
                  <i className="ri-speed-up-line text-lg"></i>
                  <span className={`text-[9px] font-bold leading-none mt-0.5 ${playbackSpeed !== 1 ? 'text-sky-500' : 'text-gray-400 dark:text-gray-500'}`}>
                    {playbackSpeed}x
                  </span>
                </button>
                {showSpeedMenu && (
                  <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-44 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 py-1">
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-4 pt-3 pb-2">Playback Speed</p>
                    {SPEED_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setPlaybackSpeed(s); setShowSpeedMenu(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer flex items-center justify-between ${playbackSpeed === s ? 'text-sky-600 dark:text-sky-400 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        <span>{s}x</span>
                        {s === 1 && <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">Normal</span>}
                        {playbackSpeed === s && s !== 1 && <i className="ri-check-line text-sky-500 text-sm"></i>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={eqMenuRef}>
                <button
                  onClick={() => { setShowTimerMenu(false); setShowSpeedMenu(false); setShowEqMenu((p) => !p); }}
                  title="Equalizer"
                  className={toolbarBtn(equalizerOn, 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400')}
                >
                  <i className={`${equalizerOn ? 'ri-equalizer-fill' : 'ri-equalizer-line'} text-lg`}></i>
                  {equalizerOn && activeEqPreset
                    ? <span className="text-[9px] font-bold leading-none mt-0.5 text-violet-500 truncate max-w-[44px]">{eqPresets.find((p) => p.id === activeEqPreset)?.name.slice(0, 6)}</span>
                    : <span className="text-[9px] font-medium leading-none mt-0.5 text-gray-400 dark:text-gray-500">eq</span>
                  }
                </button>
                {showEqMenu && (
                  <div className="absolute bottom-full mb-2 right-0 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 py-1">
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-4 pt-3 pb-2">Equalizer</p>
                    {eqPresets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectEqPreset(preset)}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-between gap-2 ${activeEqPreset === preset.id ? 'text-violet-600 dark:text-violet-400' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${activeEqPreset === preset.id ? 'font-semibold' : ''}`}>{preset.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{preset.description}</p>
                        </div>
                        {activeEqPreset === preset.id && <i className="ri-check-line text-violet-500 flex-shrink-0"></i>}
                      </button>
                    ))}
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                    <button
                      onClick={() => { setShowEqMenu(false); setShowCreateEqModal(true); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
                    >
                      <i className="ri-add-circle-line text-base"></i>
                      Create new preset
                    </button>
                  </div>
                )}
              </div>

              <button onClick={handleAddBookmark} title="Bookmark this moment"
                className={toolbarBtn(!!pendingBookmark, 'bg-amber-100 dark:bg-amber-900/30 text-amber-500 scale-110')}>
                <i className={`${pendingBookmark ? 'ri-bookmark-fill' : 'ri-bookmark-line'} text-lg ${pendingBookmark ? 'text-amber-500' : ''}`}></i>
                {trackBookmarks.length > 0
                  ? <span className="text-[9px] font-bold leading-none mt-0.5 text-amber-500">{trackBookmarks.length}</span>
                  : <span className="text-[9px] font-medium leading-none mt-0.5 text-gray-400 dark:text-gray-500">mark</span>
                }
              </button>
            </div>

            {/* ── Simple book progress bar (above cover) ── */}
            <div className="w-full mb-5 flex-shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Book Progress</span>
                <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* ── Cover ── */}
            <div className="w-44 h-44 rounded-2xl overflow-hidden shadow-2xl mb-4 flex-shrink-0">
              <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover object-top" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1 text-center w-full truncate">{currentTrack.title}</h2>
            <div className="flex items-center justify-center gap-2 mb-4 w-full min-w-0">
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{currentTrack.author}</p>
              {equalizerOn && activeEqPreset && (
                <span className="flex items-center gap-1.5 flex-shrink-0 px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700/50">
                  <EqBars />
                  <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 whitespace-nowrap">
                    {eqPresets.find((p) => p.id === activeEqPreset)?.name}
                  </span>
                </span>
              )}
            </div>

            {/* Chapter progress */}
            {bookProgress && (
              <div className="w-full mb-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Progress</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[bookProgress.status].classes}`}>
                      <i className={`${statusConfig[bookProgress.status].icon} text-xs`}></i>
                      {statusConfig[bookProgress.status].label}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Ch {bookProgress.currentChapter} / {bookProgress.totalChapters}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {[...Array(bookProgress.totalChapters)].map((_, i) => {
                    const chNum = i + 1;
                    const isDone = chNum <= bookProgress.currentChapter;
                    const isCurrent = chNum === bookProgress.currentChapter + 1 && bookProgress.status !== 'completed';
                    return (
                      <div key={i} title={`Chapter ${chNum}`}
                        className={`h-2 rounded-full transition-all duration-300 ${isDone ? 'bg-emerald-500' : isCurrent ? 'bg-orange-400' : 'bg-gray-200 dark:bg-gray-700'}`}
                        style={{ width: isDone ? '8px' : isCurrent ? '20px' : '8px' }}
                      />
                    );
                  })}
                </div>
                {bookProgress.status !== 'completed' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handlePreviousChapter}
                      disabled={bookProgress.currentChapter === 0}
                      title="Mark previous chapter as unread"
                      className={`h-9 px-3 flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer border ${
                        bookProgress.currentChapter === 0
                          ? 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          : 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/40'
                      }`}
                    >
                      <i className="ri-arrow-left-s-line text-sm"></i>
                      Prev
                    </button>
                    <button onClick={handleMarkChapterDone} className="flex-1 h-9 flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer">
                      <i className="ri-check-line text-sm"></i>Mark Chapter Done
                    </button>
                    <button onClick={() => setShowCompleteConfirm(true)} className="h-9 px-3 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 transition-colors whitespace-nowrap cursor-pointer">
                      <i className="ri-checkbox-circle-line text-base"></i>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-1">
                    <i className="ri-checkbox-circle-fill text-emerald-500 text-lg"></i>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Book Completed!</span>
                  </div>
                )}
              </div>
            )}

            {/* ── Waveform + chapter scrubber ── */}
            <div className="w-full mb-4 flex-shrink-0">
              <div className="h-14 mb-2">
                <svg className="w-full h-full" viewBox="0 0 400 56" preserveAspectRatio="none">
                  {[...Array(100)].map((_, i) => {
                    const h = Math.random() * 44 + 6;
                    return (
                      <rect key={i} x={i * 4} y={28 - h / 2} width="2" height={h}
                        fill={i < progressPercent ? '#a78bfa' : '#e5e7eb'} className="dark:fill-purple-500 dark:opacity-70" />
                    );
                  })}
                </svg>
              </div>

              {/* Chapter bar */}
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 w-16 flex-shrink-0 truncate">
                  {bookProgress ? `Ch ${currentChapterIndex + 1}/${totalChapters}` : 'Chapter'}
                </span>
                <div
                  ref={chapterProgressRef}
                  onClick={handleChapterProgressClick}
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative"
                >
                  {duration > 0 && trackBookmarks.map((bm) => (
                    <button key={bm.id} onClick={(e) => { e.stopPropagation(); setCurrentTime(bm.time); setActiveTab('bookmarks'); }}
                      title={bm.note ? `${bm.label}: ${bm.note.slice(0, 50)}` : bm.label}
                      className={`absolute -top-1.5 w-1.5 h-4 rounded-sm transition-colors cursor-pointer z-10 -translate-x-1/2 ${bm.note ? 'bg-amber-500 hover:bg-amber-600' : 'bg-amber-300 hover:bg-amber-400'}`}
                      style={{ left: `${(bm.time / duration) * 100}%` }}
                    />
                  ))}
                  <div
                    className="h-full bg-gradient-to-r from-orange-300 to-orange-400 rounded-full transition-all duration-300 relative"
                    style={{ width: `${chapterProgress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-orange-400 rounded-full shadow-md" />
                  </div>
                </div>
                <span className="text-[11px] text-gray-400 dark:text-gray-500 w-16 text-right flex-shrink-0 font-mono">
                  {formatTime(chapterCurrentTime)}
                </span>
              </div>

              {/* Timestamps */}
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 pl-[76px] pr-[76px]">
                <span>{formatTime(currentTime)}</span>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span>{formatTime(duration - currentTime)} left</span>
              </div>
            </div>

            {/* ── Media controls ── */}
            <div className="flex items-center justify-center gap-2 mb-4 w-full flex-shrink-0">
              <SkipBtn seconds={-60} label="1m" large />
              <SkipBtn seconds={-10} label="10s" />
              <button onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 flex items-center justify-center rounded-2xl bg-orange-500 hover:bg-orange-600 text-white transition-colors shadow-lg whitespace-nowrap cursor-pointer mx-1">
                <i className={`${isPlaying ? 'ri-pause-fill' : 'ri-play-fill'} text-3xl`}></i>
              </button>
              <SkipBtn seconds={10} label="10s" />
              <SkipBtn seconds={60} label="1m" large />
            </div>

            {/* ── Pending bookmark create panel ── */}
            {pendingBookmark && (
              <div className="w-full mb-1 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-300 dark:border-amber-700/60 p-4 space-y-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <i className="ri-bookmark-fill text-amber-500 text-sm"></i>
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">New Bookmark</span>
                  <span className="text-xs font-mono text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-lg">{formatTime(pendingBookmark.time)}</span>
                </div>
                <p className="text-[11px] text-amber-600/70 dark:text-amber-400/60 -mt-1">
                  {autoSavePaused
                    ? 'Timer paused — save when you\'re done'
                    : `Auto-saving in ${autoSaveSeconds}s — start typing to pause`}
                </p>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">Title</label>
                  <input
                    value={pendingBookmark.label}
                    onChange={(e) => handlePendingLabelChange(e.target.value)}
                    className="w-full text-sm bg-white dark:bg-gray-700 border border-amber-300 dark:border-amber-600 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-600 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">
                    Note <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    ref={pendingNoteRef}
                    value={pendingBookmark.note}
                    onChange={(e) => handlePendingNoteChange(e.target.value)}
                    placeholder="What caught your attention here?"
                    rows={3}
                    maxLength={500}
                    className="w-full resize-none text-sm bg-white dark:bg-gray-700 border border-amber-200 dark:border-amber-700/50 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-600 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 leading-relaxed"
                  />
                  <p className="text-xs text-gray-400 text-right mt-0.5">{pendingBookmark.note.length}/500</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCancelPending} className="flex-1 h-8 rounded-xl border border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer">
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBookmark}
                    className="flex-1 h-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <i className="ri-bookmark-fill text-xs"></i>
                    Save Bookmark
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Tabs section ── */}
          <div className="flex-1 flex flex-col min-h-0 border-t border-gray-200 dark:border-gray-800 px-6 pb-6">
            <div className="flex gap-1 mt-4 mb-3 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex-shrink-0">
              <button onClick={() => setActiveTab('queue')}
                className={`flex-1 h-8 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'queue' ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                Up Next
              </button>
              <button onClick={() => setActiveTab('bookmarks')}
                className={`flex-1 h-8 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'bookmarks' ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                Bookmarks
                {trackBookmarks.length > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'bookmarks' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300'}`}>
                    {trackBookmarks.length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              {activeTab === 'queue' && (
                <div className="space-y-1 pb-2">
                  {playlist.map((track) => (
                    <div key={track.id} onClick={() => { onTrackChange(track); setCurrentTime(0); }}
                      className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${currentTrack.id === track.id ? 'bg-purple-50 dark:bg-purple-900/20' : ''}`}
                    >
                      <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={track.cover} alt={track.title} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{track.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{track.author}</p>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">{track.duration}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'bookmarks' && (
                <div className="pb-2">
                  {trackBookmarks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 mb-3">
                        <i className="ri-bookmark-line text-xl text-gray-400"></i>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">No bookmarks yet</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Tap the bookmark icon to save a moment</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {trackBookmarks.map((bm) =>
                        editingId === bm.id ? (
                          <div key={bm.id} className="group rounded-xl p-2.5 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 flex-shrink-0 mt-0.5">
                                <i className={`${bm.note ? 'ri-bookmark-3-fill' : 'ri-bookmark-fill'} text-sm text-amber-500`}></i>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{bm.label}</p>
                                {bm.note && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed line-clamp-2">{bm.note}</p>}
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatTime(bm.time)}</p>
                              </div>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
                                <button onClick={() => { setCurrentTime(bm.time); setIsPlaying(true); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400 transition-colors cursor-pointer whitespace-nowrap">
                                  <i className="ri-play-circle-line text-base"></i>
                                </button>
                                <button onClick={() => handleStartEdit(bm)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer whitespace-nowrap">
                                  <i className="ri-pencil-line text-base"></i>
                                </button>
                                <button onClick={() => removeBookmark(bm.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-colors cursor-pointer whitespace-nowrap">
                                  <i className="ri-delete-bin-line text-base"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div key={bm.id} className="group rounded-xl p-2.5 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 flex-shrink-0 mt-0.5">
                                <i className={`${bm.note ? 'ri-bookmark-3-fill' : 'ri-bookmark-fill'} text-sm text-amber-500`}></i>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{bm.label}</p>
                                {bm.note && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed line-clamp-2">{bm.note}</p>}
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatTime(bm.time)}</p>
                              </div>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
                                <button onClick={() => { setCurrentTime(bm.time); setIsPlaying(true); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400 transition-colors cursor-pointer whitespace-nowrap">
                                  <i className="ri-play-circle-line text-base"></i>
                                </button>
                                <button onClick={() => handleStartEdit(bm)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer whitespace-nowrap">
                                  <i className="ri-pencil-line text-base"></i>
                                </button>
                                <button onClick={() => removeBookmark(bm.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-colors cursor-pointer whitespace-nowrap">
                                  <i className="ri-delete-bin-line text-base"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Create EQ Preset modal */}
      {showCreateEqModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30 flex-shrink-0">
                <i className="ri-equalizer-fill text-xl text-violet-500"></i>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">New EQ Preset</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Save your custom sound profile</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">Preset Name</label>
              <input
                value={newEqName}
                onChange={(e) => setNewEqName(e.target.value)}
                placeholder="e.g. Morning Focus, Deep Bass..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newEqName.trim()) handleCreateEqPreset();
                  if (e.key === 'Escape') { setShowCreateEqModal(false); setNewEqName(''); }
                }}
                className="w-full text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-300 dark:focus:ring-violet-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            {eqPresets.some((p) => p.id.startsWith('custom-')) && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Your Custom Presets</p>
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {eqPresets.filter((p) => p.id.startsWith('custom-')).map((p) => (
                    <div key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <i className="ri-equalizer-line text-violet-400 text-sm"></i>
                      </div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate flex-1">{p.name}</p>
                      <button
                        onClick={() => setEqPresets((prev) => prev.filter((x) => x.id !== p.id))}
                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
                      >
                        <i className="ri-close-line text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowCreateEqModal(false); setNewEqName(''); }}
                className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEqPreset}
                disabled={!newEqName.trim()}
                className={`flex-1 h-10 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  newEqName.trim()
                    ? 'bg-violet-500 hover:bg-violet-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete confirm modal */}
      {showCompleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-72 shadow-2xl">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-4">
              <i className="ri-checkbox-circle-line text-2xl text-emerald-500"></i>
            </div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white text-center mb-2">Mark as Completed?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-5">
              This will mark &ldquo;{currentTrack.title}&rdquo; as fully completed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowCompleteConfirm(false)} className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer">Cancel</button>
              <button onClick={handleMarkBookComplete} className="flex-1 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer">Complete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
