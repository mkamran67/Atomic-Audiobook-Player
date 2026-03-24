export interface Collection {
  id: string;
  name: string;
  description: string;
  bookIds: string[]; // ordered play queue
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
