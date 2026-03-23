export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  ts: string;
  level: LogLevel;
  msg: string;
}

const STORAGE_KEY = 'readit_logs';
const MAX_ENTRIES = 500;

export function getLogs(): LogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LogEntry[]) : [];
  } catch {
    return [];
  }
}

export function log(level: LogLevel, msg: string): void {
  const entry: LogEntry = { ts: new Date().toISOString(), level, msg };
  const current = getLogs();
  const next = [...current, entry].slice(-MAX_ENTRIES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage full — silently ignore
  }
}

export function clearLogs(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function logsAsText(): string {
  return getLogs()
    .map((e) => `[${e.ts}] [${e.level.toUpperCase().padEnd(5)}] ${e.msg}`)
    .join('\n');
}

// seed a few boot entries on first import so the viewer is never empty
(function seedBoot() {
  const existing = getLogs();
  if (existing.length === 0) {
    log('info',  'App initialised');
    log('info',  `Platform: ${navigator.platform}`);
    log('info',  `User-Agent: ${navigator.userAgent}`);
  }
})();
