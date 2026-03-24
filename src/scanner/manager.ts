import { utilityProcess, UtilityProcess, BrowserWindow, app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { ScannedBook, ScannerOutMessage, ScannerInMessage } from '../types/scanner';
import { LibraryBook } from '../types/library';

const LIBRARY_FILE = path.join(app.getPath('userData'), 'library.json');

let scannerProcess: UtilityProcess | null = null;
let discoveredBooks: LibraryBook[] = [];

function readStore(): LibraryBook[] {
  try {
    if (fs.existsSync(LIBRARY_FILE)) {
      return JSON.parse(fs.readFileSync(LIBRARY_FILE, 'utf-8'));
    }
  } catch {
    // ignore corrupt file
  }
  return [];
}

function writeStore(books: LibraryBook[]): void {
  try {
    fs.writeFileSync(LIBRARY_FILE, JSON.stringify(books, null, 2), 'utf-8');
  } catch {
    // ignore write failures
  }
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function toLibraryBook(scanned: ScannedBook): LibraryBook {
  const existingBooks = readStore();
  const existing = existingBooks.find(b => b.id === scanned.id);

  return {
    id: scanned.id,
    title: scanned.title,
    author: scanned.author,
    genre: scanned.genre,
    cover: scanned.cover ? `audiobook-cover://${encodeURIComponent(scanned.cover)}` : '',
    rating: existing?.rating ?? 0,
    status: existing?.status ?? 'not-started',
    progress: existing?.progress ?? 0,
    duration: formatDuration(scanned.durationMs),
    durationMs: scanned.durationMs,
    liked: existing?.liked ?? false,
    folderPath: scanned.folderPath,
    chapters: scanned.chapters.map((ch, i, arr) => ({
      ...ch,
      startOffsetMs: arr.slice(0, i).reduce((sum, c) => sum + c.durationMs, 0),
    })),
    year: scanned.year,
    addedAt: existing?.addedAt ?? Date.now(),
    narrator: scanned.narrator,
    lastPlayedAt: existing?.lastPlayedAt,
  };
}

export function startScan(directories: string[], win: BrowserWindow): void {
  if (scannerProcess) {
    scannerProcess.kill();
  }

  discoveredBooks = [];

  const scannerPath = path.join(__dirname, 'scanner.js');
  scannerProcess = utilityProcess.fork(scannerPath);

  scannerProcess.on('message', (msg: ScannerOutMessage) => {
    if (win.isDestroyed()) return;

    switch (msg.type) {
      case 'progress':
        win.webContents.send('scanner:progress', {
          percent: msg.percent,
          currentDir: msg.currentDir,
        });
        break;

      case 'book-discovered': {
        const book = toLibraryBook(msg.book);
        discoveredBooks.push(book);
        win.webContents.send('scanner:book-found', book);
        break;
      }

      case 'scan-complete':
        writeStore(discoveredBooks);
        win.webContents.send('scanner:complete', { totalBooks: msg.totalBooks });
        break;

      case 'error':
        win.webContents.send('scanner:error', {
          message: msg.message,
          path: msg.path,
        });
        break;
    }
  });

  scannerProcess.on('exit', () => {
    scannerProcess = null;
  });

  scannerProcess.postMessage({
    type: 'start-scan',
    directories,
  } as ScannerInMessage);
}

export function cancelScan(): void {
  if (scannerProcess) {
    scannerProcess.postMessage({ type: 'cancel-scan' } as ScannerInMessage);
  }
}

export function loadLibrary(): LibraryBook[] {
  return readStore();
}
