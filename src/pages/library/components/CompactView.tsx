import { useState } from 'react';
import { LibraryBook, genreColors } from '../../../mocks/library';

interface CompactViewProps {
  books: LibraryBook[];
  likedIds: Set<number>;
  onToggleLike: (id: number) => void;
}

const statusConfig = {
  'not-started': { label: 'Not Started', cls: 'text-gray-400', icon: 'ri-time-line' },
  'in-progress': { label: 'Listening', cls: 'text-orange-400', icon: 'ri-headphone-line' },
  completed: { label: 'Completed', cls: 'text-emerald-400', icon: 'ri-checkbox-circle-fill' },
};

export default function CompactView({ books, likedIds, onToggleLike }: CompactViewProps) {
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
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
      {books.map((book) => {
        const isHovered = hoveredId === book.id;
        const isLiked = likedIds.has(book.id);
        const st = statusConfig[book.status];

        return (
          <div
            key={book.id}
            className="relative cursor-pointer"
            onMouseEnter={() => setHoveredId(book.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Cover */}
            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover object-top transition-transform duration-200 group-hover:scale-105"
              />

              {/* Completed indicator */}
              {book.status === 'completed' && (
                <div className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-emerald-500 shadow">
                  <i className="ri-check-line text-[9px] text-white"></i>
                </div>
              )}

              {/* In-progress bar */}
              {book.status === 'in-progress' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                  <div className="h-full bg-orange-400" style={{ width: `${book.progress}%` }} />
                </div>
              )}

              {/* Liked dot */}
              {isLiked && !isHovered && (
                <div className="absolute top-1 left-1 w-4 h-4 flex items-center justify-center">
                  <i className="ri-heart-fill text-rose-400 text-xs"></i>
                </div>
              )}

              {/* Hover tooltip card */}
              {isHovered && (
                <div className="absolute inset-0 bg-black/60 flex flex-col justify-between p-2">
                  {/* Like button */}
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleLike(book.id); }}
                      className="w-6 h-6 flex items-center justify-center rounded-md bg-white/20 hover:bg-white/30 cursor-pointer whitespace-nowrap"
                    >
                      <i className={`${isLiked ? 'ri-heart-fill text-rose-400' : 'ri-heart-line text-white'} text-xs`}></i>
                    </button>
                  </div>

                  {/* Bottom info */}
                  <div>
                    <p className="text-white text-[10px] font-semibold leading-tight line-clamp-2 mb-1">{book.title}</p>
                    <p className="text-white/70 text-[9px] truncate mb-1.5">{book.author}</p>
                    <div className="flex items-center gap-1 mb-1.5">
                      <i className={`${st.icon} text-[10px] ${st.cls}`}></i>
                      <span className={`text-[9px] font-medium ${st.cls}`}>{st.label}</span>
                    </div>
                    <button className="w-full h-6 flex items-center justify-center gap-1 rounded-md bg-white/90 text-gray-800 text-[9px] font-semibold transition-colors cursor-pointer whitespace-nowrap">
                      <i className="ri-play-fill text-[10px]"></i>
                      {book.status === 'not-started' ? 'Start' : 'Play'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
