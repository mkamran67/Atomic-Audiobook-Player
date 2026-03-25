import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  selectDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),

  // Scanner
  startScan: (directories: string[]) => ipcRenderer.invoke('scanner:start', directories),
  cancelScan: () => ipcRenderer.invoke('scanner:cancel'),
  onScanProgress: (cb: (data: { percent: number; currentDir: string }) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, data: { percent: number; currentDir: string }) => cb(data);
    ipcRenderer.on('scanner:progress', listener);
    return () => { ipcRenderer.removeListener('scanner:progress', listener); };
  },
  onBookFound: (cb: (book: any) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, book: any) => cb(book);
    ipcRenderer.on('scanner:book-found', listener);
    return () => { ipcRenderer.removeListener('scanner:book-found', listener); };
  },
  onScanComplete: (cb: (data: { totalBooks: number }) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, data: { totalBooks: number }) => cb(data);
    ipcRenderer.on('scanner:complete', listener);
    return () => { ipcRenderer.removeListener('scanner:complete', listener); };
  },
  onScanError: (cb: (data: { message: string; path?: string }) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, data: { message: string; path?: string }) => cb(data);
    ipcRenderer.on('scanner:error', listener);
    return () => { ipcRenderer.removeListener('scanner:error', listener); };
  },

  // Library persistence
  loadLibrary: () => ipcRenderer.invoke('library:load'),
  removeBooksByDirectory: (directory: string) => ipcRenderer.invoke('library:removeByDirectory', directory),

  // Directory persistence
  loadDirectories: () => ipcRenderer.invoke('directories:load'),
  saveDirectories: (dirs: string[]) => ipcRenderer.invoke('directories:save', dirs),
});
