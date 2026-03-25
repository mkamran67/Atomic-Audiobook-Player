import { useState, useEffect } from 'react';

export function useRootDirectories() {
  const [directories, setDirectories] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    window.electronAPI.loadDirectories().then((dirs) => {
      setDirectories(dirs);
      setLoaded(true);
    });
  }, []);

  const save = (dirs: string[]) => {
    setDirectories(dirs);
    window.electronAPI.saveDirectories(dirs);
  };

  const addDirectory = (path: string) => {
    if (!directories.includes(path)) {
      save([...directories, path]);
    }
  };

  const removeDirectory = (path: string) => {
    save(directories.filter((d) => d !== path));
  };

  return { directories, addDirectory, removeDirectory, loaded };
}
