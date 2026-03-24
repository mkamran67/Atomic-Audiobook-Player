import { useState } from 'react';

const STORAGE_KEY = 'atomic_root_directories';

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function persist(dirs: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dirs));
  } catch {
    // ignore
  }
}

export function useRootDirectories() {
  const [directories, setDirectories] = useState<string[]>(load);

  const save = (dirs: string[]) => {
    persist(dirs);
    setDirectories(dirs);
  };

  const addDirectory = (path: string) => {
    if (!directories.includes(path)) {
      save([...directories, path]);
    }
  };

  const removeDirectory = (path: string) => {
    save(directories.filter((d) => d !== path));
  };

  return { directories, addDirectory, removeDirectory };
}
