import { LibraryBook } from '../../../mocks/library';
import { MockBookmark, formatBookmarkTime, formatRelativeDate } from '../../../mocks/bookmarks';

interface BookmarkGroupProps {
  book: LibraryBook;
  bookmarks: MockBookmark[];
  isCollapsed: boolean;
  onToggle: () => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  'not-started': { label: 'Not Started', cls: 'text-gray-400 bg-gray-100 dark:bg-gray-800 dark:text-gray-500' },
  'in-progress': { label: 'Listening',   cls: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400' },
  completed:     { label: 'Completed',   cls: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' },
};

export default function BookmarkGroup({ book, bookmarks, isCollapsed, onToggle, onDelete }: BookmarkGroupProps) {
  const st = statusConfig[book.status];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden mb-3">
      {/* Book header — click anywhere to toggle */}
      <div
        onClick={onToggle}
        className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="w-10 h-[60px] flex-shrink-0 rounded-md overflow-hidden">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{book.title}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{book.author}</p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${st.cls}`}>
            {st.label}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {bookmarks.length} {bookmarks.length === 1 ? 'mark' : 'marks'}
          </span>
          {/* Collapse / expand chevron */}
          <div className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-300 dark:text-gray-600">
            <i
              className={`ri-arrow-down-s-line text-base transition-transform duration-200 ${
                isCollapsed ? '-rotate-90' : 'rotate-0'
              }`}
            ></i>
          </div>
        </div>
      </div>

      {/* Bookmark rows — hidden when collapsed */}
      {!isCollapsed && (
        <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              className="flex items-start gap-4 px-5 py-3.5 group hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
            >
              {/* Left: tree line + time chip */}
              <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                <div className="w-px h-5 bg-amber-200 dark:bg-amber-800 flex-shrink-0 ml-[4px]"></div>
                <span className="inline-flex items-center gap-1 h-6 px-2 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[11px] font-mono font-semibold whitespace-nowrap">
                  <i className="ri-headphone-line text-[10px]"></i>
                  {formatBookmarkTime(bm.time)}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-snug">{bm.label}</p>
                {bm.note && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">{bm.note}</p>
                )}
                <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-1">{formatRelativeDate(bm.createdAt)}</p>
              </div>

              {/* Delete button */}
              <button
                onClick={() => onDelete(bm.id)}
                className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer flex-shrink-0 mt-0.5"
                title="Remove bookmark"
              >
                <i className="ri-delete-bin-line text-sm"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
