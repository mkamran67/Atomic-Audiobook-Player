import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { BookOpenIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function TimeLine() {
  const { stats } = useSelector((state: RootState) => state.stats);

  if (stats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-base-content/60">
        <BookOpenIcon className="w-12 h-12 mb-4" />
        <p className="text-lg">No listening activity yet</p>
        <p className="text-sm mt-1">Your recent activity will appear here</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4">
      <h3 className="text-2xl text-base-content/70 mb-4">Recent Activity</h3>
      <ul className="space-y-3">
        {stats.slice(0, 8).map((stat) => (
          <li key={stat.bookTitle} className="flex items-center gap-3 p-2 rounded-md hover:bg-base-300/50 transition-colors">
            <ClockIcon className="w-5 h-5 text-base-content/50 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-base-content truncate">{stat.bookTitle}</p>
              <p className="text-xs text-base-content/60">
                {stat.bookAuthor} &middot; Chapter {stat.currentTrack + 1} of {stat.chapterCount}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
