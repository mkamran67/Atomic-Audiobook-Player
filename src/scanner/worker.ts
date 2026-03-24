import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import type { ScannedBook, AudioChapter, ScannerInMessage, ScannerOutMessage } from '../types/scanner';

const AUDIO_EXTENSIONS = new Set(['.mp3', '.m4a', '.m4b', '.flac', '.ogg', '.opus', '.wma', '.aac', '.wav']);
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif']);
const COVER_PRIORITY = ['cover', 'folder', 'front', 'album', 'artwork'];

let cancelled = false;

function sendMessage(msg: ScannerOutMessage) {
  process.parentPort.postMessage(msg);
}

function bookId(folderPath: string): string {
  return createHash('sha256').update(folderPath).digest('hex').slice(0, 16);
}

function naturalSort(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

/**
 * Recursively find all "leaf" directories that contain audio files.
 * A leaf is any directory with audio files — even if it has subdirectories.
 */
function discoverLeafDirs(rootDirs: string[]): string[] {
  const leafDirs: string[] = [];
  const stack = [...rootDirs];

  while (stack.length > 0) {
    const dir = stack.pop()!;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    let hasAudio = false;
    for (const entry of entries) {
      if (entry.isDirectory()) {
        stack.push(path.join(dir, entry.name));
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (AUDIO_EXTENSIONS.has(ext)) {
          hasAudio = true;
        }
      }
    }

    if (hasAudio) {
      leafDirs.push(dir);
    }
  }

  return leafDirs;
}

function findCoverImage(dir: string, entries: fs.Dirent[]): string {
  const imageFiles = entries
    .filter(e => e.isFile() && IMAGE_EXTENSIONS.has(path.extname(e.name).toLowerCase()))
    .map(e => e.name);

  if (imageFiles.length === 0) return '';

  // Check priority names first
  for (const priority of COVER_PRIORITY) {
    const match = imageFiles.find(f => f.toLowerCase().startsWith(priority));
    if (match) return path.join(dir, match);
  }

  // Fall back to first image
  return path.join(dir, imageFiles[0]);
}

function formatChapterTitle(filePath: string, index: number): string {
  const name = path.basename(filePath, path.extname(filePath));
  // Clean up common patterns: "01 - Chapter One" → "Chapter One", "Track 01" etc.
  const cleaned = name
    .replace(/^\d+[\s._-]*/, '') // leading numbers
    .replace(/^(track|chapter)\s*/i, 'Chapter ')
    .trim();
  return cleaned || `Chapter ${index + 1}`;
}

async function processLeafDir(dir: string): Promise<ScannedBook | null> {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return null;
  }

  const audioFiles = entries
    .filter(e => e.isFile() && AUDIO_EXTENSIONS.has(path.extname(e.name).toLowerCase()))
    .map(e => path.join(dir, e.name))
    .sort(naturalSort);

  if (audioFiles.length === 0) return null;

  // Dynamically import music-metadata (ESM module)
  const mm = await import('music-metadata');

  // Parse first file for book-level metadata
  let bookTitle = path.basename(dir);
  let bookAuthor = 'Unknown Author';
  let bookGenre = '';
  let bookYear = 0;
  let bookNarrator: string | undefined;
  let embeddedCover = '';

  try {
    const firstMeta = await mm.parseFile(audioFiles[0]);
    const common = firstMeta.common;
    if (common.album) bookTitle = common.album;
    else if (common.title && audioFiles.length === 1) bookTitle = common.title;
    if (common.artist) bookAuthor = common.artist;
    if (common.genre && common.genre.length > 0) bookGenre = common.genre[0];
    if (common.year) bookYear = common.year;
    // Some audiobooks store narrator in composer or comment fields
    if (common.composer) {
      bookNarrator = Array.isArray(common.composer) ? common.composer[0] : common.composer;
    }

    // Check for embedded cover art
    if (common.picture && common.picture.length > 0) {
      const pic = common.picture[0];
      const ext = pic.format.includes('png') ? '.png' : '.jpg';
      const coverPath = path.join(dir, `.cover_embedded${ext}`);
      try {
        fs.writeFileSync(coverPath, pic.data);
        embeddedCover = coverPath;
      } catch {
        // Ignore write failures
      }
    }
  } catch {
    // Metadata parse failure — use folder name defaults
  }

  // Parse each file for chapter info
  const chapters: AudioChapter[] = [];
  let totalDurationMs = 0;

  for (let i = 0; i < audioFiles.length; i++) {
    const filePath = audioFiles[i];
    let chapterTitle = formatChapterTitle(filePath, i);
    let durationMs = 0;

    try {
      const meta = await mm.parseFile(filePath, { duration: true, skipCovers: true });
      if (meta.common.title) chapterTitle = meta.common.title;
      durationMs = Math.round((meta.format.duration || 0) * 1000);
    } catch {
      // Use defaults on parse failure
    }

    chapters.push({
      index: i,
      title: chapterTitle,
      filePath,
      durationMs,
    });
    totalDurationMs += durationMs;
  }

  // Find cover image on disk (preferred over embedded)
  const coverImage = findCoverImage(dir, entries) || embeddedCover;

  return {
    id: bookId(dir),
    title: bookTitle,
    author: bookAuthor,
    genre: bookGenre,
    narrator: bookNarrator,
    year: bookYear,
    cover: coverImage,
    folderPath: dir,
    chapters,
    durationMs: totalDurationMs,
  };
}

async function runScan(directories: string[]) {
  // Phase 1: Discover leaf directories
  sendMessage({ type: 'progress', percent: 0, currentDir: 'Discovering directories...' });
  const leafDirs = discoverLeafDirs(directories);

  if (leafDirs.length === 0) {
    sendMessage({ type: 'scan-complete', totalBooks: 0 });
    return;
  }

  // Phase 2: Process each leaf directory
  let processed = 0;
  let totalBooks = 0;

  for (const dir of leafDirs) {
    if (cancelled) {
      sendMessage({ type: 'scan-complete', totalBooks });
      return;
    }

    try {
      const book = await processLeafDir(dir);
      if (book) {
        totalBooks++;
        sendMessage({ type: 'book-discovered', book });
      }
    } catch (err) {
      sendMessage({
        type: 'error',
        message: err instanceof Error ? err.message : String(err),
        path: dir,
      });
    }

    processed++;
    const percent = Math.round((processed / leafDirs.length) * 100);
    sendMessage({ type: 'progress', percent, currentDir: dir });
  }

  sendMessage({ type: 'scan-complete', totalBooks });
}

// Listen for messages from main process
process.parentPort.on('message', (e: Electron.MessageEvent) => {
  const msg = e.data as ScannerInMessage;

  switch (msg.type) {
    case 'start-scan':
      cancelled = false;
      runScan(msg.directories).catch(err => {
        sendMessage({
          type: 'error',
          message: err instanceof Error ? err.message : String(err),
        });
      });
      break;

    case 'cancel-scan':
      cancelled = true;
      break;
  }
});
