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
