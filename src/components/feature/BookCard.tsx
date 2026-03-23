import { BookStatus } from '../../hooks/useBookProgress';

interface BookCardProps {
  book: {
    id: number;
    title: string;
    author: string;
    genre: string;
    cover: string;
    rating: number;
    color: string;
  };
  onClick?: () => void;
  status?: BookStatus;
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

export default function BookCard({ book, onClick, status }: BookCardProps) {
  const badge = status ? statusConfig[status] : null;

  return (
    <div
      onClick={onClick}
      className={`${book.color} dark:bg-gray-800 rounded-3xl p-6 cursor-pointer transition-shadow duration-300 hover:shadow-xl min-w-[280px] group`}
    >
      <div className="relative w-32 h-48 mx-auto mb-4 rounded-lg overflow-hidden shadow-lg">
        <img src={book.cover} alt={book.title} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/90 shadow-lg">
            <i className="ri-play-fill text-2xl text-purple-600 ml-1"></i>
          </div>
        </div>
        {status === 'completed' && (
          <div className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-emerald-500 shadow">
            <i className="ri-check-line text-sm text-white"></i>
          </div>
        )}
      </div>

      <h3 className="font-semibold text-gray-800 dark:text-white text-base mb-1">{book.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{book.author}</p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">{book.genre}</p>

      {badge && (
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-3 ${badge.classes}`}>
          <i className={`${badge.icon} text-xs`}></i>
          <span>{badge.label}</span>
        </div>
      )}

      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`ri-star-${i < book.rating ? 'fill' : 'line'} text-sm ${
              i < book.rating ? 'text-purple-400' : 'text-gray-300 dark:text-gray-600'
            }`}
          ></i>
        ))}
      </div>
    </div>
  );
}
