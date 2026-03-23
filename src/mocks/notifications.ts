export interface Notification {
  id: number;
  type: 'new_release' | 'milestone' | 'reminder' | 'collection' | 'author';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  iconBg: string;
  iconColor: string;
}

export const notifications: Notification[] = [
  {
    id: 1,
    type: 'new_release',
    title: 'New Release Available',
    message: 'Rebecca Yarros just dropped "Onyx Storm" — the sequel to Iron Flame is here.',
    time: '2 min ago',
    read: false,
    icon: 'ri-book-2-line',
    iconBg: 'bg-rose-100 dark:bg-rose-900/30',
    iconColor: 'text-rose-500 dark:text-rose-400',
  },
  {
    id: 2,
    type: 'milestone',
    title: 'Reading Milestone!',
    message: 'You\'ve completed 10 chapters of "The Magician\'s Ruins". Keep it up!',
    time: '1 hr ago',
    read: false,
    icon: 'ri-trophy-line',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-500 dark:text-amber-400',
  },
  {
    id: 3,
    type: 'reminder',
    title: 'Daily Reading Reminder',
    message: 'You haven\'t read today yet. Pick up where you left off in "Sherwood".',
    time: '3 hr ago',
    read: false,
    icon: 'ri-time-line',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-500 dark:text-purple-400',
  },
  {
    id: 4,
    type: 'author',
    title: 'Author Update',
    message: 'Meagan Spooner added 2 new books to her catalog. Check them out.',
    time: 'Yesterday',
    read: true,
    icon: 'ri-user-star-line',
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/30',
    iconColor: 'text-cyan-500 dark:text-cyan-400',
  },
  {
    id: 5,
    type: 'collection',
    title: 'Collection Suggestion',
    message: '"Dark Academia Essentials" collection was curated just for you based on your taste.',
    time: 'Yesterday',
    read: true,
    icon: 'ri-folder-music-line',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
  },
  {
    id: 6,
    type: 'milestone',
    title: 'Weekly Goal Reached!',
    message: 'You hit 5 hours of listening this week. You\'re on a roll!',
    time: '2 days ago',
    read: true,
    icon: 'ri-award-line',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-500 dark:text-orange-400',
  },
];
