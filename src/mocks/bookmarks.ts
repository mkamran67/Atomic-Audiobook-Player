export interface MockBookmark {
  id: string;
  bookId: number;
  time: number;
  label: string;
  note?: string;
  createdAt: number;
}

const d = (daysAgo: number) => Date.now() - daysAgo * 86400000;

export const mockBookmarks: MockBookmark[] = [
  // Book 2 — Lumen: The Ancient Mystery (42% progress)
  { id: 'bm-2-1', bookId: 2, time: 1395,  label: 'Mysterious stranger appears',      note: 'Could be connected to the ancient guild',            createdAt: d(5) },
  { id: 'bm-2-2', bookId: 2, time: 4521,  label: 'Secret passage discovered',                                                                     createdAt: d(3) },
  { id: 'bm-2-3', bookId: 2, time: 9876,  label: 'First mention of the manuscript',  note: 'Referenced again in chapter 9',                       createdAt: d(1) },

  // Book 4 — The Midnight Library (68% progress)
  { id: 'bm-4-1', bookId: 4, time: 2700,  label: 'The regret philosophy',            note: 'Mrs Elm explains the concept perfectly here',         createdAt: d(8) },
  { id: 'bm-4-2', bookId: 4, time: 11430, label: 'Best life moment',                                                                              createdAt: d(4) },
  { id: 'bm-4-3', bookId: 4, time: 19200, label: 'Nora realises the truth',          note: 'Pivotal scene — great narration',                      createdAt: d(2) },

  // Book 7 — The Atlas Six (55% progress)
  { id: 'bm-7-1', bookId: 7, time: 5220,  label: 'Libby and Nico rivalry',                                                                        createdAt: d(10) },
  { id: 'bm-7-2', bookId: 7, time: 14760, label: "Reina's power revealed",           note: 'Unexpected — worth re-listening',                     createdAt: d(6)  },
  { id: 'bm-7-3', bookId: 7, time: 23100, label: 'Rhodes makes his offer',           note: 'Tension peaks — best scene so far',                   createdAt: d(2)  },

  // Book 9 — Sherwood (80% progress)
  { id: 'bm-9-1', bookId: 9, time: 3600,  label: 'Marian confronts the Sheriff',    note: 'Excellent tension in the dialogue',                    createdAt: d(14) },
  { id: 'bm-9-2', bookId: 9, time: 22860, label: 'The ambush at Barnsdale',                                                                       createdAt: d(7)  },
  { id: 'bm-9-3', bookId: 9, time: 36000, label: 'Robin reveals himself',           note: 'Twist telegraphed but still satisfying',               createdAt: d(2)  },

  // Book 11 — The Magician's Ruins (55% progress)
  { id: 'bm-11-1', bookId: 11, time: 6300,  label: 'The first rune activation',                                                                   createdAt: d(9) },
  { id: 'bm-11-2', bookId: 11, time: 16200, label: 'Underground chamber scene',     note: 'Great atmosphere — feels cinematic',                   createdAt: d(3) },

  // Book 12 — Sea Gave Back (70% progress)
  { id: 'bm-12-1', bookId: 12, time: 4800,  label: 'The tide prophecy',             note: 'Pay attention to the specific wording',               createdAt: d(6) },
  { id: 'bm-12-2', bookId: 12, time: 19440, label: 'Meeting the sea spirit',                                                                      createdAt: d(3) },

  // Book 15 — Six of Crows (38% progress)
  { id: 'bm-15-1', bookId: 15, time: 2880,  label: "Kaz's plan revealed",           note: 'Every detail matters here',                            createdAt: d(12) },
  { id: 'bm-15-2', bookId: 15, time: 8100,  label: "Inej's backstory",              note: 'So well written — heartbreaking',                      createdAt: d(5)  },

  // Book 17 — Mexican Gothic (25% progress)
  { id: 'bm-17-1', bookId: 17, time: 1800,  label: 'The house is alive',            note: 'First sense of real dread',                            createdAt: d(4) },
  { id: 'bm-17-2', bookId: 17, time: 7200,  label: 'The mushroom dream sequence',                                                                  createdAt: d(1) },
];

export function formatBookmarkTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatRelativeDate(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7)  return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}
