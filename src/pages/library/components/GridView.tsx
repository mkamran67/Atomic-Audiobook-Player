import { useState } from 'react';
import { LibraryBook, genreColors } from '../../../mocks/library';

interface GridViewProps {
  books: LibraryBook[];
  likedIds: Set<number>;
  onToggleLike: (id: number) => void;
}

const statusBadge = {
  'not-started': { label: 'Not Started', cls: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400', icon: 'ri-time-line' },
  'in-progress': { label: 'Listening', cls: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400', icon: 'ri-headphone-line' },
  completed: { label: 'Completed', cls: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', icon: 'ri-checkbox-circle-line' },
};

export default function GridView({ books, likedIds, onToggleLike }: GridViewProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {books.map((book) => {
        const badge = statusBadge[book.status];
        const isHovered = hoveredId === book.id;
        const isLiked = likedIds.has(book.id);

        return (
          <div
            key={book.id}
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredId(book.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Cover */}
            <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden mb-3">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              />

              {/* Hover overlay */}
              <div className={`absolute inset-0 bg-black/50 transition-opacity duration-200 flex flex-col justify-between p-3 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                {/* Top: like button */}
                <div className="flex justify-end">
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleLike(book.id); }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className={`${isLiked ? 'ri-heart-fill text-rose-400' : 'ri-heart-line text-white'} text-sm`}></i>
                  </button>
                </div>

                {/* Bottom: play + progress */}
                <div>
                  <button className="w-full h-9 flex items-center justify-center gap-2 rounded-xl bg-white/90 hover:bg-white text-gray-800 text-xs font-semibold transition-colors mb-2 cursor-pointer whitespace-nowrap">
                    <i className="ri-play-fill text-sm"></i>
                    {book.status === 'not-started' ? 'Start' : 'Restart'}
                  </button>
                  {book.status === 'in-progress' && (
                    <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: `${book.progress}%` }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Like badge (always shown if liked and not hovered) */}
              {isLiked && !isHovered && (
                <div className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-full bg-black/40">
                  <i className="ri-heart-fill text-xs text-rose-400"></i>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2 leading-tight mb-1">{book.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">{book.author}</p>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${genreColors[book.genre] ?? 'bg-gray-100 text-gray-500'}`}>
                  {book.genre}
                </span>
              </div>

              <div className="flex items-center gap-1 mt-2">
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${badge.cls}`}>
                  <i className={`${badge.icon} text-[9px]`}></i>
                  {badge.label}
                </span>
              </div>

              {/* Progress bar for in-progress */}
              {book.status === 'in-progress' && (
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${book.progress}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">{book.progress}%</span>
                </div>
              )}

              {/* Stars */}
              <div className="flex items-center gap-0.5 mt-1.5">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`ri-star-${i < book.rating ? 'fill' : 'line'} text-xs ${i < book.rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}></i>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
