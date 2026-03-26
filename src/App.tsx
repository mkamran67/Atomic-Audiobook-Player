import { useState, useEffect, useRef } from "react";
import { HashRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { FontSizeProvider } from "./contexts/FontSizeContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { useRootDirectories } from "./hooks/useRootDirectories";
import { useScanLibrary } from "./hooks/useScanLibrary";
import { useAppSelector } from "./store";
import RootDirectoryModal from "./components/feature/RootDirectoryModal";

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-16 h-16 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-amber-600 dark:text-amber-400">
            <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
            <ellipse cx="12" cy="12" rx="10" ry="4"/>
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

function AppInner() {
  const { directories, addDirectory, removeDirectory, loaded: dirsLoaded } = useRootDirectories();
  const libraryLoaded = useAppSelector((s) => s.library.loaded);

  // This hook triggers library loading from disk on mount
  const { isScanning, progress, currentDir, startScan } = useScanLibrary();

  // Show modal on first launch when no directories exist; keep open until user dismisses
  const [showModal, setShowModal] = useState(false);
  const modalChecked = useRef(false);
  useEffect(() => {
    if (dirsLoaded && !modalChecked.current) {
      modalChecked.current = true;
      if (directories.length === 0) setShowModal(true);
    }
  }, [dirsLoaded, directories.length]);

  // Full-screen scan loader triggered from the modal
  const [showScanLoader, setShowScanLoader] = useState(false);
  const prevScanning = useRef(false);
  useEffect(() => {
    if (prevScanning.current && !isScanning) {
      setShowScanLoader(false);
    }
    prevScanning.current = isScanning;
  }, [isScanning]);

  if (!libraryLoaded || !dirsLoaded) {
    return <LoadingScreen />;
  }

  const handleAddDirectory = async () => {
    const path = await window.electronAPI.selectDirectory();
    if (path) addDirectory(path);
  };

  const handleScanFromModal = () => {
    setShowModal(false);
    setShowScanLoader(true);
    startScan(directories);
  };

  return (
    <>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
      {showModal && (
        <RootDirectoryModal
          directories={directories}
          onAdd={handleAddDirectory}
          onRemove={removeDirectory}
          onScan={handleScanFromModal}
          onClose={() => setShowModal(false)}
        />
      )}
      {showScanLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 rounded-3xl animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14 text-amber-600 dark:text-amber-400 animate-spin" style={{ animationDuration: '3s' }}>
                <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
                <ellipse cx="12" cy="12" rx="10" ry="4"/>
                <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
                <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-white mb-2">Scanning your library...</p>
              <p className="text-sm text-gray-300">{progress}% complete</p>
              {currentDir && (
                <p className="text-xs text-gray-400 mt-1 max-w-xs truncate">{currentDir}</p>
              )}
            </div>
            <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <SettingsProvider>
      <FontSizeProvider>
        <I18nextProvider i18n={i18n}>
          <AppInner />
        </I18nextProvider>
      </FontSizeProvider>
    </SettingsProvider>
  );
}

export default App;
