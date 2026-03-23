export interface Collection {
  id: string;
  name: string;
  description: string;
  bookIds: number[]; // ordered play queue
  createdAt: number;
}

/** Parse "H:MM:SS" or "HH:MM:SS" → total seconds */
export function parseDurationSecs(d: string): number {
  const parts = d.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

/** Format total seconds → "Xh Ym" */
export function formatTotalDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export const mockCollections: Collection[] = [
  {
    id: 'empyrean',
    name: 'The Empyrean Series',
    description: 'Rebecca Yarros\u2019 epic dragon-rider saga. Start with Fourth Wing before continuing into Iron Flame.',
    bookIds: [19, 8], // Fourth Wing → Iron Flame
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
  {
    id: 'dark-worlds',
    name: 'Dark Worlds Marathon',
    description: 'A hand-picked run through dark, atmospheric fantasy — from occult academies to gothic haunted houses.',
    bookIds: [7, 10, 6, 17], // Atlas Six → Awakening Bloodline → House of Salt → Mexican Gothic
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
  },
  {
    id: 'fantasy-classics',
    name: 'Fantasy Classics',
    description: 'The most acclaimed standalone fantasy novels. Perfect for a deep-dive into the genre\'s best.',
    bookIds: [14, 16, 20, 9], // Name of the Wind → Piranesi → Circe → Sherwood
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'heist-and-magic',
    name: 'Heist &amp; Magic',
    description: 'Cunning thieves, forbidden magic, and impossible odds. The best adventure-fantasy the library has to offer.',
    bookIds: [15, 13, 3, 1], // Six of Crows → ACOTAR → Dragon Fire → Explorations Colony
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
];
