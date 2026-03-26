# Atomic Audiobook Player

A feature-rich desktop audiobook player built with Electron and React. Manage your local audiobook library, track listening progress, and enjoy a polished playback experience with equalizer controls, bookmarks, and collections.

## Features

- **Library Management** -- Scan local directories for audiobooks with automatic metadata extraction. Browse in grid, list, or folder views. Filter by status, genre, or favorites. Search and sort by title, author, rating, progress, or year.
- **Audio Playback** -- Full transport controls with skip (15s), variable playback speed, volume boost, and a 5-band parametric equalizer. Auto-advances between chapters. Sleep timer support.
- **Progress Tracking** -- Per-book and per-chapter progress with completion status and last-played timestamps.
- **Bookmarks & Collections** -- Create bookmarks at any point in a book. Organize books into custom collections.
- **Accessibility** -- High contrast mode, reduced motion, larger touch targets, dyslexic-friendly font, screen reader hints, and internationalization support.
- **Dark Mode** -- Full light/dark theme support.

## Supported Audio Formats

MP3, M4A, M4B, FLAC, OGG, Opus, WAV, AAC, WMA

## Tech Stack

- **Electron** + **React 19** + **TypeScript**
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Web Audio API** for the equalizer engine
- **music-metadata** for audio file metadata extraction
- **Electron Forge** for building and packaging

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Install & Run

```bash
npm install
npm start
```

### Build Distributables

```bash
# Package the app
npm run package

# Create platform-specific installers (DEB, RPM, MSI, ZIP)
npm run make
```

## Project Structure

```
src/
├── index.ts              # Main Electron process
├── main.tsx              # React app entry (Redux, i18n, contexts)
├── preload.ts            # Secure IPC bridge
├── App.tsx               # Root component with routing
├── audio/                # Web Audio API engine with 5-band EQ
├── components/
│   ├── base/             # Reusable UI components
│   └── feature/          # AudioPlayer, Sidebar, BookCard, etc.
├── contexts/             # Settings and font size providers
├── hooks/                # Audio, scanning, progress, bookmarks
├── pages/                # Home, Library, Settings, Bookmarks, Collections
├── scanner/              # Background utility process for directory scanning
├── store/                # Redux slices (library, player, scanner)
├── types/                # TypeScript interfaces
└── utils/                # Utility functions
```

## Architecture

The app uses Electron's multi-process model:

- **Main process** -- Window management, IPC handlers, custom protocol handlers (`audiobook-cover://`, `audiobook-file://`) for secure local file access
- **Renderer process** -- React app with Redux state and React Router
- **Utility process** -- Background worker for scanning directories and extracting metadata

## License

MIT
