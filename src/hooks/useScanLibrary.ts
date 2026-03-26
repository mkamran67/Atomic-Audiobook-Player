import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setBooks, setLibraryLoaded, addBook } from '../store/librarySlice';
import { scanStarted, scanProgress, scanComplete, scanError, scanCancelled } from '../store/scannerSlice';
import { useRootDirectories } from './useRootDirectories';

export function useScanLibrary() {
  const dispatch = useAppDispatch();
  const { isScanning, progress, currentDir, error } = useAppSelector((s) => s.scanner);
  const { directories } = useRootDirectories();

  // Load cached library on mount
  useEffect(() => {
    window.electronAPI.loadLibrary().then((books) => {
      if (books && books.length > 0) {
        dispatch(setBooks(books));
      } else {
        dispatch(setLibraryLoaded());
      }
    });
  }, [dispatch]);

  // Subscribe to scanner IPC events
  useEffect(() => {
    const unsubs = [
      window.electronAPI.onScanProgress((data) => dispatch(scanProgress(data))),
      window.electronAPI.onBookFound((book) => dispatch(addBook(book))),
      window.electronAPI.onScanComplete(() => dispatch(scanComplete())),
      window.electronAPI.onScanError((data) => dispatch(scanError(data.message))),
    ];
    return () => unsubs.forEach((fn) => fn());
  }, [dispatch]);

  const startScan = useCallback((dirs?: string[]) => {
    const scanDirs = dirs ?? directories;
    if (scanDirs.length === 0) return;
    dispatch(scanStarted());
    window.electronAPI.startScan(scanDirs);
  }, [dispatch, directories]);

  const scanDirectories = useCallback((dirs: string[]) => {
    if (dirs.length === 0) return;
    dispatch(scanStarted());
    window.electronAPI.startScan(dirs);
  }, [dispatch]);

  const cancel = useCallback(() => {
    window.electronAPI.cancelScan();
    dispatch(scanCancelled());
  }, [dispatch]);

  return { isScanning, progress, currentDir, error, startScan, scanDirectories, cancelScan: cancel };
}
