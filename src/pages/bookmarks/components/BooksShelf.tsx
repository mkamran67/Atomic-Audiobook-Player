import { useState } from 'react';
import { LibraryBook } from '../../../types/library';
import CoverImage from '../../../components/base/CoverImage';

interface BooksShelfProps {
  books: LibraryBook[];
  bookmarkCounts: Map<string, number>;
  selectedBookId: string | null;
  onSelect: (id: string | null) => void;
}

export default function BooksShelf({
  books,
  bookmarkCounts,
  selectedBookId,
  onSelect,
}: BooksShelfProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-14 lg:grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-2">
      {books.map((book) => {
        const count = bookmarkCounts.get(book.id) ?? 0;
        const isSelected = selectedBookId === book.id;
        const isHovered = hoveredId === book.id;

        return (
          <div
            key={book.id}
            className="relative cursor-pointer"
            onMouseEnter={() => setHoveredId(book.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelect(isSelected ? null : book.id)}
          >
            {/* Cover */}
            <div
              className={`relative w-full aspect-[2/3] rounded-lg overflow-hidden transition-all duration-200 ${
                isSelected
                  ? 'ring-2 ring-amber-400 ring-offset-1'
                  : count === 0
                  ? 'opacity-40'
                  : ''
              }`}
            >
              <CoverImage
                src={book.cover}
                alt={book.title}
                className={`w-full h-full object-cover object-top transition-transform duration-200 ${isHovered ? 'scale-105' : ''}`}
              />

              {/* Bookmark badge */}
              {count > 0 && (
                <div className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-amber-500 px-1">
                  <span className="text-[9px] font-bold text-white leading-none">{count}</span>
                </div>
              )}

              {/* Hover title overlay */}
              {isHovered && (
                <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-1.5">
                  <p className="text-white text-[9px] font-semibold leading-tight line-clamp-3">{book.title}</p>
                  <p className="text-white/60 text-[8px] mt-0.5 truncate">{book.author}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
